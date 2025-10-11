<script lang="ts">
  import type { SelectedWorkshop } from "@src/type";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import WorkshopCard from "./workshop-card.svelte";
  import { getWorkshopById } from "@src/data/workshops";
  import { featureFlags } from "@src/data/constants";

  // i know this can be a staic astro file
  // but dont question it

  interface Props {
    class: any;
    selectedWorkshops: SelectedWorkshop[];
  }

  let { class: className, selectedWorkshops }: Props = $props();
</script>

<section class="mt-8 mb-6 text-sm text-blue-300/85">
  <h2 class="text-2xl text-white font-serif">My workshops</h2>
  <div class="flex justify-between text-md">
    <span> เวิร์กช็อปที่ลงทะเบียนแล้ว ({selectedWorkshops.length}/2) </span>
    <a href="/workshops" class="underline underline-offset-2">ดูทั้งหมด →</a>
  </div>

  <div class="mt-6">
    {#each selectedWorkshops as { roundNumber, workshopId }}
      {@const workshop = getWorkshopById(workshopId)!}
      {@const slot = workshop.slots.find((it) => it.round === roundNumber)!}
      <WorkshopCard
        class="text-white"
        selectedTimeSlotText="({slot.start.toString()} - {slot.end.toString()} น. แต่ต้องแสดงตัวเวลา {slot.start.add(
          { minute: -15 },
        )} - {slot.start.add({ minute: -10 }).toString()} น. เท่านั้น)"
        variant="red"
        {workshop}
      />
    {/each}

    {#if selectedWorkshops.length < 2 || featureFlags.workshopRegistrationClosed}
      <a
        href="/workshops"
        class="p-4 flex flex-col justify-center items-center h-42 mt-6 border-2 border-dashed border-blue-300/35 shadow-inner shadow-black/45 bg-blue-950/25"
      >
        <Add class="size-9 text-blue-300" />
        <h3 class="text-lg text-blue-200">
          ลงทะเบียน{selectedWorkshops.length === 0
            ? "เข้าร่วมเวิร์กช็อป"
            : "เพิ่ม"}
        </h3>
        <p class="text-sm text-blue-300/85">
          คุณลงทะเบียนได้อีก {2 - selectedWorkshops.length} เวิร์กช็อป
        </p>
      </a>
    {/if}

    {#if featureFlags.workshopRegistrationClosed}
      <p class="mt-4 text-center text-sm text-yellow-300/90">
        การลงทะเบียนเวิร์กช็อปปิดแล้ว แต่คุณยังสามารถเข้าร่วมหน้างานได้!
        ติดตามในวันที่ 18-19 ตุลาคม เล้ย!
      </p>
    {/if}
  </div>
</section>
