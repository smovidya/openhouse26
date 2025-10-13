<script lang="ts">
  import Drawer from "@src/components/common/drawer.svelte";
  import Navbar from "@src/components/staff/navbar.svelte";
  import ChangeRoundButton from "@src/components/staff/change-round-button.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import NavigationRails from "@src/components/staff/navigation-rails.svelte";
  import { resource } from "runed";

  let isWorkshopSelectorOpen = $state(false);
  let isConfirmDialogOpen = $state(false);
  const scanning = $derived(!(isWorkshopSelectorOpen || isConfirmDialogOpen));

  // TODO: save this to localstorage
  let selectedWorkshop = $state({
    workshopId: "foodtech-playground",
    roundNumber: 1,
  });

  // svelte-ignore state_referenced_locally : I know
  let dialogWorkshop = $state($state.snapshot(selectedWorkshop));

  function launchWorkshopSelector() {
    dialogWorkshop = $state.snapshot(selectedWorkshop);
    isWorkshopSelectorOpen = true;
  }

  function updateSelectedWorkshop() {
    isWorkshopSelectorOpen = false;
    selectedWorkshop = $state.snapshot(dialogWorkshop);
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
    <h2 class="text-4xl mt-9 px-9">คุณกำลังหกแวสาหก่ืรีอ่าหกอาืาส</h2>
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
      title="ทำกือ่่ผแส"
      subtitle="รอบ 12.00 น."
    />
  {/snippet}
</QrcodeScannerBase>

<Drawer bind:open={isWorkshopSelectorOpen}>
  {#snippet header()}
    <h2 class="text-3xl">เปลี่ยนเวิร์กช็อปและรอบ</h2>
  {/snippet}
  <section>
    <select class="select select-ghost">
      <option disabled selected>Pick a color</option>
      <option>Crimson</option>
      <option>Amber</option>
      <option>Velvet</option>
    </select>
  </section>
  {#snippet buttons()}
    <button
      class="p-3 bg-yellow-500 active:bg-yellow-600 rounded-full"
      onclick={() => (isWorkshopSelectorOpen = false)}
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
      onclick={updateSelectedWorkshop}
    >
      ตกลง
    </button>
  {/snippet}
</Drawer>
