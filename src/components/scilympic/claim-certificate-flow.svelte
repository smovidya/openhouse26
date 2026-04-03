<script lang="ts">
  import Card from "@src/components/card.svelte";
  import { ClaimState } from "./claim-state.svelte";
  import TextInput from "./text-input.svelte";
  import Button from "../common/button.svelte";

  const claimState = new ClaimState();
</script>

<Card>
  {#if claimState.currentStep === "input"}
    <h2 class="text-xl my-3 font-bold">ค้นหาและยืนยันตัวตน</h2>
    <p class="text-center text-balance">
      ระบุหมายเลขทีมและข้อมูลติดต่อ (อีเมล หรือ หมายเลขโทรศัพท์
      อย่างใดอย่างหนึ่ง) เพื่อค้นหาและดาวน์โหลดเกียรติบัตร
    </p>
    <div class="flex flex-col items-center gap-3 pt-4">
      <label class="text-xl">
        <span> T- </span>
        <TextInput
          name="teamId"
          placeholder="67"
          pattern="^\d{'{1,4}'}$"
          bind:value={claimState.formValues.teamNumberPart}
          class="w-36"
          autocomplete="off"
        />
      </label>
      <label class="flex flex-col items-center">
        <span class="text-balance text-center gap-1"
          >อีเมล หรือ หมายเลขโทรศัพท์ติดต่อที่ทีมเคยให้ไว้</span
        >
        <TextInput
          name="contactInfo"
          placeholder="อีเมล หรือ หมายเลขโทรศัพท์"
          bind:value={claimState.formValues.contactInfo}
        />
      </label>
      <label class="flex flex-col items-center gap-1">
        <span class="text-balance text-center">
          ชื่อ-นามสกุล ผู้รับเกียรติบัตร (ตรวจสอบให้ถูกต้องก่อนยืนยัน)
        </span>
        <TextInput
          name="printingName"
          placeholder="นางสาวแพนเค้ก แป้งบาง"
          bind:value={claimState.formValues.printingName}
        />
      </label>
      {#if claimState.errorMap.inputStep}
        <div class="alert alert-error text-center text-balance">
          <p>
            {claimState.errorMap.inputStep ||
              "หมายเลขทีมหรือข้อมูลติดต่อไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง"}
          </p>
        </div>
      {/if}
    </div>
    <Button class="my-3" onclick={() => claimState.verifyTeam()}>ค้นหา</Button>
  {:else if claimState.currentStep === "view-score-and-certificate"}
    <h2 class="text-xl my-3 font-bold">ข้อมูลทีมและดาวน์โหลดเกียรติบัตร</h2>
    {#if claimState.data.team?.tier === "ไม่เข้าสอบ"}
      <div class="flex flex-col items-center gap-2 text-error">
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
          class="lucide lucide-circle-slash-icon lucide-circle-slash"
          ><circle cx="12" cy="12" r="10" /><line
            x1="9"
            x2="15"
            y1="15"
            y2="9"
          /></svg
        >
        <p class="text-center text-balance">
          ทีมของคุณไม่ได้เข้าสอบ จึงไม่มีสิทธิรับเกียรติบัตร
          ขออภัยในความไม่สะดวก
        </p>
        <p>หากคิดว่ามีข้อผิดพลาด โปรดติดต่อผู้จัด</p>
      </div>
    {:else}
      <div class="flex flex-col items-center gap-3 pt-4">
        <strong class="text-xl">{claimState.data.team?.teamId}</strong>
        <ul class="flex flex-col gap-1 py-2">
          {#each claimState.data.team?.names as pp}
            <li class="text-center text-balance">
              {pp}
            </li>
          {/each}
        </ul>
        <div class="text-center text-balance flex flex-col items-center gap-1">
          <span>ทีมของคุณได้คะแนนรอบออนไลน์ </span>
          <span
            class="font-bold text-3xl bg-primary/20 px-3 py-1 rounded-md shrink-0"
            >{(claimState.data.team?.onlineRoundScore ?? 0) / 10}</span
          >
          <span class="text-sm text-balance"> คะแนน </span>
        </div>
        <div class="text-center text-balance flex flex-col items-center gap-1">
          <span>เกียรติบัตรระดับ </span>
          <span
            class="font-bold text-xl bg-primary/20 px-3 py-1 rounded-md shrink-0"
            >{claimState.data.team?.tier === "เข้าร่วมสอบ"
              ? "เข้าร่วม"
              : claimState.data.team?.tier}</span
          >
        </div>
        <a
          href={claimState.data.certUrl}
          target="_blank"
          class="btn btn-primary">ดาวน์โหลดเกียรติบัตร</a
        >
      </div>
    {/if}
    <button class="btn btn-link" onclick={() => claimState.startOver()}
      >ค้นหาเพิ่มเติม</button
    >
  {/if}
</Card>
