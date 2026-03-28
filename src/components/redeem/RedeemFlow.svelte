<script lang="ts">
  import { actions } from "astro:actions";
  import Card from "../card.svelte";
  import Button from "../common/button.svelte";
  import SurveyForm from "../survey/SurveyForm.svelte";

  interface Props {
    ticketId: string;
  }

  let { ticketId: preloadTicketId = $bindable() }: Props = $props();

  let ticketId = $state(preloadTicketId);
  let name = $state("");
  let step = $state<
    | "enter_ticket"
    | "survey_and_name"
    | "verify_name"
    | "not_eligible"
    | "success"
  >("enter_ticket");

  let isLoading = $state(false);
  let errorMsg = $state("");
  let certUrl = $state("");

  let isSurveyValid = $state(false);
  let showSurveyErrors = $state(false);
  let surveyResponses = $state<any>({
    purposes: [],
    interestedDepartments: [],
    recommendRank1: "",
    recommendRank2: "",
    recommendRank3: "",
    recommendReason: "",
    venueLost: "",
    venueCrowded: "",
    venueCleanliness: null,
    activityFirstImpression: "",
    activityMissedWorkshop: "",
    activityMissedDepartments: [],
    activityWorkshopRating: null,
    overviewRating: null,
    overview3Words: "",
    overviewFeeling: "",
    overviewImpression: "",
    boothStaffAnswer: "",
    boothPresentationRating: null,
    boothUnansweredQuestions: "",
    boothUnderstandingRating: null,
    feedbackMessage: "",
    feedbackImprovement: "",
    closingAcknowledge: "",
  });
  let confirmedAccuracy = $state(false);

  async function handleCheckEligibility() {
    if (!ticketId) return;
    isLoading = true;
    errorMsg = "";
    try {
      const res = await actions.redeem.checkEligibility({ ticketId });
      if (res.error) {
        errorMsg = res.error.message;
      } else {
        if (res.data.status === "not_eligible") {
          step = "not_eligible";
        } else if (res.data.status === "eligible_no_survey") {
          step = "survey_and_name";
        } else if (res.data.status === "eligible_has_survey") {
          step = "verify_name";
        }
      }
    } catch (e: any) {
      errorMsg = e.message || "An error occurred";
    } finally {
      isLoading = false;
    }
  }

  async function handleSubmitSurvey() {
    showSurveyErrors = true;
    if (!isSurveyValid) {
      errorMsg = "โปรดกรอกแบบประเมินให้ครบถ้วน";
      return;
    }
    if (!name) {
      errorMsg = "โปรดกรอกชื่อและนามสกุล";
      return;
    }
    if (!confirmedAccuracy) {
      errorMsg = "โปรดยืนยันความถูกต้องของข้อมูล (ติ๊กเครื่องหมายถูกด้านล่าง)";
      return;
    }
    isLoading = true;
    errorMsg = "";
    try {
      const res = await actions.redeem.submitSurveyAndName({
        ticketId,
        name,
        responses: surveyResponses,
      });
      if (res.error) {
        errorMsg = res.error.message;
      } else {
        const urlRes = await actions.redeem.getCertUrl({ ticketId, name });
        if (urlRes.data && urlRes.data.url) {
          certUrl = urlRes.data.url;
          step = "success";
        }
      }
    } catch (e: any) {
      errorMsg = e.message || "An error occurred";
    } finally {
      isLoading = false;
    }
  }

  async function handleVerifyName() {
    if (!name) {
      errorMsg = "โปรดกรอกชื่อและนามสกุล";
      return;
    }
    isLoading = true;
    errorMsg = "";
    try {
      const res = await actions.redeem.verifyName({ ticketId, name });
      if (res.error) {
        errorMsg = res.error.message;
      } else if (res.data?.success === false) {
        errorMsg = res.data.error || "Name does not match";
      } else {
        const urlRes = await actions.redeem.getCertUrl({ ticketId, name });
        if (urlRes.data && urlRes.data.url) {
          certUrl = urlRes.data.url;
          step = "success";
        }
      }
    } catch (e: any) {
      errorMsg = e.message || "An error occurred";
    } finally {
      isLoading = false;
    }
  }
</script>

