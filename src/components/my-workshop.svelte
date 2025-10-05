<script lang="ts">
  import type { SelectedWorkshop } from "@src/client/shared-state.svelte";

  // i know this can be a staic astro file
  // but dont question it

  interface Props {
    class: any;
    selectedWorkshops: SelectedWorkshop[];
  }

  let { class: className, selectedWorkshops }: Props = $props();
</script>

<section class="mt-8 text-sm text-blue-300/85 font-serif">
  <h2 class="text-2xl text-white">My workshops</h2>
  <div class="flex justify-between text-md">
    <span> เวิร์กช็อปที่ลงทะเบียนแล้ว ({selectedWorkshops.length}/3) </span>
    <a href="/workshops" class="underline underline-offset-2">ดูทั้งหมด →</a>
  </div>
  {#each selectedWorkshops as { timeSlotIndex, workshopId }}{:else}
    <div class="p-4 flex justify-center items-center h-42 mt-6 border-2 border-dashed border-blue-300/35 rounded-xl shadow-inner shadow-black/45 bg-blue-950/25">
      <span class="text-sm text-blue-300/60"> ยังไม่ได้ลงทะเบียน </span>
    </div>
  {/each}
</section>
