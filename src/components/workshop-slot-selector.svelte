<script lang="ts">
  import type { SelectedWorkshop } from "@src/client/shared-state.svelte";
  import { getWorkshopById, workshops } from "@src/data/workshops";
  import { debounced } from "@src/utils/state.svelte";
  import { toLocalDateString } from "@src/utils/time";
  import CheckmarkFilled from "carbon-icons-svelte/lib/CheckmarkFilled.svelte";
  import clsx from "clsx";
  import { onMount, untrack } from "svelte";
  import { actions } from "astro:actions";

  interface Props {
    class?: any;
    workshopId: string;
    // initialSelected?: number;

    /**
     * we need to pass every workshop select info here to determine if its ห่างกัน 1 ชั่วโมง
     */
    initialSelectedWorkshops: SelectedWorkshop[];

    /**
     * this too, for ssr, we can indeed refetch this at the client every n sec
     *
     * count's index match each slot index
     */
    initialRegisterCount: number[];
  }

  let {
    class: className,
    workshopId,
    initialSelectedWorkshops,
    initialRegisterCount,
  }: Props = $props();

  const workshop = workshops.find((it) => it.id === workshopId)!;

  // undefined = not select
  const otherSelectedWorkshops = initialSelectedWorkshops.filter(
    (it) => it.workshopId !== workshopId
  );
  const initialSelected = initialSelectedWorkshops.find(
    (it) => it.workshopId === workshopId
  )?.timeSlotIndex;
  let selectedIndex = $state(initialSelected);

  let registerCount = $state(initialRegisterCount);

  function toggle(index: number) {
    changed = true;
    if (selectedIndex === index) {
      selectedIndex = undefined;
    } else {
      selectedIndex = index;
    }
  }

  function shouldDisabled(index: number) {
    const slot = workshop.slots[index]!;

    if (initialSelectedWorkshops.length >= 2 && selectedIndex !== index) {
      return {
        disabled: true,
        maximumReached: true,
      };
    }

    if ((registerCount.at(index) ?? 0) > workshop.capacity) {
      return {
        disabled: true,
        full: true,
      };
    }

    for (const { timeSlotIndex, workshopId } of otherSelectedWorkshops) {
      const w = getWorkshopById(workshopId);
      const other = w?.slots.at(timeSlotIndex);
      if (!other) {
        // wtf
        continue;
      }

      if (slot.isIn1Hour(other)) {
        return {
          disabled: true,
          collidedWith: w,
        } as const;
      }
    }

    return {
      disabled: false,
    } as const;
  }

  // submission -------------

  async function saveSelected(index: number | undefined) {
    // if undefined, delete
    if (index === undefined) {
      const { data, error } = await actions.removeMeFromSlot({
        workshopId: workshop.id,
      });

      if (error) {

    saved = true;
        alert("เกิดข้อผิดพลาดขณะลบ: " + error.message);
        throw error;
      }

      if (data) {
        registerCount = data.data.updatedWorkshopCounts;
      }
    } else {
      const slot = workshop.slots[index];
      if (!slot) {
        alert("เกิดข้อผิดพลาดขณะลงทะเบียน: เวลาที่เลือกไม่ถูกต้อง");
        throw new Error("invalid slot index");
      }

      const { data, error } = await actions.registerMeToSlot({
        roundNumber: slot.round,
        workshopId: workshop.id,
      });

      if (error) {
        saved = true;
        alert("เกิดข้อผิดพลาดเกิดข้อผิดพลาดขณะลงทะเบียน: " + error.message);
        throw error;
      }

      if (data) {
        registerCount = data.data.updatedWorkshopCounts;
      }
    }
  }

  const debouncedIndex = debounced({
    getter: () => selectedIndex,
    debouncedTimeMs: 500,
  });

  $effect(() => {
    if (!changed) {
      return;
    }
    const index = debouncedIndex.current;
    untrack(() => saveSelected(index));
  });

  let changed = $state(false);
  let saved = $state(true);
  $effect(() => {
    if (debouncedIndex.pending) {
      saved = false;
    }
  });

  let dotCount = $state(0);
  onMount(() => {
    setInterval(() => {
      dotCount = (dotCount % 3) + 1;
    }, 500);
  });
</script>

<section class={clsx("", className)}>
  <h2 class="text-white text-2xl">เลือกเพื่อลงทะเบียนรอบการทำกิจกรรม</h2>
  <p class="text-blue-300">
    กดที่เวลาเพื่อเลือก กดซ้ำเพื่อยกเลิก
    บางรายการอาจเลือกไม่ได้เนื่องจากติดเงื่อนไข
  </p>

  <h3 class="text-white text-xl mt-5">
    {toLocalDateString(workshop.slots[0].date)}
  </h3>
  <div class="grid gap-2 mt-2">
    {#each workshop.slots as slot, index}
      {@const status = shouldDisabled(index)}
      <button
        disabled={status.disabled}
        class={clsx(
          "rounded-lg border py-1.5 px-3 transition-all cursor-pointer text-left flex justify-between items-center",
          "disabled:text-blue-200/60  disabled:hover:bg-transparent disabled:hover:cursor-not-allowed",
          index === selectedIndex
            ? "text-white shadow-inner shadow-black/50 bg-blue-950/50 hover:bg-blue-950/60 border-white/30"
            : "text-blue-50 border-blue-200/30 shadow shadow-black/20 hover:bg-white/5"
        )}
        onclick={() => toggle(index)}
      >
        <div>
          <span class="text-sm">
            {slot.start.toString()} - {slot.end.toString()} น.
          </span>
          <p class="text-left text-sm leading-4">
            {#if status.collidedWith}
              เวลาใกล้กับ <span class="text-blue-50/70"
                >{status.collidedWith.title}</span
              >
            {:else if status.full}
              เต็ม
            {:else if status.maximumReached}
              เลือกเวิร์กช็อปครบแล้ว
            {/if}
          </p>
        </div>
        <div class="text-sm flex items-center gap-3">
          <span>
            {registerCount.at(index) ?? 0} / {workshop.capacity}
          </span>
          {#if index === selectedIndex}
            <CheckmarkFilled class="size-4" />
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <div class="mt-4 h-5">
    {#if changed}
      <p class="text-blue-300/95 text-center">
        {#if saved}
          บันทึกแล้ว
        {:else}
          กำลังบันทึก{".".repeat(dotCount)}
        {/if}
      </p>
    {/if}
  </div>
</section>
