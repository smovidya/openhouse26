<script lang="ts">
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import { resource, ScrollState } from "runed";
  import { cn } from "@src/components/utils";
  import ManualIdDialog from "@src/components/staff/manual-id-dialog.svelte";
  import { actions } from "astro:actions";
  import DebugAttendedData from "./debug-attended-data.svelte";

  const scroll = new ScrollState({
    element: () => window,
  });
  const isAtTop = $derived(scroll.progress.y <= 60);

  let isIdInputtingDialogOpen = $state(false);

  const scanning = $derived(!isIdInputtingDialogOpen && isAtTop);

  let currentQrId: string | null = $state(null);

  const participantData = resource(
    [() => currentQrId],
    async ([participantIdOrQrCodeId], _, { signal }) => {
      const { data, error } = await actions.getParticipantByIdOrQrCodeId({
        participantIdOrQrCodeId: participantIdOrQrCodeId!,
      });

      if (error) {
        alert(error.message);
      }

      return data;
    },
    {
      lazy: true,
    },
  );

  function onResult(value: string) {
    currentQrId = value;
    participantData.refetch();
  }

  function openSelfIdInputtingDialog() {
    isIdInputtingDialogOpen = true;
  }

  function onSelfIdInputtingDialogDone(value: string) {
    isIdInputtingDialogOpen = false;
    let cached = value;
    onResult(cached);
  }
</script>

<QrcodeScannerBase enable={scanning} {onResult}>
  {#snippet header()}
    <h2 class={cn("text-4xl bg-base-200/80 font-normal mt-9 p-4 px-9")}>
      <span class="font-bold"> ตรวจสอบข้อมูลผู้เข้าร่วมงาน</span>
    </h2>
  {/snippet}
  {#snippet bottomUi()}
    {#if !participantData.loading && !participantData.error && participantData.current}
      <div class="px-8 mt-3 font-serif">
        <div class="flex flex-col items-center">
          <span class="text-2xl">พบผู้เข้าร่วม: {participantData.current?.participant.givenName} {participantData.current?.participant.familyName}</span>
          <span class="text-sm">(เลื่อนลงเพื่อดูรายละเอียด)</span>
        </div>
      </div>
    {:else}
      <div class="px-8 mt-3 font-serif">
        <div class="flex flex-col items-center">
          <span class="text-2xl">กรุณาสแกน QR Code หรือกรอก ID</span>
        </div>
      </div>
    {/if}
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

<DebugAttendedData {participantData} />

<ManualIdDialog
  headerText="กรอกโค้ดผู้เข้าร่วมงาน"
  subText="ผู้เข้าร่วมสามารถดูได้ใต้ QR Code ในหน้า MyID"
  bind:open={isIdInputtingDialogOpen}
  onDone={onSelfIdInputtingDialogDone}
/>
