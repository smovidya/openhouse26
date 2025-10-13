<script lang="ts">
  import Drawer from "@src/components/common/drawer.svelte";
  import ChangeRoundButton from "@src/components/staff/change-round-button.svelte";
  import Navbar from "@src/components/staff/navbar.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import { departments } from "@src/data/departments";
  import { resource, ScrollState } from "runed";

  const scroll = new ScrollState({
    element: () => window,
  });
  const isAtTop = $derived(scroll.progress.y <= 400);

  let isBoothSelectorOpen = $state(false);
  let isConfirmDialogOpen = $state(false);
  let isIdInputtingDialogOpen = $state(false);
  let codeInput = $state("");
  const scanning = $derived(
    !(isBoothSelectorOpen || isConfirmDialogOpen || isIdInputtingDialogOpen) &&
      isAtTop,
  );

  // Workshop and timeslot selection ------------------------------------

  // TODO: save this to localstorage
  let selectedBoothId = $state(String(departments[0].id));
  const selectedBooth = $derived(
    departments.find((it) => String(it.id) === selectedBoothId)!,
  );

  // svelte-ignore state_referenced_locally : I know
  let dialogWorkshopId = $state($state.snapshot(selectedBoothId));
  // $inspect(dialogWorkshopId)

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
      currentQrId;
      return {
        id: currentQrId,
      };
    },
  );

  function onResult(value: string) {
    currentQrId = value;
    isConfirmDialogOpen = true;
  }

  function onScanConfirmed() {
    isConfirmDialogOpen = false;

    // TODO: actually submitting this
  }

  //

  function openSelfIdInputtingDialog() {
    codeInput = "";
    isIdInputtingDialogOpen = true;
  }

  function onSelfIdInputtingDialogDone() {
    isIdInputtingDialogOpen = false;
    let cached = codeInput;
    // setTimeout(() => {
    onResult(cached);
    // }, 200);
  }
</script>

<Navbar />
<QrcodeScannerBase enable={scanning} {onResult}>
  {#snippet header()}
    <h2 class="text-3xl mt-9 px-9">
      กำลัง<span class="font-bold">เช็คอิน</span>บูธ{selectedBooth.thName}
    </h2>
  {/snippet}
  {#snippet bottomUi()}
    <ChangeRoundButton
      onclick={launchWorkshopSelector}
      title={selectedBooth.thName}
      subtitle={selectedBooth.enShortName}
    />
  {/snippet}
</QrcodeScannerBase>

<section class="px-8 mt-4 font-serif">
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

<Drawer bind:open={isBoothSelectorOpen}>
  {#snippet header()}
    <h2 class="text-3xl">เปลี่ยนเวิร์กช็อปและรอบ</h2>
  {/snippet}
  <section class="mx-6 flex flex-col gap-3">
    <label class="flex flex-col gap-1">
      <span>บูธ</span>
      <select class="select" bind:value={dialogWorkshopId}>
        {#each departments as department}
          <option value={String(department.id)}
            >{department.thName} ({department.enShortName})</option
          >
        {/each}
      </select>
    </label>
  </section>
  {#snippet buttons()}
    <button
      class="p-3 bg-yellow-500 active:bg-yellow-600 rounded-full"
      onclick={updateSelectedBooth}
    >
      ตกลง
    </button>
  {/snippet}
</Drawer>

<Drawer bind:open={isConfirmDialogOpen}>
  {#snippet header()}
    <h2 class="text-3xl">ยืนยันการเช็คอิน</h2>
  {/snippet}
  <p class="mx-6 mt-3">
    {#if !user.loading}
      {JSON.stringify(user.current)}
      name, email, mission, workshop, รอบ
    {/if}
  </p>
  {#snippet buttons()}
    <button
      class="p-3 bg-neutral-200 active:bg-neutral-300 text-black rounded-full"
      onclick={() => (isConfirmDialogOpen = false)}
    >
      ยกเลิก
    </button>
    <button
      class="p-3 bg-yellow-500 active:bg-yellow-600 rounded-full"
      onclick={onScanConfirmed}
    >
      ตกลง
    </button>
  {/snippet}
</Drawer>

<Drawer bind:open={isIdInputtingDialogOpen}>
  {#snippet header()}
    <h2 class="text-3xl">กรอกโค้ดเช็คอิน</h2>
    <p class="text-neutral-600">สามารถดูได้ใต้ Qr Code ในหน้า MyID</p>
  {/snippet}
  <section class="px-6">
    <label class="flex flex-col gap-1">
      <span>โค้ด</span>
      <input
        type="text"
        class="input"
        placeholder="UI490"
        bind:value={codeInput}
      />
    </label>
  </section>
  {#snippet buttons()}
    <button
      class="p-3 bg-neutral-200 active:bg-neutral-300 text-black rounded-full"
      onclick={() => (isIdInputtingDialogOpen = false)}
    >
      ยกเลิก
    </button>
    <button
      class="p-3 bg-yellow-500 active:bg-yellow-600 rounded-full"
      onclick={onSelfIdInputtingDialogDone}
    >
      ตกลง
    </button>
  {/snippet}
</Drawer>
