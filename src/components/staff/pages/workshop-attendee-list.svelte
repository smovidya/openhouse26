<script lang="ts">
  import { cn } from "@src/components/utils";
  import { workshops } from "@src/data/workshops";

  interface Props {
    workshopId?: string;
    roundNumber?: number;
  }

  let {
    roundNumber = $bindable(1),
    workshopId = $bindable(workshops[0].id),
  }: Props = $props();

  let checked = $state(false);
</script>

<h1 class="mt-6 mb-4">รายชื่อผู้เข้าร่วม</h1>

<section>
  <label class="flex flex-col gap-1">
    <span>เวิร์กช็อป</span>
    <select
      class="select w-full"
      bind:value={
        () => workshopId,
        (value) => {
          workshopId = value;
          roundNumber = 1;
        }
      }
    >
      {#each workshops as workshop}
        <option value={workshop.id}
          >{workshop.title} ({workshop.hostDepartmentAbbr})</option
        >
      {/each}
    </select>
  </label>

  <label class="flex flex-col gap-1">
    <span>รอบ</span>
    <select
      class="select w-full"
      bind:value={
        () => String(roundNumber), (value) => (roundNumber = parseInt(value))
      }
    >
      {#each workshops.find((it) => it.id === workshopId)?.slots ?? [] as slot}
        <option value={String(slot.round)}
          >รอบ {slot.start.toString()} - {slot.end.toString()}</option
        >
      {/each}
    </select>
  </label>

  <div class="bg-neutral-100 rounded-xl p-3 mt-6">
    <div class="flex justify-between">
      <span>เช็คอินแล้ว</span>
      <span>15/20 คน</span>
    </div>
    <div class="flex justify-between">
      <span>เพิ่มคน</span>
      <span>5 คน</span>
    </div>
    <div class="flex justify-between">
      <span>รวม</span>
      <span>20 คน</span>
    </div>
  </div>
</section>

<h2 class="mt-6 mb-2">คนที่ลงทะเบียนล่วงหน้า</h2>
<section class="-mx-6">
  <div
    class={cn(
      "flex justify-between items-center px-6 py-2",
      checked && "bg-green-600 text-white",
    )}
  >
    <div class="flex flex-col leading-5">
      <span>นายพัสกร ยืนยง</span>
      <span class={cn("text-sm", checked ? "text-green-100" : "opacity-75")}
        >somemail@gmail.com</span
      >
    </div>
    <input type="checkbox" class="toggle" bind:checked />
  </div>
</section>

<h2 class="mt-6 mb-2">คนที่เพิ่ม</h2>
<section class="-mx-6">
  <div class="flex justify-between items-center pl-6 pr-2 py-2 bg-lime-600 text-white">
    <div class="flex flex-col leading-5">
      <span>นายพัสกร ยืนยง</span>
      <span class="text-sm text-lime-100"
        >somemail@gmail.com</span
      >
    </div>
    <button class="underline active:bg-lime-700/50 rounded-md px-4 py-1 underline-offset-2"> ยกเลิก </button>
  </div>
</section>
