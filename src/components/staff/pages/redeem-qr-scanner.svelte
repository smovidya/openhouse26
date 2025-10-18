<script lang="ts">
  import {
    alert,
    confirm,
    isDialogOpen,
  } from "@src/components/common/drawer-alert-dialog.svelte";
  import ManualIdDialog from "@src/components/staff/manual-id-dialog.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import { Rewards } from "@src/data/rewards";
  import { actions } from "astro:actions";
  import { resource } from "runed";
  import { toast } from "svelte-sonner";

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
      disableConfirmChecker: (data) => {
        const r = new Rewards(currentQrId || "", data?.checkinForBooth);

        return r.isRedeemedReward() || r.getCurrentTier().level <= 0;
      },
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
    const { error } = await actions.redeem({ qrId: value });
    if (error) {
      alert({
        title: "ข้อผิดพลาด",
        description: error.message,
      });
      return;
    }

    toast.success("แลกรับของที่ระลึกสำเร็จ");
  }

  function onSelfIdInputtingDialogDone(value: string) {
    isIdInputtingDialogOpen = false;
    onResult(value);
  }

  const currentReward = $derived(
    new Rewards(currentQrId || "", user.current?.checkinForBooth),
  );
  const currentTier = $derived(currentReward.getCurrentTier());
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
    {#if currentReward.isRedeemedReward()}
      <div class="alert alert-error text-4xl">รับของที่ระลึกไปแล้ว</div>
    {/if}
    {#if currentTier.level <= 0}
      <div class="alert alert-error text-4xl">ยังแลกของที่ระลึกไม่ได้</div>
    {/if}
    <table class="table mt-3 text-md">
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
          <td> {currentTier.tier} </td>
        </tr>
        <!-- <tr>
          <th> เข้าร่วมบูธภาควิชา </th>
          <td> {currentTier.progress?.departmentBooths ?? 0}/ </td>
        </tr> -->
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
