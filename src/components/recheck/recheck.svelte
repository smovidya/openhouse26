<script lang="ts">
  import Card from "@src/components/card.svelte";
  import Button from "@src/components/common/button.svelte";
  import { cn } from "../utils";
  import { resource } from "runed";

  import { Rewards, type MinimumConditionsForTiers } from "@src/data/rewards";
  import { actions } from "astro:actions";
  import { type CheckpointType } from "@src/data/checkpoints";

  let currentTicketId: string | null = $state(null);
  let recheckInput = $state("");
  const rewardsResource = resource(
    () => currentTicketId,
    async (ticketId, prevTicketId) => {
      if (!ticketId) {
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate loading delay
      // const { data, error } = await actions.checkin.listAttendancesProgress({
      //   ticketId,
      // });

      // if (error) {
      //   console.error("Failed to fetch rewards data:", error);
      // }

      // return data;

      return {
        checkins: [
          {
            checkedByStaffId: "staff123",
            checkpointId: "checkpoint-mathcom",
            createdAt: new Date("2023-01-01T00:00:00Z"),
            data: {},
            id: "checkin123",
            deletedAt: null,
            participantTicketId: ticketId,
            updatedAt: new Date("2023-01-01T00:00:00Z"),
          },
          {
            checkedByStaffId: "staff456",
            checkpointId: "checkpoint-physics",
            createdAt: new Date("2023-01-02T00:00:00Z"),
            data: {},
            id: "checkin456",
            deletedAt: null,
            participantTicketId: ticketId,
            updatedAt: new Date("2023-01-02T00:00:00Z"),
          },
          {
            checkedByStaffId: "staff789",
            checkpointId: "checkpoint-chemistry",
            createdAt: new Date("2023-01-03T00:00:00Z"),
            data: {},
            id: "checkin789",
            deletedAt: null,
            participantTicketId: ticketId,
            updatedAt: new Date("2023-01-03T00:00:00Z"),
          },
          {
            checkedByStaffId: "staff101",
            checkpointId: "checkpoint-bbtech",
            createdAt: new Date("2023-01-04T00:00:00Z"),
            data: {},
            id: "checkin101",
            deletedAt: null,
            participantTicketId: ticketId,
            updatedAt: new Date("2023-01-04T00:00:00Z"),
          },
          {
            checkedByStaffId: "staff102",
            checkpointId: "checkpoint-bistech",
            createdAt: new Date("2023-01-05T00:00:00Z"),
            data: {},
            id: "checkin102",
            deletedAt: null,
            participantTicketId: ticketId,
            updatedAt: new Date("2023-01-05T00:00:00Z"),
          },
          {
            checkedByStaffId: "staff103",
            checkpointId: "tcas",
            createdAt: new Date("2023-01-06T00:00:00Z"),
            data: {},
            id: "checkin103",
            deletedAt: null,
            participantTicketId: ticketId,
            updatedAt: new Date("2023-01-06T00:00:00Z"),
          },
          {
            checkedByStaffId: "staff103",
            checkpointId: "central-exhibitions",
            createdAt: new Date("2023-01-06T00:00:00Z"),
            data: {},
            id: "checkin104",
            deletedAt: null,
            participantTicketId: ticketId,
            updatedAt: new Date("2023-01-06T00:00:00Z"),
          },
        ],
      } as Awaited<
        ReturnType<typeof actions.checkin.listAttendancesProgress>
      >["data"];
    },
    {
      debounce: 500,
      lazy: true,
    },
  );

  let rewards = $derived(new Rewards(rewardsResource.current?.checkins || []));
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
      {#if rewards.isCheckinConditionPass(conditionKey, count, tier)}
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
        {:else if conditionKey === "central-exhibition"}
          เข้าชมงานนิทรรศการกลาง
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
        ติดตามตารางกิจกรรมเวิร์กช็อปได้ที่ <a href="/workshops"
          >หน้าร่วมตารางเวิร์กช็อป</a
        > ลงทะเบียนที่บริเวณใต้ตึกแถบ นีลนิธี เมื่อเสร็จกิจกรรมแล้ว ให้สตาฟสแกนเพื่อรับเช็คอิน
      {:else if conditionKey === "tcas"}
        เดินชมบูธ TCAS แล้วให้สตาฟ TCAS แสกนเพื่อรับเช็คอิน
      {:else if conditionKey === "central-exhibition"}
        เดินชมนิทรรศการกลางแล้วให้สตาฟนิทรรศการแสกนเพื่อรับเช็คอิน
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

<Card>
  <div class="flex justify-center items-center flex-col gap-3 p-4">
    <div class="flex flex-row items-center justify-center">
      <img
        alt="user search icon"
        src="/nowath/icon/user-search.svg"
        width="20"
        height="20"
        class="mr-2"
      />
      <span class="font-bold"> Enter your CU Ticket ID: </span>
    </div>
    <label class="validator">
      <input
        type="text"
        placeholder="S012300"
        bind:value={recheckInput}
        pattern="^[SPEAT]\d{'{6}'}$"
        class="border-token-6 text-lg border invalid:border-2 shadow-md shadow-black/20 text-center rounded-2xl p-2"
      />
    </label>
    <div class="validator-hint hidden">
      CU Ticker ID ต้องขึ้นต้นด้วย S, P, E หรือ A พิมพ์ใหญ่ตามด้วยตัวเลข 6 หลัก
      เช่น S012300
    </div>
    <Button
      class="w-auto"
      onclick={() => {
        currentTicketId = recheckInput;
      }}>Search</Button
    >
  </div>
</Card>

<Card>
  <div id="progress" class="p-2">
    <h2 class="font-bold text-2xl">Your Progress</h2>
    {#if currentTicketId && !rewardsResource.loading}
      <p class="italic">for {currentTicketId}</p>
    {/if}
    <div class="border-y-2 py-2 my-3 border-dashed border-token-6/50">
      <h3 class="font-bold text-lg">สิทธิในการรับเกียรติบัตร</h3>

      {#if !currentTicketId}
        <p class="text-balance">
          กรุณากรอก CU Ticket ID ของคุณแล้วกด Search
          เพื่อดูสิทธิในการรับเกียรติบัตร
        </p>
      {:else if rewardsResource.loading}
        <p class="italic">กำลังโหลดข้อมูล...</p>
      {:else if rewardsResource.error}
        <p class="text-error">
          {rewardsResource.error
            ? "เกิดข้อผิดพลาดในการโหลดข้อมูล โปรดลองใหม่อีกครั้ง"
            : "กรุณากรอก CU Ticket ID ของคุณแล้วกด Search เพื่อดูสิทธิในการรับเกียรติบัตร"}
        </p>
      {:else if rewardsResource.current === null}
        <p class="text-error">ไม่พบข้อมูลสำหรับ CU Ticket ID นี้</p>
      {:else if rewardsResource.current?.checkins.length === 0}
        <p class="text-error">ยังไม่มีข้อมูลเช็คอินสำหรับ CU Ticket ID นี้</p>
      {:else if !rewards.isEligibleForCertificate()}
        <p class="text-error">
          คุณยังไม่มีสิทธิได้รับเกียรติบัตร เนื่องจากยังไม่ผ่านเงื่อนไขขั้นต่ำ
          กรุณาตรวจสอบเงื่อนไขและพยายามเข้าร่วมกิจกรรมให้ครบถ้วนมากขึ้น
        </p>
      {:else if rewards.isEligibleForCertificate()}
        <p>คุณมีสิทธิได้รับเกียรติบัตร</p>
        <Button href="/redeem" class="mx-auto mt-2">ดาวน์โหลด</Button>
      {:else}
        <p class="text-balance">
          กรุณากรอกและค้นหา CU Ticket ID ของคุณเพื่อดูสิทธิในการรับเกียรติบัตร
        </p>
      {/if}
    </div>
    <h3 class="font-bold text-lg">สิทธิรับของที่ระลึก</h3>
    {#if rewards.isRewardRedeemable()}
      <p class="text-balance">
        คุณมีสิทธิแลกรับของรางวัล ({rewards.currentRewardTier()})
        หากคุณต้องการรับของที่ระลึกนี้ นำ QR Code CU Ticket ติดต่อพี่ ๆ
        ที่บูธแลกของรางวัลได้เลย! (แลกได้เพียงครั้งเดียวเท่านั้น)
      </p>
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
</Card>