<Card>
  <div class="card-body">
    {#if errorMsg}
      <div class="alert alert-error mb-4">
        <span>{errorMsg}</span>
      </div>
    {/if}

    {#if step === "enter_ticket"}
      <div class="w-full flex flex-col items-center gap-2">
        <div class="flex items-center">
          <img
            alt="user search icon"
            src="/nowath/icon/user-search.svg"
            width="20"
            height="20"
            class="mr-2"
          />
          <span class="font-bold text-xl"> Enter your CU Ticket ID: </span>
        </div>
        <input
          id="ticketId"
          type="text"
          bind:value={ticketId}
          placeholder="S123456"
          class="border-token-6 text-lg border invalid:border-2 shadow-md shadow-black/20 text-center rounded-2xl p-2"
          disabled={isLoading}
        />
        <Button
          onclick={handleCheckEligibility}
          disabled={isLoading}
          class="mt-2 w-auto"
        >
          {#if isLoading}<span class="loading loading-sm loading-spinner"
            ></span>{/if}
          Check
        </Button>
      </div>
    {:else if step === "not_eligible"}
      <div class="alert alert-warning mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          /></svg
        >
        <span
          >คุณยังไม่มีสิทธิ์รับเกียรติบัตรในขณะนี้ (ต้องมีการเช็คอินอย่างน้อย 1
          กิจกรรม)</span
        >
      </div>
      <div
        class="text-center justify-center flex flex-row gap-2 mt-4 items-center"
      >
        <Button href="/recheck">ดูกิจกรรม</Button>
        <button
          class="btn btn-link"
          onclick={() => {
            step = "enter_ticket";
            ticketId = "";
          }}>ลองใหม่</button
        >
      </div>
    {:else if step === "survey_and_name"}
      <h2 class="card-title text-2xl mb-4">ทำแบบประเมินและยืนยันชื่อ</h2>

      <SurveyForm
        bind:responses={surveyResponses}
        bind:isValid={isSurveyValid}
        bind:showErrors={showSurveyErrors}
      />

      <div
        class="divider before:bg-token-6 after:bg-token-6 mt-8 text-xl font-bold text-token-6 text-shadow-2xs"
      >
        กรอกข้อมูลเกียรติบัตร
      </div>

      <div class="alert mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-info shrink-0 w-6 h-6"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path></svg
        >
        <span>
          <strong>สำคัญ:</strong> เมื่อกดยืนยันแล้ว จะไม่สามารถแก้ไขชื่อได้อีก คุณจะไม่สามารถติดต่อทีมงานเพื่อแก้ไขชื่อสกุลใด
          ๆ อย่าลืมตรวจสอบสระซ้อน สระลอย และอย่าใช้สระเอสองตัว แทนการใช้สระแอ
        </span>
      </div>

      <div class="form-control w-full">
        <label class="label" for="name">
          <span class="label-text font-medium">ชื่อ-นามสกุล (ภาษาอังกฤษ)</span>
        </label>
        <input
          id="name"
          type="text"
          bind:value={name}
          placeholder="Riendee Rakdee"
          class="border-token-6 text-lg border invalid:border-2 shadow-md shadow-black/20 text-center rounded-2xl p-2"
          disabled={isLoading}
        />
      </div>

      <div class="form-control mt-4">
        <label
          class="label text-wrap text-left cursor-pointer justify-start gap-4 p-4 rounded-xl transition-colors"
        >
          <input
            type="checkbox"
            class="checkbox checkbox-primary"
            bind:checked={confirmedAccuracy}
            disabled={isLoading}
          />
          <span class="label-text text-base font-medium"
            >ข้าพเจ้ายืนยันว่าชื่อ-นามสกุลที่กรอกถูกต้อง
            (จะไม่สามารถกลับมาแก้ไขได้อีกในภายหลัง)</span
          >
        </label>
      </div>

      <div class="card-actions justify-center mt-6 flex gap-2">
        <button
          class="btn btn-ghost"
          onclick={() => (step = "enter_ticket")}
          disabled={isLoading}>ย้อนกลับ</button
        >

        <Button onclick={handleSubmitSurvey} disabled={isLoading}>
          {#if isLoading}<span class="loading loading-spinner loading-sm"
            ></span>{/if}
          ยืนยันและรับเกียรติบัตร
        </Button>
      </div>
    {:else if step === "verify_name"}
      <h2 class="card-title text-2xl mb-4">ยืนยันตัวตน</h2>
      <p class="mb-4">
        คุณได้ทำแบบประเมินไปแล้ว
        กรุณากรอกชื่อ-นามสกุลที่เคยลงทะเบียนไว้เพื่อยืนยันตัวตนและรับเกียรติบัตร
      </p>

      <div class="form-control w-full">
        <label class="label" for="verifyName">
          <span class="label-text font-medium">ชื่อ-นามสกุล</span>
        </label>
        <input
          id="verifyName"
          type="text"
          bind:value={name}
          placeholder="นายเรียนดี รักสงบ"
          class="border-token-6 text-lg border invalid:border-2 shadow-md shadow-black/20 text-center rounded-2xl p-2"
          disabled={isLoading}
        />
      </div>

      <div class="card-actions justify-end mt-6 flex gap-2">
        <button
          class="btn btn-ghost"
          onclick={() => (step = "enter_ticket")}
          disabled={isLoading}>ย้อนกลับ</button
        >
        <button
          class="btn btn-primary"
          onclick={handleVerifyName}
          disabled={isLoading}
        >
          {#if isLoading}<span class="loading loading-spinner"></span>{/if}
          ยืนยันตัวตน
        </button>
      </div>
    {:else if step === "success"}
      <div class="text-center py-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 text-success mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2">เรียบร้อย!</h2>
        <p class="text-base-content/70 mb-8">
          คุณสามารถดาวน์โหลดหรือดูเกียรติบัตรของคุณได้หลัง 12:00 น.
        </p>
        <!-- <a
          href={certUrl}
          target="_blank"
          class="btn btn-primary btn-lg w-full sm:w-auto"
        >
          ดาวน์โหลดเกียรติบัตร
        </a> -->
      </div>
    {/if}
  </div>
</Card>
