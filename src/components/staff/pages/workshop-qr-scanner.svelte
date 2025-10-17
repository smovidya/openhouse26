<script lang="ts">
  import {
    alert,
    confirm,
    isDialogOpen,
  } from "@src/components/common/drawer-alert-dialog.svelte";
  import DrawerButton from "@src/components/common/drawer-button.svelte";
  import Drawer from "@src/components/common/drawer.svelte";
  import ChangeRoundButton from "@src/components/staff/change-round-button.svelte";
  import ManualIdDialog from "@src/components/staff/manual-id-dialog.svelte";
  import NavigationRails from "@src/components/staff/navigation-rails.svelte";
  import WorkshopAttendeeList from "@src/components/staff/pages/workshop-attendee-list.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import { cn } from "@src/components/utils";
  import { workshops } from "@src/data/workshops";
  import { actions } from "astro:actions";
  import { PersistedState, resource } from "runed";

  let isWorkshopSelectorOpen = $state(false);
  let isConfirmDialogOpen = $state(false);
  let isIdInputtingDialogOpen = $state(false);

  let mode = $state("checkin" as "checkin" | "add");
  const scanning = $derived(
    !(
      isWorkshopSelectorOpen ||
      isConfirmDialogOpen ||
      isIdInputtingDialogOpen ||
      isDialogOpen.current
    ),
  );

  // Workshop and timeslot selection ------------------------------------

  const selectedWorkshopId = new PersistedState(
    "workshop-qr-scanner:selectedWorkshop",
    {
      workshopId: "foodtech-playground",
      roundNumber: 1,
    },
  );
  const selectedWorkshop = $derived(
    workshops.find((it) => it.id === selectedWorkshopId.current.workshopId)!,
  );
  const selectedTimeSlot = $derived(
    selectedWorkshop?.slots.find(
      (it) => it.round === selectedWorkshopId.current.roundNumber,
    )!,
  );

  // svelte-ignore state_referenced_locally : I know
  let dialogWorkshop = $state($state.snapshot(selectedWorkshopId.current));
  // $inspect(dialogWorkshop)

  function launchWorkshopSelector() {
    dialogWorkshop = $state.snapshot(selectedWorkshopId.current);
    isWorkshopSelectorOpen = true;
  }

  function updateSelectedWorkshop() {
    selectedWorkshopId.current = $state.snapshot(dialogWorkshop);
    isWorkshopSelectorOpen = false;
  }

  // Scanning ------------------------------------------------------------

  let currentQrId: string | null = $state(null);
  const user = resource(
    () => [], // fuck this, we are doing manual refetching
    async () => {
      if (!currentQrId) {
        return;
      }
      const { data, error } = await actions.getParticipantByIdOrQrCodeId({
        participantIdOrQrCodeId: currentQrId,
      });
      if (error) {
        throw new Error(error.message);
      }
      if (!data) {
        throw new Error("No user found");
      }

      return data;
    },
    {
      lazy: true,
    },
  );

  const workshopData = resource(
    [
      () => selectedWorkshopId.current.workshopId,
      () => selectedWorkshopId.current.roundNumber,
    ],
    async ([workshopId, roundNumber], _, { signal }) => {
      const { data, error } = await actions.getWorkshopRegistrationByWorkshop({
        workshopId: workshopId,
        workshopRoundNumber: roundNumber,
      });

      if (error) {
        alert({
          title: "เกิดข้อผิดพลาด",
          description: error.message,
        });
      }

      return data;
    },
  );

  async function onResult(value: string) {
    currentQrId = value;
    isConfirmDialogOpen = true;
    const p = user.refetch();
    const ok = await confirm({
      title: "ยืนยันการเช็คอิน",
      description: confirmDialogBody,
      blockConfirmUntil: p,
    });

    isConfirmDialogOpen = false;

    if (!ok || user.error) {
      return;
    }

    const { data, error } = await actions.staffCheckinWorkshop({
      participantIdOrQrCodeId: currentQrId!,
      workshopId: selectedWorkshopId.current.workshopId,
      roundNumber: String(selectedWorkshopId.current.roundNumber),
    });

    if (error) {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
      });
      workshopData.refetch();
      return;
    }

    // data is void | undefined
    alert({
      title: "บันทึกข้อมูลเรียบร้อย",
      description: "เย่",
    });
    workshopData.refetch();
  }

  function openSelfIdInputtingDialog() {
    isIdInputtingDialogOpen = true;
  }

  function onSelfIdInputtingDialogDone(value: string) {
    isIdInputtingDialogOpen = false;
    onResult(value);
  }
