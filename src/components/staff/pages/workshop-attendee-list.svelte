<script lang="ts">
  import { cn } from "@src/components/utils";
  import { workshops } from "@src/data/workshops";
  import { actions, type Actions } from "astro:actions";
  import { resource, type ResourceReturn } from "runed";

  interface Props {
    workshopId?: string;
    roundNumber?: number;
    workshopData: ResourceReturn<
      Awaited<ReturnType<Actions["getWorkshopRegistrationByWorkshop"]>>["data"]
    >;
  }

  let {
    roundNumber = $bindable(1),
    workshopId = $bindable(workshops[0].id),
    workshopData,
  }: Props = $props();

  let registeredOnsiteParticipants = $derived(
    workshopData.current?.registrations.filter(
      (v) => v.registrationType === "on-site",
    ),
  );
  let preRegisteredParticipants = $derived(
    workshopData.current?.registrations.filter(
      (v) => v.registrationType === "pre-registration",
    ),
  );

  let preRegisteredParticipantsCount = $derived(
    preRegisteredParticipants?.length ?? 0,
  );
  let preRegisteredAttendeesCheckedCount = $derived(
    preRegisteredParticipants?.filter((p) => p.participatedAt).length ?? 0,
  );
  let registeredOnsiteParticipantsCount = $derived(
    registeredOnsiteParticipants?.length ?? 0,
  );
  let totalParticipantsCount = $derived(
    preRegisteredParticipantsCount + registeredOnsiteParticipantsCount,
  );

  async function onToggleChange(participantId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;
    input.disabled = true;

    if (checked) {
      const { data, error } = await actions.staffCheckinWorkshop({
        participantIdOrQrCodeId: participantId,
        workshopId,
        roundNumber: String(roundNumber),
      });

      if (error) {
        input.checked = false;
        alert(error.message);
      } else {
        workshopData.refetch();
      }
    } else {
      const { data, error } =
        await actions.staffRemoveCheckinWorkshopForPreregisteredParticipant({
          participantIdOrQrCodeId: participantId,
          workshopId,
          roundNumber: String(roundNumber),
        });
      if (error) {
        input.checked = true;
        alert(error.message);
      } else {
        workshopData.refetch();
      }
    }

    input.disabled = false;
  }
</script>

{#snippet checkToggle(participantId: string, initChecked: boolean)}
  <input
    type="checkbox"
    class="toggle peer"
    checked={initChecked}
    onchange={(e) => onToggleChange(participantId, e)}
  />
{/snippet}

<h2 class="mt-6 mb-4">รายชื่อผู้เข้าร่วม</h2>

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

  <div class="bg-neutral-100 rounded-xl flex flex-col p-3 mt-6">
    {#if workshopData.loading}
      <div class="flex items-center w-full justify-center py-10">
        <span class="loading loading-spinner"></span>
      </div>
    {:else if workshopData.error}
      <div class="alert alert-error">
        <p>
          เกิดข้อผิดพลาด: {workshopData.error.message}
        </p>
      </div>
    {:else}
      <div class="flex justify-between">
        <span>เช็คอินแล้ว</span>
        <span
          >{preRegisteredAttendeesCheckedCount}/{preRegisteredParticipantsCount}
          คน</span
        >
      </div>
      <div class="flex justify-between">
        <span>เพิ่มคน</span>
        <span>{registeredOnsiteParticipantsCount} คน</span>
      </div>
      <div class="flex justify-between">
        <span>รวม</span>
        <span>{totalParticipantsCount} คน</span>
      </div>
    {/if}
  </div>
</section>

<h2 class="mt-6 mb-2">
  คนที่ลงทะเบียนล่วงหน้า {#if workshopData.loading}
    <span class="loading loading-dots"></span>
  {:else if workshopData.error}
    (ไม่สามารถโหลดข้อมูลได้)
  {:else if preRegisteredParticipantsCount === 0}
    (ไม่มีคนลงทะเบียนล่วงหน้า)
  {:else}
    (เช็คอินแล้ว {preRegisteredAttendeesCheckedCount} /
    {preRegisteredParticipantsCount} คน)
  {/if}
</h2>
<section class="-mx-6">
  {#each preRegisteredParticipants as p (p.id)}
    <div
      class={cn(
        "flex justify-between items-center px-6 py-2 has-checked:bg-lime-600 has-checked:text-white",
      )}
    >
      <div class="flex flex-col leading-5">
        <span>{p.participant.givenName} {p.participant.familyName}</span>
        <span class={cn("text-sm []")}>{p.participant.user.email}</span>
      </div>
      {@render checkToggle(p.participantId, !!p.participatedAt)}
    </div>
  {:else}
    <div class="p-6 text-center text-sm opacity-75">
      ไม่มีคนลงทะเบียนล่วงหน้า
    </div>
  {/each}
</section>

<h2 class="mt-6 mb-2">
  คนที่เพิ่ม {#if workshopData.loading}
    <span class="loading loading-dots"></span>
  {/if}
</h2>
<section class="-mx-6">
  {#if workshopData.loading}
    <div class="flex items-center w-full justify-center py-10">
      <span class="loading loading-spinner"></span>
    </div>
  {:else if workshopData.error}
    <div class="alert alert-error">
      <p>
        เกิดข้อผิดพลาด: {workshopData.error.message}
      </p>
    </div>
  {/if}

  {#each registeredOnsiteParticipants as p (p.id)}
    <div
      class="flex justify-between items-center pl-6 pr-2 py-2 bg-amber-600 text-white"
    >
      <div class="flex flex-col leading-5">
        <span>{p.participant.givenName} {p.participant.familyName}</span>
        <span class="text-sm text-lime-100">{p.participant.user.email}</span>
      </div>
      <!-- 
        Im lazy to implement remove onsite participant
        so just comment this out for now
      <button
        class="underline active:bg-lime-700/50 rounded-md px-4 py-1 underline-offset-2"
      >
        ยกเลิก
      </button> -->
    </div>
  {:else}
    <div class="p-6 text-center text-sm opacity-75">ไม่มีคนที่เพิ่ม</div>
  {/each}
</section>
