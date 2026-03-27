<script lang="ts">
  import {
    alert,
    confirm,
    isDialogOpen,
  } from "@src/components/common/drawer-alert-dialog.svelte";
  import ManualIdDialog from "@src/components/staff/manual-id-dialog.svelte";
  import QrcodeScannerBase from "@src/components/staff/qrcode-scanner-base.svelte";
  import { cn } from "@src/components/utils";
  import { type CheckpointType } from "@src/data/checkpoints";
  import { Rewards, type MinimumConditionsForTiers } from "@src/data/rewards";
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
      const { data, error } = await actions.checkin.listAttendancesProgress({
        ticketId: currentQrId,
      });
      if (error) {
        throw new Error(error.message);
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
        const r = new Rewards(data?.checkins);

        return !r.isRewardRedeemable();
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

    const { error } = await actions.checkin.checkinCheckpoint({
      checkpointId: "redeem-reward",
      ticketId: currentQrId,
    });
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

  const currentReward = $derived(new Rewards(user.current?.checkins));
  const currentTier = $derived(currentReward.currentRewardTier());
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

{#snippet conditionRow(
  tier: keyof MinimumConditionsForTiers,
  conditionKey: CheckpointType,
)}
  <td
    class={cn(
      "text-lg",
      currentReward.countCheckinByType(conditionKey) >=
        currentReward.getCondition(tier, conditionKey)
        ? "bg-green-300"
        : "bg-red-300",
    )}
  >
    {currentReward.getCondition(tier, conditionKey)}
  </td>
{/snippet}

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
    {#if currentReward.isAlreadyRedeemedReward()}
      <div class="alert alert-error text-4xl">รับของที่ระลึกไปแล้ว</div>
    {/if}
    {#if !currentTier}
      <div class="alert alert-error text-4xl">ยังแลกของที่ระลึกไม่ได้</div>
    {/if}
    <table class="table mt-3 text-md">
      <tbody>
        <tr>
          <th> CU Ticket ID </th>
          <td class="text-xl font-bold">
            {currentQrId}
          </td>
        </tr>
        <tr>
          <th> ความคืบหน้าปัจจุบัน </th>
          <td class="text-2xl font-bold">
            {currentTier || "-ยังแลกไม่ได้-"}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="w-full overflow-auto">
      <table class="table mt-3 text-md">
        <tbody>
          <tr>
            <th rowspan="2">เงื่อนไข</th>
            <th rowspan="2">ตอนนี้มี</th>
            <th colspan="3" class="text-center">ที่ต้องมี</th>
          </tr>
          <tr>
            <th
              >Tier 3 {currentReward.isPassConditionForTier("tier3")
                ? "✓"
                : ""}</th
            >
            <th
              >Tier 2 {currentReward.isPassConditionForTier("tier2")
                ? "✓"
                : ""}</th
            >
            <th
              >Tier 1 {currentReward.isPassConditionForTier("tier1")
                ? "✓"
                : ""}</th
            >
          </tr>
          <tr>
            <th> เข้าร่วมบูธภาควิชา </th>
            <td class="text-xl font-bold">
              {currentReward.countCheckinByType("booth")} บูธ
            </td>

            {@render conditionRow("tier3", "booth")}
            {@render conditionRow("tier2", "booth")}
            {@render conditionRow("tier1", "booth")}
          </tr>
          <tr>
            <th> เข้าร่วมเวิร์กช็อป </th>
            <td class="text-xl font-bold">
              {currentReward.countCheckinByType("workshop")} ครั้ง
            </td>

            {@render conditionRow("tier3", "workshop")}
            {@render conditionRow("tier2", "workshop")}
            {@render conditionRow("tier1", "workshop")}
          </tr>
          <tr>
            <th> เข้าร่วมบูธ TCAS </th>
            <td
              class={cn(
                "text-xl font-bold",
                currentReward.countCheckinByType("tcas") > 0
                  ? "text-green-600"
                  : "text-red-600",
              )}
            >
              {currentReward.countCheckinByType("tcas") > 0
                ? "ทำแล้ว (✓)"
                : "ยังไม่ทำ"}
            </td>
            {@render conditionRow("tier3", "tcas")}
            {@render conditionRow("tier2", "tcas")}
            {@render conditionRow("tier1", "tcas")}
          </tr>
          <tr>
            <th> IG Story </th>
            <td
              class={cn(
                "text-xl font-bold",
                currentReward.countCheckinByType("challenge") > 0
                  ? "text-green-600"
                  : "text-red-600",
              )}
            >
              {currentReward.countCheckinByType("challenge") > 0
                ? "ทำแล้ว (✓)"
                : "ยังไม่ทำ"}
            </td>
            {@render conditionRow("tier3", "challenge")}
            {@render conditionRow("tier2", "challenge")}
            {@render conditionRow("tier1", "challenge")}
          </tr>
        </tbody>
      </table>
    </div>
  {/if}
{/snippet}

<ManualIdDialog
  headerText="กรอกโค้ดผู้เข้าร่วม"
  subText="ผู้เข้าร่วมสามารถดูได้ใต้ Qr Code ในหน้า CU Ticket ของผู้เข้าร่วม"
  bind:open={isIdInputtingDialogOpen}
  onDone={onSelfIdInputtingDialogDone}
/>
