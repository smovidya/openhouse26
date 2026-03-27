<script lang="ts">
  import { cn } from "@src/components/utils";
  import { checkpoints, type CheckpointType } from "@src/data/checkpoints";
  import { Rewards, type MinimumConditionsForTiers } from "@src/data/rewards";
  import { type ResourceReturn } from "runed";

  interface Props {
    progressData: ResourceReturn<
      | {
          checkins: {
            id: string;
            data: unknown;
            createdAt: Date | null;
            updatedAt: Date | null;
            participantTicketId: string | null;
            checkedByStaffId: string | null;
            checkpointId: string | null;
            deletedAt: Date | null;
            staff: {
              id: string;
              name: string;
              createdAt: Date | null;
              updatedAt: Date | null;
              studentId: string | null;
              emails: string;
              boothName: string | null;
              phone: string;
              requestedRole: string;
            } | null;
          }[];
        }
      | undefined,
      unknown,
      false
    >;
  }

  function getCheckpoint(checkpointId: string | null) {
    return checkpoints.find((it) => it.id === checkpointId);
  }

  const { progressData }: Props = $props();

  let rewards = $derived(new Rewards(progressData.current?.checkins || []));
</script>

{#snippet conditionInfo(
  conditionKey: CheckpointType,
  count: number,
  tier: keyof MinimumConditionsForTiers,
)}
  <details class="collapse collapse-arrow px-0">
    <summary
      class="py-2 px-0 flex flex-row gap-2 items-center collapse-title font-semibold w-full"
    >
      {#if rewards.isCheckinConditionPass(conditionKey, count)}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-5 mr-1 shrink-0"
          ><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path
            d="m9 11 3 3L22 4"
          /></svg
        >
      {/if}
      <span>
        {#if conditionKey === "booth"}
          เข้าบูธภาควิชาอย่างน้อย {count} บูธ
        {:else if conditionKey === "workshop"}
          เข้าร่วมเวิร์กช็อปอย่างน้อย {count} เวิร์กช็อป
        {:else if conditionKey === "tcas"}
          เข้าชมบูธ TCAS
        {:else if conditionKey === "challenge"}
          ถ่ายรูปกับบรรยากาศงาน ลง IG Story ติด #sciencechulaopenhouse2026
        {/if}
      </span>
    </summary>
    <div class="collapse-content px-0 text-sm">
      {#if conditionKey === "booth"}
        <p>
          เข้าร่วมกิจกรรมที่บูธของภาควิชาแล้วให้สตาฟภาควิชาแสกนเพื่อรับเช็คอิน
          ตอนนี้ได้รับเช็คอินจากบูธภาควิชาแล้ว {rewards.countCheckinByType(
            "booth",
          )} บูธ จาก {count} บูธที่ต้องการ
        </p>
        <ul class="flex flex-wrap gap-1 mt-1">
          {#each rewards.departmentBoothCheckpointsSortedCheckinFirst() as chpt}
            <li
              class={cn(
                "border border-token-6 rounded-sm px-2 py-1",
                chpt.checkin && "bg-token-6 text-white",
              )}
            >
              {chpt.name}
              {chpt.checkin ? "(✓)" : ""}
            </li>
          {/each}
        </ul>
      {:else if conditionKey === "workshop"}
        <p>
          ติดตามตารางกิจกรรมเวิร์กช็อปได้ที่ <a
            class="underline link"
            href="/workshops">หน้าร่วมตารางเวิร์กช็อป</a
          > ลงทะเบียนที่บริเวณใต้ตึกแถบ นีลนิธี เมื่อเสร็จกิจกรรมแล้ว ให้สตาฟสแกนเพื่อรับเช็คอิน
        </p>
        <ul class="flex flex-wrap gap-1 mt-1">
          {#each rewards.listWorkshopCheckin() as chpt}
            <li
              class={cn(
                "border border-token-6 rounded-sm px-2 py-1",
                chpt.checkin && "bg-token-6 text-white",
              )}
            >
              {chpt.name}
              {chpt.checkin ? "(✓)" : ""}
            </li>
          {/each}
        </ul>
      {:else if conditionKey === "tcas"}
        เดินชมบูธ TCAS แล้วให้สตาฟ TCAS แสกนเพื่อรับเช็คอิน
      {:else if conditionKey === "challenge"}
        ทำเสร็จแล้วเอามาให้พี่ ๆ ดูที่บูธแลกของรางวัลได้เลย!
      {/if}
    </div>
  </details>
{/snippet}

{#snippet stepBox({
  isStepPass = false,
  title = "Tier #",
  index = 0,
  tier = "tier1",
}: {
  isStepPass: boolean;
  title: string;
  index: number;
  tier: keyof MinimumConditionsForTiers;
})}
  <li>
    {#if index !== 0}
      <hr />
    {/if}
    <div class="timeline-middle">
      {#if isStepPass}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="size-6 m-1"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clip-rule="evenodd"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-6 m-1"
          ><circle cx="12" cy="16" r="1" /><rect
            x="3"
            y="10"
            width="18"
            height="12"
            rx="2"
          /><path d="M7 10V7a5 5 0 0 1 10 0v3" /></svg
        >
      {/if}
    </div>
    <div class="timeline-start mb-10 text-start w-full">
      <h3 class="italic text-lg font-bold">{title}</h3>
      <div class="w-full">
        {#each rewards.getConditionForTier(tier) as [tierCondKey, count]}
          {@render conditionInfo(tierCondKey as CheckpointType, count, tier)}
        {/each}
      </div>
    </div>
    {#if index !== 2}
      <hr />
    {/if}
  </li>
{/snippet}

<div id="progress" class="p-2">
  <h3 class="font-bold text-lg">สิทธิรับของที่ระลึก</h3>
  {#if rewards.isAlreadyRedeemedReward()}
    ยังไม่แลกของที่ระลึก
  {:else}
    แลกของที่ระลึกไปแล้ว
  {/if}
  <ul class="timeline timeline-snap-icon timeline-compact timeline-vertical">
    {@render stepBox({
      isStepPass: rewards.isPassConditionForTier("tier3"),
      title: "Tier 3",
      index: 0,
      tier: "tier3",
    })}
    {@render stepBox({
      isStepPass: rewards.isPassConditionForTier("tier2"),
      title: "Tier 2",
      index: 1,
      tier: "tier2",
    })}
    {@render stepBox({
      isStepPass: rewards.isPassConditionForTier("tier1"),
      title: "Tier 1",
      index: 2,
      tier: "tier1",
    })}
  </ul>
</div>

<h2>บูธที่เข้าร่วมแล้ว เรียงตามเวลา</h2>

<ul class="timeline timeline-compact timeline-snap-icon timeline-vertical">
  {#each progressData.current?.checkins || [] as checkin}
    <li class="my-0! p-0">
      <hr />
      <div class="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-5 w-5"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="timeline-end text-start">
        <time class="font-mono italic">
          {checkin.createdAt
            ? new Date(checkin.createdAt).toLocaleString("th-TH", {
                dateStyle: "medium",
                timeStyle: "medium",
              })
            : "N/A"}
        </time>
        <div class="text-lg font-black">
          <span class="uppercase">
            {getCheckpoint(checkin.checkpointId)?.type || "???"}:{" "}
          </span>
          {getCheckpoint(checkin.checkpointId)?.name || "ไม่ทราบบูธ"}
        </div>
        <div class="text-sm">
          เช็คอินโดย:{" "}
          {checkin.staff
            ? `${checkin.staff.name} (${checkin.staff.studentId})`
            : "ไม่ทราบเจ้าหน้าที่"}
        </div>
      </div>
      <hr />
    </li>
  {/each}
</ul>
