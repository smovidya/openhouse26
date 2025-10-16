<script lang="ts">
  import DrawerButton from "@src/components/common/drawer-button.svelte";
  import Drawer from "@src/components/common/drawer.svelte";
  import ChangeRoundButton from "@src/components/staff/change-round-button.svelte";
  import ManualIdDialog from "@src/components/staff/manual-id-dialog.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import {
    boothCheckpoints,
    isDepartmentStaffSelectable,
  } from "@src/data/checkpoints";
  import { actions } from "astro:actions";
  import WarningAltFilled from "carbon-icons-svelte/lib/WarningAltFilled.svelte";
  import { resource, ScrollState } from "runed";

  const scroll = new ScrollState({
    element: () => window,
  });

  let isBoothSelectorOpen = $state(false);
  let isConfirmDialogOpen = $state(false);
  let isIdInputtingDialogOpen = $state(false);

  const scanning = $derived(
    !(isBoothSelectorOpen || isConfirmDialogOpen || isIdInputtingDialogOpen),
  );

  // Workshop and timeslot selection ------------------------------------

  // TODO: save this to localstorage
  let selectedBoothId = $state("bsac");
  const selectedBooth = $derived(
    boothCheckpoints.find((it) => String(it.id) === selectedBoothId)!,
  );

  // svelte-ignore state_referenced_locally : I know
  let dialogWorkshopId = $state($state.snapshot(selectedBoothId));

  function launchWorkshopSelector() {
    dialogWorkshopId = $state.snapshot(selectedBoothId);
    isBoothSelectorOpen = true;
  }

  function updateSelectedBooth() {
    selectedBoothId = $state.snapshot(dialogWorkshopId);
    isBoothSelectorOpen = false;
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
        boothId: selectedBoothId,
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

  function onResult(value: string) {
    currentQrId = value;
    isConfirmDialogOpen = true;
    user.refetch();
  }

  async function onScanConfirmed() {
    isConfirmDialogOpen = false;
    // alert(
    //   JSON.stringify({
    //     currentQrId,
    //     selectedBoothId,
    //   }),
    // );
    if (!currentQrId) {
      alert("กรุณาสแกน QR Code หรือป้อน ID");
      return;
    }
    const { data, error } = await actions.staffCheckin({
      boothId: selectedBoothId,
      participantIdOrQrCodeId: currentQrId,
    });
    if (error) {
      alert(error.message);
    }
    if (data) {
      alert("เช็คอินแล้ว");
    }
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
    <h2 class="text-3xl mt-9 bg-base-200/80 text-base-content px-9">
      กำลัง<span class="font-bold">เช็คอิน</span>{selectedBooth?.name || "???"}
    </h2>
  {/snippet}
  {#snippet bottomUi()}
    <ChangeRoundButton
      onclick={launchWorkshopSelector}
      title={selectedBooth?.name || "ไม่พบบูธ"}
      subtitle={selectedBooth?.type || "ไม่พบบูธ"}
    />
  {/snippet}
</QrcodeScannerBase>

<section class="px-8 mt-4 font-serif">
  <div class="flex flex-col items-center">
    <button
      class="px-4 py-1.5 rounded-md active:bg-black/10 text-yellow-600"
      onclick={() => (isIdInputtingDialogOpen = true)}
    >
      สแกนไม่ติด? <span class="underline underline-offset-2"
        >กรอกโค้ดด้วยตนเอง</span
      >
    </button>
  </div>
</section>

<Drawer bind:open={isBoothSelectorOpen}>
  {#snippet header()}
    <h2 class="text-3xl">เปลี่ยนบูธ</h2>
  {/snippet}
  <section class="mx-6 flex flex-col gap-3">
    <label class="flex flex-col gap-1">
      <span>บูธ</span>
      <select class="select" bind:value={dialogWorkshopId}>
        {#each boothCheckpoints as checkpoint}
          <option value={String(checkpoint.id)}>{checkpoint.name}</option>
        {/each}
      </select>
    </label>
    {#if !isDepartmentStaffSelectable(dialogWorkshopId)}
      <div class="alert alert-warning">
        <WarningAltFilled />
        <div>
          <strong> ตัวเลือกนี้เฉพาะสตาฟส่วนกลาง </strong>
          <span>
            ขอความร่วมมือสตาฟภาควิชาเลือกเฉพาะที่เกี่ยวข้องตามที่ระบุในคู่มือเท่านั้น
            ระบบสามารถสอบทานย้อนหลังเพื่อตรวจสอบการทุจริตได้
            การไม่ปฏิบัติตามเงื่อนไขการใช้งานจะถูกบันทึกไว้ในระบบ
          </span>
        </div>
      </div>
    {/if}
  </section>
  {#snippet buttons()}
    <DrawerButton onclick={updateSelectedBooth}>ตกลง</DrawerButton>
  {/snippet}
</Drawer>

<Drawer bind:open={isConfirmDialogOpen}>
  {#snippet header()}
    <h2 class="text-3xl">ยืนยันการเช็คอิน</h2>
  {/snippet}
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
    <table class="table mx-6 mt-3 text-md">
      <tbody>
        <tr>
          <th> ชื่อ </th>
          <td class="text-xl">
            {user.current?.participant?.givenName}
            {user.current?.participant?.familyName}
          </td>
        </tr>
        <tr>
          <th> ความคืบหน้าปัจจุบัน </th>
          <td>
            WIP
            <!-- TODO(ptsgrn): participant progress -->
          </td>
        </tr>
      </tbody>
    </table>
  {/if}
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
  headerText="กรอกโค้ดเช็คอิน"
  subText="ผู้เข้าร่วมสามารถดูได้ใต้ Qr Code ในหน้า MyID"
  bind:open={isIdInputtingDialogOpen}
  onDone={onSelfIdInputtingDialogDone}
/>
