<script lang="ts">
  import {
    alert,
    confirm,
    isDialogOpen,
  } from "@src/components/common/drawer-alert-dialog.svelte";
  import ManualIdDialog from "@src/components/staff/manual-id-dialog.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import { actions } from "astro:actions";
  import { resource } from "runed";

  let isConfirmDialogOpen = $state(false);
  let isIdInputtingDialogOpen = $state(false);

  const scanning = $derived(
    !(isConfirmDialogOpen || isIdInputtingDialogOpen || isDialogOpen.current),
  );

  // Scanning ------------------------------------------------------------

  // we should actually cache these data in case of workshop
  let currentQrId: string | null = $state(null);
  const user = resource(
    () => currentQrId,
    async () => {
      if (!currentQrId) {
        alert({
          title: "ข้อผิดพลาด",
          description: "ไม่ได้สแกน QR code",
        });
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

  async function onResult(value: string) {
    currentQrId = value;
    isConfirmDialogOpen = true;

    const p = user.refetch();
    const ok = await confirm({
      title: "รับของรางวัล",
      description: confirmDialogBody,
      blockConfirmUntil: p,
    });

    isConfirmDialogOpen = false;

    if (!ok || user.error) {
      return;
    }

    if (!currentQrId) {
      alert({
        title: "ข้อผิดพลาด",
        description: "กรุณาสแกน QR Code หรือป้อน ID",
      });
      return;
    }

    // TODO: actually submitting it
  }

  function onSelfIdInputtingDialogDone(value: string) {
    isIdInputtingDialogOpen = false;
    onResult(value);
  }
</script>

<QrcodeScannerBase enable={scanning} {onResult}>
  {#snippet header()}
    <h2 class="text-3xl mt-9 py-3 bg-base-200/80 text-base-content px-9">
      สแกนรับของที่ระลึก
    </h2>
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
{/snippet}

<ManualIdDialog
  headerText="กรอกโค้ดเช็คอิน"
  subText="ผู้เข้าร่วมสามารถดูได้ใต้ Qr Code ในหน้า MyID"
  bind:open={isIdInputtingDialogOpen}
  onDone={onSelfIdInputtingDialogDone}
/>
