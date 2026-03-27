<script lang="ts">
  import CheckboxGroup from "./CheckboxGroup.svelte";
  import SelectGroup from "./SelectGroup.svelte";
  import TextInput from "./TextInput.svelte";
  import RadioGroup from "./RadioGroup.svelte";
  import RatingScale from "./RatingScale.svelte";
  import { departments } from "../../data/departments";
  import { workshops } from "@src/data/workshops";

  interface SurveyResponses {
    purposes: string[];
    interestedDepartments: string[];
    recommendRank1: string;
    recommendRank2: string;
    recommendRank3: string;
    recommendReason: string;
    venueLost: string;
    venueCrowded: string;
    venueCleanliness: number | null;
    activityFirstImpression: string;
    activityMissedWorkshop: string;
    activityMissedDepartments: string[];
    activityWorkshopRating: number | null;
    overviewRating: number | null;
    overview3Words: string;
    overviewFeeling: string;
    overviewImpression: string;
    boothStaffAnswer: string;
    boothPresentationRating: number | null;
    boothUnansweredQuestions: string;
    boothUnderstandingRating: number | null;
    feedbackMessage: string;
    feedbackImprovement: string;
    closingAcknowledge: string;
  }

  interface Props {
    responses: SurveyResponses;
    isValid: boolean;
    showErrors: boolean;
    hasWorkshopCheckin?: boolean;
  }

  let {
    responses = $bindable({
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
    }),
    isValid = $bindable(false),
    showErrors = $bindable(false),
    hasWorkshopCheckin = false,
  }: Props = $props();

  const purposeOptions = [
    { label: "สนใจศึกษาต่อ", value: "สนใจศึกษาต่อ" },
    { label: "ดูสถานที่และบรรยากาศ", value: "ดูสถานที่และบรรยากาศ" },
    { label: "มาเป็นเพื่อนกับเพื่อน", value: "มาเป็นเพื่อนกับเพื่อน" },
    { label: "รับเกียรติบัตร", value: "รับเกียรติบัตร" },
    { label: "เข้าร่วมเวิร์กช็อป", value: "เข้าร่วมเวิร์กช็อป" },
    { label: "ศึกษาข้อมูลหลักสูตร", value: "ศึกษาข้อมูลหลักสูตร" },
    {
      label: "พบกับนิสิตที่กำลังศึกษาในภาควิชาที่สนใจ",
      value: "พบกับนิสิตที่กำลังศึกษาในภาควิชาที่สนใจ",
    },
  ];

  const departmentOptions = [
    ...departments.map((d) => ({ label: d.thName, value: d.enShortName })),
  ];
  const workshopOptions = [
    ...workshops.map((w) => ({ label: w.title, value: w.title })),
  ];

  const interestedDepartmentOptions = [
    ...departmentOptions,
    { label: "ยังไม่มี / ลังเล", value: "ยังไม่มี / ลังเล" },
  ];

  const lostOptions = [
    { label: "หลง", value: "หลง" },
    { label: "ไม่หลง", value: "ไม่หลง" },
  ];

  const firstImpressionOptions = [
    { label: "บูธน่าสนใจมาก", value: "บูธน่าสนใจมาก" },
    { label: "Workshop ปังเว่อร์", value: "Workshop ปังเว่อร์" },
    { label: "อาหารกินแซ่บ", value: "อาหารกินแซ่บ" },
    { label: "พี่ๆหล่อๆสวยๆจึ้ง", value: "พี่ๆหล่อๆสวยๆจึ้ง" },
    { label: "สถานที่เดินสะดวก", value: "สถานที่เดินสะดวก" },
  ];

  const yesNoOptions = [
    { label: "มี", value: "มี" },
    { label: "ไม่มี", value: "ไม่มี" },
  ];

  const feelingOptions = [
    { label: "สนใจศึกษาต่อมากขึ้น", value: "สนใจศึกษาต่อมากขึ้น" },
    { label: "ขอพิจารณาก่อน", value: "ขอพิจารณาก่อน" },
    { label: "ไม่สนใจมีในใจอยู่แล้ว", value: "ไม่สนใจมีในใจอยู่แล้ว" },
  ];

  const impressionOptions = [
    { label: "คน (พี่/อาจารย์)", value: "คน (พี่/อาจารย์)" },
    { label: "กิจกรรมวันนี้", value: "กิจกรรมวันนี้" },
    { label: "บรรยากาศในงาน", value: "บรรยากาศในงาน" },
    { label: "บรรยากาศใน ม.", value: "บรรยากาศใน ม." },
    { label: "อาหาร", value: "อาหาร" },
    { label: "สถานที่", value: "สถานที่" },
  ];

  const staffAnswerOptions = [
    { label: "ตอบเคลียร์มาก", value: "ตอบเคลียร์มาก" },
    { label: "พอเข้าใจ", value: "พอเข้าใจ" },
    { label: "ยังงงนิดหน่อย", value: "ยังงงนิดหน่อย" },
    { label: "งงเหมือนเดิม", value: "งงเหมือนเดิม" },
    { label: "แทบไม่ได้คุยกับพี่ๆเลย", value: "แทบไม่ได้คุยกับพี่ๆเลย" },
  ];

  let errors = $derived.by(() => {
    let e: Record<string, string> = {};
    if (responses.purposes.length === 0)
      e.purposes = "โปรดเลือกอย่างน้อย 1 ข้อ";
    if (responses.interestedDepartments.length === 0)
      e.interestedDepartments = "โปรดเลือกอย่างน้อย 1 ข้อ";
    if (!responses.recommendRank1)
      e.recommendRank1 = "โปรดเลือกภาควิชาที่แนะนำอันดับ 1";
    if (!responses.recommendRank2)
      e.recommendRank2 = "โปรดเลือกภาควิชาที่แนะนำอันดับ 2";
    if (!responses.recommendRank3)
      e.recommendRank3 = "โปรดเลือกภาควิชาที่แนะนำอันดับ 3";

    if (!responses.venueLost) e.venueLost = "โปรดระบุ";
    if (!responses.venueCleanliness) e.venueCleanliness = "โปรดให้คะแนน";

    if (!responses.activityFirstImpression)
      e.activityFirstImpression = "โปรดระบุ";
    if (!responses.activityMissedWorkshop)
      e.activityMissedWorkshop = "โปรดระบุ";
    if (
      responses.activityMissedWorkshop === "มี" &&
      responses.activityMissedDepartments.length === 0
    ) {
      e.activityMissedDepartments = "โปรดเลือกอย่างน้อย 1 ภาควิชา";
    }
    if (hasWorkshopCheckin && !responses.activityWorkshopRating) {
      e.activityWorkshopRating = "โปรดให้คะแนน";
    }

    if (!responses.overviewRating) e.overviewRating = "โปรดให้คะแนน";
    if (!responses.overviewFeeling) e.overviewFeeling = "โปรดระบุ";
    if (!responses.overviewImpression) e.overviewImpression = "โปรดระบุ";

    if (!responses.boothStaffAnswer) e.boothStaffAnswer = "โปรดระบุ";
    if (!responses.boothPresentationRating) e.boothPresentationRating = "โปรดให้คะแนน";
    if (!responses.boothUnansweredQuestions) e.boothUnansweredQuestions = "โปรดระบุ";
    if (!responses.boothUnderstandingRating) e.boothUnderstandingRating = "โปรดให้คะแนน";

    if (!responses.closingAcknowledge) e.closingAcknowledge = "โปรดยืนยันการรับทราบ";

    // Optional: check uniqueness of ranked recommendations
    let ranks = [
      responses.recommendRank1,
      responses.recommendRank2,
      responses.recommendRank3,
    ].filter(Boolean);
    if (new Set(ranks).size !== ranks.length) {
      if (
        responses.recommendRank2 &&
        responses.recommendRank2 === responses.recommendRank1
      )
        e.recommendRank2 = "ห้ามเลือกภาควิชาซ้ำกัน";
      if (
        responses.recommendRank3 &&
        (responses.recommendRank3 === responses.recommendRank1 ||
          responses.recommendRank3 === responses.recommendRank2)
      )
        e.recommendRank3 = "ห้ามเลือกภาควิชาซ้ำกัน";
    }

    return e;
  });

  $effect(() => {
    isValid = Object.keys(errors).length === 0;
  });
