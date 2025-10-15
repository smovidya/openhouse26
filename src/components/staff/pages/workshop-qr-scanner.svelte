<script lang="ts">
  import Drawer from "@src/components/common/drawer.svelte";
  import Navbar from "@src/components/staff/navbar.svelte";
  import ChangeRoundButton from "@src/components/staff/change-round-button.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import NavigationRails from "@src/components/staff/navigation-rails.svelte";
  import { resource, ScrollState } from "runed";
  import { workshops } from "@src/data/workshops";
  import { cn } from "@src/components/utils";
  import DrawerButton from "@src/components/common/drawer-button.svelte";
  import ManualIdDialog from "@src/components/staff/manual-id-dialog.svelte";
  import WorkshopAttendeeList from "@src/components/staff/pages/workshop-attendee-list.svelte";
  import { actions } from "astro:actions";

  const scroll = new ScrollState({
    element: () => window,
  });
  const isAtTop = $derived(scroll.progress.y <= 60);

  let isWorkshopSelectorOpen = $state(false);
  let isConfirmDialogOpen = $state(false);
  let isIdInputtingDialogOpen = $state(false);

  let mode = $state("checkin" as "checkin" | "add");
  const scanning = $derived(
    !(
      isWorkshopSelectorOpen ||
      isConfirmDialogOpen ||
      isIdInputtingDialogOpen
    ) && isAtTop,
  );

  // Workshop and timeslot selection ------------------------------------

  // TODO: save this to localstorage
  let selectedWorkshopId = $state({
    workshopId: "foodtech-playground",
    roundNumber: 1,
  });
  const selectedWorkshop = $derived(
    workshops.find((it) => it.id === selectedWorkshopId.workshopId)!,
  );
  const selectedTimeSlot = $derived(
    selectedWorkshop?.slots.find(
      (it) => it.round === selectedWorkshopId.roundNumber,
    )!,
  );

  // svelte-ignore state_referenced_locally : I know
  let dialogWorkshop = $state($state.snapshot(selectedWorkshopId));
  // $inspect(dialogWorkshop)

  function launchWorkshopSelector() {
    dialogWorkshop = $state.snapshot(selectedWorkshopId);
    isWorkshopSelectorOpen = true;
  }

  function updateSelectedWorkshop() {
    selectedWorkshopId = $state.snapshot(dialogWorkshop);
    isWorkshopSelectorOpen = false;
  }

  // Scanning ------------------------------------------------------------

  // we should actually cache these data in case of workshop
  let currentQrId: string | null = $state(null);
  const user = resource(
    () => currentQrId,
    async () => {
      if (!currentQrId) {
        alert("No QR code scanned");
        return;
      }
      const { data, error } = await actions.getParticipantByIdOrQrCodeId({
        participantIdOrQrCodeId: currentQrId,
      });
      if (error) {
        alert(error.message);
        return;
      }
      if (!data) {
        alert("No user found");
        return;
      }
      return {
        data,
      };
    },
    {
      lazy: true,
    },
  );

  function onResult(value: string) {
    currentQrId = value;
    isConfirmDialogOpen = true;
    user.refetch();
  }

  async function onScanConfirmed() {
    isConfirmDialogOpen = false;
    const { data, error } = await actions.staffCheckinWorkshop({
      participantIdOrQrCodeId: currentQrId!,
      workshopId: selectedWorkshopId.workshopId,
      roundNumber: String(selectedWorkshopId.roundNumber),
    });

    if (error) {
      alert(error.message);
    }
    if (data) {
      alert("บันทึกข้อมูลเรียบร้อย");
    }
  }

  function openSelfIdInputtingDialog() {
    isIdInputtingDialogOpen = true;
  }

  function onSelfIdInputtingDialogDone(value: string) {
    isIdInputtingDialogOpen = false;
    let cached = value;
    // setTimeout(() => {
    onResult(cached);
    // }, 200);
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
  bind:workshopId={selectedWorkshopId.workshopId}
  bind:roundNumber={selectedWorkshopId.roundNumber}
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

<Drawer bind:open={isConfirmDialogOpen}>
  {#snippet header()}
    <h2 class="text-3xl">
      ยืนยันการ{mode === "checkin" ? "เช็คอิน" : "เพิ่มคน"}
    </h2>
  {/snippet}
  <p class="mx-6 mt-3">
    {#if !user.loading}
      {JSON.stringify(user.current)}
      name, email, mission, workshop, รอบ
    {/if}
  </p>
  {#snippet buttons()}
    <DrawerButton
      variant="neutral"
      onclick={() => (isConfirmDialogOpen = false)}
    >
      ยกเลิก
    </DrawerButton>
    <DrawerButton onclick={onScanConfirmed}>ตกลง</DrawerButton>
  {/snippet}
</Drawer>

<ManualIdDialog
  headerText="กรอกโค้ด{mode === 'checkin' ? 'เช็คอิน' : 'เพิ่มคน'}"
  subText="ผู้เข้าร่วมสามารถดูได้ใต้ Qr Code ในหน้า MyID"
  bind:open={isIdInputtingDialogOpen}
  onDone={onSelfIdInputtingDialogDone}
/>
