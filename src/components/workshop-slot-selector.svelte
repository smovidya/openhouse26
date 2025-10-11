<script lang="ts">
  import type { SelectedWorkshop } from "@src/type";
  import { getWorkshopById, workshops } from "@src/data/workshops";
  import { debounced } from "@src/utils/state.svelte";
  import { toLocalDateString } from "@src/utils/time";
  import CheckmarkFilled from "carbon-icons-svelte/lib/CheckmarkFilled.svelte";
  import clsx from "clsx";
  import { onMount, untrack } from "svelte";
  import { actions } from "astro:actions";
  import type { workshopModel } from "@src/db";

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
     * Record of round number and count
     */
    initialRegisterCount: Awaited<
      ReturnType<typeof workshopModel.getRegisteredParticipantCount>
    >;
  }

  let {
    class: className,
    workshopId,
    initialSelectedWorkshops,
    initialRegisterCount,
  }: Props = $props();

  const workshop = workshops.find((it) => it.id === workshopId)!;

  // undefined = not select
  const otherSelectedWorkshops = $derived(
    initialSelectedWorkshops.filter((it) => it.workshopId !== workshopId),
  );
  const initialSelected = initialSelectedWorkshops.find(
    (it) => it.workshopId === workshopId,
  )?.roundNumber;

  let currentRound = $state(initialSelected);
  let selectedRounded = $state(initialSelected);

  let registerCount = $state(initialRegisterCount);

  function toggle(roundedNumber: number) {
    changed = true;
    if (currentRound === roundedNumber) {
      selectedRounded = undefined;
    } else if (selectedRounded === roundedNumber) {
      selectedRounded = undefined;
    } else {
      selectedRounded = roundedNumber;
    }
  }

  async function refreshRegistrationInfo() {
    const { error, data } = await actions.myCurrentRegistrationsForWorkshop({
      workshopId: workshopId,
    });

    if (error) {
      alert("เกิดข้อผิดพลาดขณะรีเฟรชข้อมูล: " + error.message);
      throw error;
    }

    if (data) {
      registerCount = data.registeredParticipantsCount;
      initialSelectedWorkshops = data.registrations.map((it) => ({
        workshopId: it.workshopId,
        roundNumber: it.roundNumber,
      }));
      currentRound = data.registrations.find(
        (it) => it.workshopId === workshopId,
      )?.roundNumber;
    }
  }

  function shouldDisabled(roundNumber: number) {
    const slot = workshop.slots.find((it) => it.round === roundNumber)!;

    if (initialSelectedWorkshops.length >= 2 && currentRound !== roundNumber) {
      return {
        disabled: true,
        maximumReached: true,
      };
    }

    const currentSlot = registerCount.find(
      (it) => it.roundNumber === roundNumber,
    );
    if (!currentSlot) {
      // wtf
      return {
        disabled: false,
      } as const;
    }

    if (
      (currentSlot.count ?? 0) >= workshop.capacity &&
      currentRound !== roundNumber
    ) {
      return {
        disabled: true,
        full: true,
      };
    }

    for (const { roundNumber, workshopId } of otherSelectedWorkshops) {
      const w = getWorkshopById(workshopId);
      const other = w?.slots.find((it) => it.round === roundNumber);
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

  async function saveSelected(roundedNumber: number | undefined) {
    // if undefined, delete
    if (roundedNumber === undefined) {
      const { data, error } = await actions.removeMeFromSlot({
        workshopId: workshop.id,
      });

      if (error) {
        alert("เกิดข้อผิดพลาดขณะลบ: " + error.message);
        await refreshRegistrationInfo();
        selectedRounded = currentRound;
        submitState = "error";
        throw error;
      }

      await refreshRegistrationInfo();
      submitState = "saved";
    } else {
      const slot = workshop.slots.find((it) => it.round === roundedNumber);
      if (!slot) {
        alert("เกิดข้อผิดพลาดขณะลงทะเบียน: เวลาที่เลือกไม่ถูกต้อง");
        throw new Error("invalid slot roundedNumber");
      }

      const { data, error } = await actions.registerMeToSlot({
        roundNumber: slot.round,
        workshopId: workshop.id,
      });

      if (error) {
        submitState = "error";
        alert("เกิดข้อผิดพลาดเกิดข้อผิดพลาดขณะลงทะเบียน: " + error.message);
        await refreshRegistrationInfo();
        selectedRounded = currentRound;
        submitState = "error";
        throw error;
      }

      await refreshRegistrationInfo();
      submitState = "saved";
    }
  }

  const debouncedRounded = debounced({
    getter: () => selectedRounded,
    debouncedTimeMs: 500,
  });

  let firstRun = true;
  $effect(() => {
    const round = debouncedRounded.current;
    if (firstRun) {
      firstRun = false;
      return;
    }
    if (round === currentRound) {
      // no change
      submitState = "none";
      return;
    }
    untrack(() => saveSelected(round));
  });

  let changed = $state(false);
  let submitState = $state<"none" | "saved" | "saving" | "error">("none");
  $effect(() => {
    if (debouncedRounded.pending) {
      submitState = "saving";
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
      {@const status = shouldDisabled(slot.round)}
      {@const currentCount = registerCount.find(
        (it) => it.roundNumber === slot.round,
      )}
      <button
        disabled={status.disabled}
        class={clsx(
          "rounded-lg border py-1.5 px-3 transition-all cursor-pointer text-left flex justify-between items-center",
          currentRound !== slot.round &&
            "disabled:text-blue-200/60  disabled:hover:bg-transparent disabled:hover:cursor-not-allowed",
          currentRound === slot.round
            ? "text-white shadow-inner shadow-black/50 bg-blue-950/50 hover:bg-blue-950/60 border-white/30"
            : "text-blue-50 border-blue-200/30 shadow shadow-black/20 hover:bg-white/5",
        )}
        onclick={() => toggle(slot.round)}
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
            {:else if currentRound === slot.round}
              คุณเลือกเวิร์กช็อปเวลานี้ (กดซ้ำเพื่อยกเลิก)
            {/if}
          </p>
        </div>
        <div class="text-sm flex items-center gap-3">
          <span>
            {currentCount?.count ?? 0} / {workshop.capacity}
          </span>
          {#if slot.round === selectedRounded}
            <CheckmarkFilled class="size-4" />
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <div class="mt-4 h-5">
    {#if changed}
      <p class="text-blue-300/95 text-center">
        {#if submitState === "saved"}
          บันทึกแล้ว
        {:else if submitState === "saving"}
          กำลังบันทึก{".".repeat(dotCount)}
        {:else if submitState === "error"}
          เกิดข้อผิดพลาดในการบันทึก
        {/if}
      </p>
    {/if}
  </div>
</section>