</script>

<div class="text-left w-full">
  <div class="divider text-xl font-bold text-token-6 text-shadow-2xs mt-8">
    ตอนที่ 1: จุดประสงค์การเข้าร่วม
  </div>
  <CheckboxGroup
    label="จุดประสงค์ในการเข้าร่วมงาน (เลือกได้มากกว่า 1 ข้อ)"
    options={purposeOptions}
    bind:value={responses.purposes}
    required
    error={showErrors ? errors.purposes : ""}
  />
  <CheckboxGroup
    label="ตอนนี้มีภาคในใจหรือยัง (เลือกได้มากกว่า 1 ข้อ)"
    options={interestedDepartmentOptions}
    bind:value={responses.interestedDepartments}
    required
    error={showErrors ? errors.interestedDepartments : ""}
  />

  <div class="divider text-xl font-bold text-token-6 text-shadow-2xs mt-8">
    ตอนที่ 2: ภาควิชา
  </div>
  <div class="mb-2 text-base md:text-lg font-bold">
    ถ้าต้องแนะนำเพื่อนมา 3 บูธ จะเลือกบูธของภาควิชาไหนบ้าง? <span
      class="text-error">*</span
    >
  </div>
  <div class="p-4 rounded-xl border border-base-200 space-y-2">
    <SelectGroup
      label="อันดับที่ 1"
      options={departmentOptions}
      bind:value={responses.recommendRank1}
      error={showErrors ? errors.recommendRank1 : ""}
      placeholder="เลือกภาควิชาอันดับที่ 1"
    />
    <SelectGroup
      label="อันดับที่ 2"
      options={departmentOptions}
      bind:value={responses.recommendRank2}
      error={showErrors ? errors.recommendRank2 : ""}
      placeholder="เลือกภาควิชาอันดับที่ 2"
    />
    <SelectGroup
      label="อันดับที่ 3"
      options={departmentOptions}
      bind:value={responses.recommendRank3}
      error={showErrors ? errors.recommendRank3 : ""}
      placeholder="เลือกภาควิชาอันดับที่ 3"
    />
  </div>

  <div class="mt-4">
    <TextInput
      label="เพราะอะไรถึงแนะนำบูธเหล่านี้? (ไม่บังคับ)"
      bind:value={responses.recommendReason}
      placeholder="พิมพ์เหตุผลของคุณที่นี่..."
    />
  </div>

  <div class="divider text-xl font-bold text-token-6 text-shadow-2xs mt-8">
    ตอนที่ 3: สถานที่จัดงาน
  </div>
  <RadioGroup
    label="เดินในงาน 'หลงมั้ย' 😅"
    options={lostOptions}
    bind:value={responses.venueLost}
    required
    error={showErrors ? errors.venueLost : ""}
  />
  <TextInput
    label="น้องๆคิดว่าบริเวณไหนของงานที่รู้สึกว่าค่อนข้างแออัด เช่น เวิร์คชอป บูธ อื่นๆ (ไม่บังคับ)"
    bind:value={responses.venueCrowded}
    placeholder="พิมพ์บริเวณที่แออัดที่นี่..."
  />
  <RatingScale
    label="ความสะอาดภายในงานและจุดทิ้งขยะ"
    bind:value={responses.venueCleanliness}
    required
    error={showErrors ? errors.venueCleanliness : ""}
  />

  <div class="divider text-xl font-bold text-token-6 text-shadow-2xs mt-8">
    ตอนที่ 4: กิจกรรม
  </div>
  <RadioGroup
    label="ความรู้สึกแรกที่เดินเข้ามาในงาน น้องๆรู้สึกเป็นอย่างไรบ้าง"
    options={firstImpressionOptions}
    bind:value={responses.activityFirstImpression}
    required
    error={showErrors ? errors.activityFirstImpression : ""}
  />
  <RadioGroup
    label="มีเวิร์กช็อปที่อยากเข้าแต่ไม่ได้เข้าหรือไม่"
    options={yesNoOptions}
    bind:value={responses.activityMissedWorkshop}
    required
    error={showErrors ? errors.activityMissedWorkshop : ""}
  />
  {#if responses.activityMissedWorkshop === "มี"}
    <CheckboxGroup
      label="ถ้ามี เป็นเวิร์กช็อปอะไร"
      options={workshopOptions}
      bind:value={responses.activityMissedDepartments}
      required
      error={showErrors ? errors.activityMissedDepartments : ""}
    />
  {/if}
  {#if hasWorkshopCheckin}
    <RatingScale
      label="workshop ที่เข้าไป ให้คะแนนความ “สนุก” เท่าไหร่ (1-5)"
      bind:value={responses.activityWorkshopRating}
      required
      error={showErrors ? errors.activityWorkshopRating : ""}
    />
  {/if}

  <div class="divider text-xl font-bold text-token-6 text-shadow-2xs mt-8">ตอนที่ 5: ภาพรวมงาน</div>
  <RatingScale
    label="ความพึงพอใจต่องานโดยรวม"
    bind:value={responses.overviewRating}
    required
    error={showErrors ? errors.overviewRating : ""}
  />
  <TextInput
    label="ให้รีวิว Open House แล้วรู้สึกยังไงบ้าง ขอ 3 คำ (ไม่บังคับ)"
    bind:value={responses.overview3Words}
    placeholder="สนุก มาก เลย..."
  />
  <RadioGroup
    label="ความรู้สึกหลังจากเข้าร่วมงาน / รู้สึกอย่างไรบ้างหลังจากเข้าร่วมงาน"
    options={feelingOptions}
    bind:value={responses.overviewFeeling}
    required
    error={showErrors ? errors.overviewFeeling : ""}
  />
  <RadioGroup
    label="อะไรคือความประทับใจเมื่อน้องเข้าร่วมงานนี้"
    options={impressionOptions}
    bind:value={responses.overviewImpression}
    required
    error={showErrors ? errors.overviewImpression : ""}
  />

  <div class="divider text-xl font-bold text-token-6 text-shadow-2xs mt-8">ตอนที่ 6: บูธภาควิชา</div>
  <RadioGroup
    label="เมื่อน้องถามสต๊าฟแล้ว ได้คำตอบที่สามารถตอบข้อสงสัยของน้องๆได้มั้ย"
    options={staffAnswerOptions}
    bind:value={responses.boothStaffAnswer}
    required
    error={showErrors ? errors.boothStaffAnswer : ""}
  />
  <RatingScale
    label="ความน่าสนใจของภาควิชาในการนำเสนอ และได้ความรู้หลังจากได้ฟังบรรยาย"
    bind:value={responses.boothPresentationRating}
    required
    error={showErrors ? errors.boothPresentationRating : ""}
  />
  <RadioGroup
    label="ท่านมีคำถามที่อยากรู้แต่ไม่มีโอกาสได้รู้หรือไม่ (ถ้ามีสามารถทักมาสอบถามข้อมูลภาคได้ที่ IG ส่วนตัวของภาควิชาได้เลย)"
    options={yesNoOptions}
    bind:value={responses.boothUnansweredQuestions}
    required
    error={showErrors ? errors.boothUnansweredQuestions : ""}
  />
  <RatingScale
    label="เมื่อเทียบกับข้อมูลจากอินเทอร์เน็ต การมางานนี้ช่วยให้เข้าใจภาควิชามากขึ้นแค่ไหน"
    bind:value={responses.boothUnderstandingRating}
    required
    error={showErrors ? errors.boothUnderstandingRating : ""}
  />

  <div class="divider text-xl font-bold text-token-6 text-shadow-2xs mt-8">ตอนที่ 7: ข้อเสนอแนะ/ติชม</div>
  <TextInput
    label="มีอะไรอยากบอกทีมจัดงานไหม รวมๆหรือพี่คนไหนก็ได้ เดี๋ยวไปบอกต่อให้ (ไม่บังคับ)"
    bind:value={responses.feedbackMessage}
    placeholder="พิมพ์ข้อความของคุณที่นี่..."
  />
  <TextInput
    label="ถ้าน้องเป็นคนจัดงาน น้องจะแก้ตรงไหนเป็นพิเศษไหม (ไม่บังคับ)"
    bind:value={responses.feedbackImprovement}
    placeholder="พิมพ์ข้อเสนอแนะของคุณที่นี่..."
  />

  <div class="mt-8">
    <RadioGroup
      label="สุดท้ายนี้ พี่ขออวยพรให้น้อง ๆ ที่ตั้งใจตอบแบบสอบถามตามความเป็นจริงทุกคน สอบติดคณะที่ใช่ มหาลัยที่ชอบ สมหวังทุกประการเลยนะครับ/คะ!"
      options={[{ label: "รับทราบ", value: "รับทราบ" }]}
      bind:value={responses.closingAcknowledge}
      required
      error={showErrors ? errors.closingAcknowledge : ""}
    />
  </div>
</div>
