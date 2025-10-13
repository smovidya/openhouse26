<script>
  import Drawer from "@src/components/common/drawer.svelte";
  import ChangeRoundButton from "@src/components/staff/qrcode-scanner/change-round-button.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner/qrcode-scanner-base.svelte";

  let open = $state(true);
  let scanning = $derived(!open);
</script>

<QrcodeScannerBase enable={scanning}>
  {#snippet header()}
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <div class="size-10 rounded bg-white/30"></div>
        <p class="text-xl">Title</p>
      </div>
      <div class="size-10 rounded-full bg-red-500"></div>
    </div>
    <h2 class="text-4xl mt-4 px-9">คุณกำลังหกแวสาหก่ืรีอ่าหกอาืาส</h2>
  {/snippet}
  {#snippet bottomUi()}
    <ChangeRoundButton title="ทำกือ่่ผแส" subtitle="รอบ 12.00 น." />
  {/snippet}
</QrcodeScannerBase>

<button onclick={() => (open = !open)} class="p-3 border">open = {open}</button>

<Drawer bind:open>
  {#snippet header()}
    <h2 class="text-3xl">sjdfhuk</h2>
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
      class="p-3 bg-yellow-500 active:bg-yellow-600 text-white rounded-full"
      onclick={() => (open = false)}
    >
      Ok
    </button>
  {/snippet}
</Drawer>
