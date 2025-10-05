<script lang="ts">
  import type { SelectedWorkshop } from "@src/client/shared-state.svelte";
  import { getWorkshopById, TimeSlot, workshops } from "@src/data/workshops";
  import { debounced } from "@src/utils/state.svelte";
  import { toLocalDateString } from "@src/utils/time";
  import CheckmarkFilled from "carbon-icons-svelte/lib/CheckmarkFilled.svelte";

  import clsx from "clsx";

  interface Props {
    class?: any;
    workshopId: string;
    // initialSelected?: number;

    /**
     * we need to pass every workshop select info here to determine if its ห่างกัน 1 ชั่วโมง
     */
    initialSelectedWorkshops?: SelectedWorkshop[];

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
    initialSelectedWorkshops = [],
    initialRegisterCount,
  }: Props = $props();

  const workshop = workshops.find((it) => it.id === workshopId)!;
  if (!workshop) {
    throw new Error("nah");
  }

  // undefined = not select
  const otherSelectedWorkshops = initialSelectedWorkshops.filter(
    (it) => it.workshopId !== workshopId,
  );
  const initialSelected = initialSelectedWorkshops.find(
    (it) => it.workshopId === workshopId,
  )?.timeSlotIndex;
  let selectedIndex = $state(initialSelected);

  let registerCount = $state(initialRegisterCount);

  function toggle(index: number) {
    if (selectedIndex === index) {
      selectedIndex = undefined;
    } else {
      selectedIndex = index;
    }
  }

  function shouldDisabled(index: number) {
    const slot = workshop.slots[index]!;

    // if (selectedIndex) {
    //   const selectedSlot = workshop?.slots[selectedIndex];
    //   if (slot.isIn1Hour(selectedSlot)) {
    //     return {
    //       disabled: true,
    //       collidedWith: workshop,
    //     };
    //   }
    // }

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

  const debouncedIndex = debounced({
    getter: () => selectedIndex,
    debouncedTimeMs: 500,
  });

  $effect(() => {
    // undefined = not select
    const index = debouncedIndex.current;

    // TODO: send to backend
    // TODO: update register count
  });
</script>

<div class={clsx("", className)}>
  <h3 class="text-white text-xl">
    {toLocalDateString(workshop.slots[0].date)}
  </h3>
  <div class="grid gap-2 mt-2">
    {#each workshop.slots as slot, index}
      {@const status = shouldDisabled(index)}
      <button
        disabled={status.disabled}
        class={clsx(
          "rounded-lg border py-1.5 px-3 transition-all cursor-pointer text-left flex justify-between items-center",
          "disabled:text-blue-200/60 disabled:bg-blue-200/5 disabled:hover:bg disabled:hover:cursor-not-allowed",
          index === selectedIndex
            ? "text-white shadow-inner shadow-black/50 bg-blue-950/50 hover:bg-blue-950/60 border-white/30"
            : "text-blue-100 border-blue-200/30 shadow shadow-black/20 hover:bg-black/10",
        )}
        onclick={() => toggle(index)}
      >
        <div>
          <span class="text-sm">
            {slot.start.toString()} - {slot.end.toString()} น.
          </span>
          <p class="text-left text-sm leading-4">
            {#if status.collidedWith}
              คุณลงเวลานี้ไม่ได้ ซ้อนกับ<span class="text-blue-50/90"
                >{status.collidedWith.title}</span
              >ที่ลงทะเบียนแล้ว
            {:else if status.full}
              เต็ม
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
</div>
