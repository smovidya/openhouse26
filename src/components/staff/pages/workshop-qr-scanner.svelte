<script>
  import Drawer from "@src/components/common/drawer.svelte";
  import Navbar from "@src/components/staff/navbar.svelte";
  import ChangeRoundButton from "@src/components/staff/change-round-button.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import NavigationRails from "@src/components/staff/navigation-rails.svelte";

  let open = $state(false);
  let scanning = $derived(!open);
</script>

<Navbar />
<QrcodeScannerBase enable={scanning}>
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
      onclick={() => (open = true)}
      title="ทำกือ่่ผแส"
      subtitle="รอบ 12.00 น."
    />
  {/snippet}
</QrcodeScannerBase>

<Drawer bind:open>
  {#snippet header()}
    <h2 class="text-3xl">เปลี่ยนเวิร์กช็อปและรอบ</h2>
  {/snippet}
  <p class="mx-6 mt-3">
    We're no strangers to love You know the rules and so do I (do I) A full
    commitment's what I'm thinking of You wouldn't get this from any other guy I
    just wanna tell you how I'm feeling Gotta make you understand Never gonna
    give you up Never gonna let you down Never gonna run around and desert you
    Never gonna make you cry Never gonna say goodbye Never gonna tell a lie and
    hurt you
  </p>
  {#snippet buttons()}
    <button
      class="p-3 bg-yellow-500 active:bg-yellow-600 rounded-full"
      onclick={() => (open = false)}
    >
      ตกลง
    </button>
  {/snippet}
</Drawer>
