<script lang="ts">
  import type { SelectedWorkshop } from "@src/client/shared-state.svelte";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import WorkshopCard from "./workshop-card.svelte";
  import { getWorkshopById } from "@src/data/workshops";

  // i know this can be a staic astro file
  // but dont question it

  interface Props {
    class: any;
    selectedWorkshops: SelectedWorkshop[];
  }

  let { class: className, selectedWorkshops }: Props = $props();
</script>

<section class="mt-8 mb-6 text-sm text-blue-300/85 font-serif">
  <h2 class="text-2xl text-white">My workshops</h2>
  <div class="flex justify-between text-md">
    <span> เวิร์กช็อปที่ลงทะเบียนแล้ว ({selectedWorkshops.length}/3) </span>
    <a href="/workshops" class="underline underline-offset-2">ดูทั้งหมด →</a>
  </div>

  <div class="mt-6">
    {#each selectedWorkshops as { timeSlotIndex, workshopId }}
      {@const workshop = getWorkshopById(workshopId)!}
      {@const slot = workshop.slots[timeSlotIndex]}
      <WorkshopCard
        class="text-white"
        selectedTimeSlotText="({slot.start.toString()} - {slot.end.toString()} น.)"
        variant="red"
        {workshop}
      />
    {/each}

    {#if selectedWorkshops.length !== 3}
      <a
        href="/workshops"
        class="p-4 flex flex-col justify-center items-center h-42 mt-6 border-2 border-dashed border-blue-300/35 shadow-inner shadow-black/45 bg-blue-950/25"
      >
        <Add class="size-9 text-blue-300" />
        <h3 class="text-lg text-blue-200">ลงทะเบียนเพิ่ม</h3>
        <p class="text-sm text-blue-300/85">
          คุณลงทะเบียนได้อีก {3 - selectedWorkshops.length} เวิร์กช็อป
        </p>
      </a>
    {/if}
  </div>
</section>
