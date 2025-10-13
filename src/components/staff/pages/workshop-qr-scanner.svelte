<script lang="ts">
  import Drawer from "@src/components/common/drawer.svelte";
  import Navbar from "@src/components/staff/navbar.svelte";
  import ChangeRoundButton from "@src/components/staff/change-round-button.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import NavigationRails from "@src/components/staff/navigation-rails.svelte";
  import { resource } from "runed";
  import { workshops } from "@src/data/workshops";

  let isWorkshopSelectorOpen = $state(false);
  let isConfirmDialogOpen = $state(false);
  const scanning = $derived(!(isWorkshopSelectorOpen || isConfirmDialogOpen));

  // TODO: save this to localstorage
  let selectedWorkshopId = $state.raw({
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
</script>

<Navbar />
<QrcodeScannerBase enable={scanning} {onResult}>
  {#snippet header()}
    <h2 class="text-3xl mt-9 px-9">กำลังเช็คอิน {selectedWorkshop.title} รอบ {selectedTimeSlot.start}</h2>
  {/snippet}
  {#snippet notSoBottomUi()}
    <NavigationRails
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
      title={selectedWorkshop.title}
      subtitle="รอบ {selectedTimeSlot.start} - {selectedTimeSlot.end}"
    />
  {/snippet}
</QrcodeScannerBase>

<Drawer bind:open={isWorkshopSelectorOpen}>
  {#snippet header()}
    <h2 class="text-3xl">เปลี่ยนเวิร์กช็อปและรอบ</h2>
  {/snippet}
  <section class="mx-6 flex flex-col gap-3">
    <label class="flex flex-col gap-1">
      <span>เวิร์กช็อป</span>
      <select class="select" bind:value={dialogWorkshop.workshopId}>
        {#each workshops as workshop}
          <option value={workshop.id}>{workshop.title}</option>
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
    <button
      class="p-3 bg-yellow-500 active:bg-yellow-600 rounded-full"
      onclick={updateSelectedWorkshop}
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
      onclick={() => (isConfirmDialogOpen = false)}
    >
      ตกลง
    </button>
  {/snippet}
</Drawer>
