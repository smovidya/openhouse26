<script lang="ts">
  import DrawerAlertDialog, {
    confirm,
    isDialogOpen,
  } from "@src/components/common/drawer-alert-dialog.svelte";
  import ManualIdDialog from "@src/components/staff/manual-id-dialog.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import { cn } from "@src/components/utils";
  import { actions } from "astro:actions";
  import { resource } from "runed";
  import { Toaster, toast } from "svelte-sonner";
  import ErrorOutline from "carbon-icons-svelte/lib/ErrorOutline.svelte";

  let isConfirmDialogOpen = $state(false);
  let isIdInputtingDialogOpen = $state(false);

  const scanning = $derived(
    !(isConfirmDialogOpen || isIdInputtingDialogOpen || isDialogOpen.current),
  );

  let currentQrId: string | null = $state(null);
  const user = resource(
    () => [], // fuck this, we are doing manual refetching
    async () => {
      if (!currentQrId) {
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

  async function onResult(qrId: string) {
    currentQrId = qrId;

    const p = user.refetch();
    isConfirmDialogOpen = true;

    const ok = await confirm({
      title: "ยืนยันการเช็คอิน",
      description: confirmDialogBody,
      blockConfirmUntil: p,
      // Disabled the confirm button if participant has checked in
      disableConfirmChecker: (data) => {
        return (
          data?.checkinForBooth?.some((v) => v.checkpoints?.type === "entry") ??
          false
        );
      },
    });
    isConfirmDialogOpen = false;

    if (!ok || user.error) {
      return;
    }

    const { error } = await actions.checkinParticipant({
      participantOrQrCodeId: currentQrId,
    });

    if (error) {
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
      return;
    }

    toast.success("เช็คอินสำเร็จ");
  }

  function openSelfIdInputtingDialog() {
    isIdInputtingDialogOpen = true;
  }

  function onSelfIdInputtingDialogDone(qrId: string) {
    isIdInputtingDialogOpen = false;
    onResult(qrId);
  }

  const dtf = new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "narrow",
    hour: "2-digit",
    minute: "2-digit",
  }).format;
</script>

<Toaster />

<QrcodeScannerBase enable={scanning} {onResult}>
  {#snippet header()}
    <h2 class={cn("text-4xl bg-base-200/80 font-normal mt-9 p-4 px-9")}>
      <span class="font-bold">เช็คอินเข้างาน</span>
    </h2>
  {/snippet}
  {#snippet bottomUi()}{/snippet}
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
    <div class="flex flex-col p-2 font-medium">
      {#if user.current.checkinForBooth?.some((v) => v.checkpoints?.type === "entry")}
        {@const checkedInEntry = user.current.checkinForBooth.find(
          (v) => v.checkpoints?.type === "entry",
        )}
        <div class="alert alert-warning py-10">
          <ErrorOutline size={32} />
          <div class="flex flex-col ml-4">
            <span class="text-2xl"
              >ผู้เข้าร่วมนี้ได้ทำการเช็คอินเข้าเรียบร้อยแล้ว</span
            >
            <div>
              เมื่อ {checkedInEntry?.checkins.createdAt
                ? dtf(checkedInEntry?.checkins.createdAt)
                : "ไม่ทราบ"} โดย {checkedInEntry?.staffs?.name}
            </div>
          </div>
        </div>
      {:else}
        {@const participant = user.current.participant}
        <div class="flex justify-between">
          <span>ชื่อ</span>
          <span class="text-2xl">{participant.givenName} {participant.familyName}</span>
        </div>
        <div class="flex justify-between">
          <span>สถานะ</span>
          <span class="text-xl">{participant.attendeeType}</span>
        </div>
        <div class="flex justify-between">
          <span>อายุ</span>
          <span>{participant.age} ปี</span>
        </div>
        <div class="flex justify-between">
          <span>ความต้องการพิเศษ</span>
          <span>{participant.specialNeeds}</span>
        </div>
      {/if}
    </div>
  {/if}
{/snippet}

<ManualIdDialog
  headerText="กรอกโค้ดเช็คอิน"
  subText="ผู้เข้าร่วมสามารถดูได้ใต้ Qr Code ในหน้า MyID"
  bind:open={isIdInputtingDialogOpen}
  onDone={onSelfIdInputtingDialogDone}
/>