</script>

<QrcodeScannerBase enable={scanning} {onResult}>
  {#snippet header()}
    <h2
      class={cn(
        "text-4xl bg-base-200/80 font-normal mt-9 p-4 px-9",
        mode === "add" ? "bg-error text-base-100" : "",
      )}
    >
      <span class="font-bold"
        >{mode === "checkin" ? "เช็คอิน" : "เพิ่มคนเข้า"}</span
      >
      <span class="text-lg">
        {selectedWorkshop.title}
      </span>
      <span class="font-mono font-bold">
        {selectedTimeSlot.start}
      </span>
    </h2>
  {/snippet}
  {#snippet notSoBottomUi()}
    <NavigationRails
      bind:selected={mode}
      items={[
        {
          label: "เช็คอิน",
          value: "checkin",
        },
        {
          label: "เพิ่มคน",
          value: "add",
        },
      ]}
    />
  {/snippet}
  {#snippet bottomUi()}
    <ChangeRoundButton
      onclick={launchWorkshopSelector}
      title="{selectedWorkshop.title} ({selectedWorkshop.hostDepartmentAbbr})"
      subtitle="รอบ {selectedTimeSlot.start} - {selectedTimeSlot.end}"
    />
  {/snippet}
</QrcodeScannerBase>

<section class="px-8 mt-3 font-serif">
  <div class="flex flex-col items-center">
    <button
      class="px-4 py-1.5 rounded-md active:bg-black/10 text-yellow-600"
      onclick={openSelfIdInputtingDialog}
    >
      สแกนไม่ติด? <span class="underline underline-offset-2"
        >กรอกโค้ดด้วยตนเอง</span
      >
    </button>
  </div>
</section>

<WorkshopAttendeeList
  bind:workshopId={selectedWorkshopId.current.workshopId}
  bind:roundNumber={selectedWorkshopId.current.roundNumber}
  {workshopData}
/>

<Drawer bind:open={isWorkshopSelectorOpen}>
  {#snippet header()}
    <h2 class="text-3xl">เปลี่ยนเวิร์กช็อปและรอบ</h2>
  {/snippet}
  <section class="mx-6 flex flex-col gap-3">
    <label class="flex flex-col gap-1">
      <span>เวิร์กช็อป</span>
      <select
        class="select"
        bind:value={
          () => dialogWorkshop.workshopId,
          (value) => {
            dialogWorkshop.workshopId = value;
            dialogWorkshop.roundNumber = 1;
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
        class="select"
        bind:value={
          () => String(dialogWorkshop.roundNumber),
          (value) => (dialogWorkshop.roundNumber = parseInt(value))
        }
      >
        {#each workshops.find((it) => it.id === dialogWorkshop.workshopId)?.slots ?? [] as slot}
          <option value={String(slot.round)}
            >รอบ {slot.start.toString()} - {slot.end.toString()}</option
          >
        {/each}
      </select>
    </label>
  </section>
  {#snippet buttons()}
    <DrawerButton onclick={updateSelectedWorkshop}>ตกลง</DrawerButton>
  {/snippet}
</Drawer>

{#snippet confirmDialogBody()}
  {#if user.loading}
    <div class="flex gap-2 flex-row justify-center items-center">
      <span class="loading loading-dots"></span>
      <span>กำลังโหลด...</span>
    </div>
  {/if}
  {#if user.error}
    <div class="alert alert-error">
      <span>{user.error}</span>
    </div>
  {/if}
  {#if user.current && !user.loading && !user.error}
    {@const participant = user.current.participant}
    <div class="flex justify-between">
      <span>ชื่อ</span>
      <span class="text-2xl"
        >{participant.givenName} {participant.familyName}</span
      >
    </div>
    <div class="flex justify-between">
      <span>สถานะ</span>
      <span class="text-xl">{participant.attendeeType}</span>
    </div>
    <div class="flex justify-between">
      <span>อายุ</span>
      <span>{participant.age} ปี</span>
    </div>
    <div class="flex justify-between">
      <span>ความต้องการพิเศษ</span>
      <span>{participant.specialNeeds}</span>
    </div>
  {/if}
{/snippet}

<ManualIdDialog
  headerText="กรอกโค้ด{mode === 'checkin' ? 'เช็คอิน' : 'เพิ่มคน'}"
  subText="ผู้เข้าร่วมสามารถดูได้ใต้ Qr Code ในหน้า MyID"
  bind:open={isIdInputtingDialogOpen}
  onDone={onSelfIdInputtingDialogDone}
/>
