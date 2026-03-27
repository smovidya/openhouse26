<script lang="ts">
  import CheckboxGroup from "./CheckboxGroup.svelte";
  import SelectGroup from "./SelectGroup.svelte";
  import TextInput from "./TextInput.svelte";
  import { departments } from "../../data/departments";

  interface SurveyResponses {
    purposes: string[];
    interestedDepartments: string[];
    recommendRank1: string;
    recommendRank2: string;
    recommendRank3: string;
    recommendReason: string;
  }

  interface Props {
    responses: SurveyResponses;
    isValid: boolean;
    showErrors: boolean;
  }

  let {
    responses = $bindable({
      purposes: [],
      interestedDepartments: [],
      recommendRank1: "",
      recommendRank2: "",
      recommendRank3: "",
      recommendReason: "",
    }),
    isValid = $bindable(false),
    showErrors = $bindable(false),
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

  const interestedDepartmentOptions = [
    ...departmentOptions,
    { label: "ยังไม่มี / ลังเล", value: "ยังไม่มี / ลังเล" },
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
</div>
