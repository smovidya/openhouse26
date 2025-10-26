<script lang="ts">
  import { departments } from "@src/data/departments";
  import {
    createForm,
    FieldApi,
    type AnyFieldApi,
  } from "@tanstack/svelte-form";
  import { actions } from "astro:actions";
  import z, { map } from "zod";
  import Fieldset from "./fieldset.svelte";
  import FieldStarRating from "./field-star-rating.svelte";

  const form = createForm(() => ({
    validators: {
      onChange: z.object({
        purposeOfAttendance: z
          .array(z.string())
          .min(1, "กรุณาเลือกอย่างน้อย 1 ข้อ"),
        satisfication: z.object({
          department: z.object({
            interestedDepartment: z
              .array(z.string())
              .min(1, "กรุณาเลือกอย่างน้อย 1 ข้อ"),
            mostFavouriteDepartmentBooth: z.string(),
            boothSatisfaction: z.number(),
          }),
          placeAndFacilities: z.object({
            crowdManagement: z.number(),
            transportation: z.number(),
            tolietFacilities: z.number(),
            nursingPointFacilities: z.number(),
            cleanliness: z.number(),
          }),
          registration: z.object({
            websiteEaseOfAcess: z.number(),
            websiteEaseOfUse: z.number(),
            websiteBeautifulness: z.number(),
          }),
          activities: z.object({
            informationClarity: z.number(),
            workshopRegistrationDuration: z.number(),
            canJoinWorkshopAsDesired: z.number(),
            souvenirAppropriateness: z.number(),
          }),
          workshop: z.object({
            workshopContentSatisfaction: z.number(),
          }),
          overall: z.object({
            overallSatisfaction: z.number(),
            recommendToOthers: z.number(),
            intendToStudyHere: z.string(),
          }),
          otherFeedback: z.object({
            feedbackAndSuggestions: z.string(),
          }),
          departmentBooth: z.object({
            contentMetExpectation: z.number(),
            staffCommunication: z.number(),
            interestingOfContent: z.number(),
          }),
        }),
      }),
    },
    defaultValues: {
      purposeOfAttendance: [] as string[],
      satisfication: {
        department: {
          interestedDepartment: [] as string[],
          mostFavouriteDepartmentBooth: "",
          boothSatisfaction: 1,
        },
        placeAndFacilities: {
          crowdManagement: 1,
          transportation: 1,
          tolietFacilities: 1,
          nursingPointFacilities: 1,
          cleanliness: 1,
        },
        registration: {
          websiteEaseOfAcess: 1,
          websiteEaseOfUse: 1,
          websiteBeautifulness: 1,
        },
        activities: {
          informationClarity: 1,
          workshopRegistrationDuration: 1,
          canJoinWorkshopAsDesired: 1,
          souvenirAppropriateness: 1,
        },
        workshop: {
          workshopContentSatisfaction: 1,
        },
        overall: {
          overallSatisfaction: 1,
          recommendToOthers: 1,
          intendToStudyHere: "" as string,
        },
        otherFeedback: {
          feedbackAndSuggestions: "",
        },
        departmentBooth: {
          contentMetExpectation: 1,
          staffCommunication: 1,
          interestingOfContent: 1,
        },
      },
    },
    onSubmitInvalid({ formApi }) {
      document.querySelector("[aria-invalid='true']")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    onSubmit: async ({ value }) => {
      await actions.submitSurvey(value);
      // TODO: redirect to certificate page & guarding this page
    },
  }));

  const formErrorMap = form.useStore((state) => state.errorMap);
  const formValues = form.useStore((state) => state.values);
</script>

{#snippet multipleSelect(
  title: string,
  name: string,
  options: { value: string; label: string }[],
  onSelect?: (selected: string[]) => void,
  field: AnyFieldApi | null = null,
)}
  <div
    class="flex flex-col justify-start border p-2 border-base-200/50 rounded-lg"
    aria-invalid={field?.state.meta.errors.length ? true : false}
  >
    <div class="text-lg flex flex-col">
      <span class="text-md font-medium"> {title} </span>
      <span class="text-secondary"> เลือกได้หลายรายการ </span>
    </div>
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2 columns-2">
      {#each options as option (option.value)}
        <label class="label">
          <input
            {name}
            type="checkbox"
            class="checkbox"
            checked={field?.state.value?.includes(option.value)}
            value={option.value}
            onchange={(e) => {
              const checked = e.currentTarget.checked;
              let selected: string[] = [];
              if (checked) {
                selected = [...(field?.state.value || []), option.value];
              } else {
                selected = (field?.state.value || []).filter(
                  (v: string) => v !== option.value,
                );
              }
              onSelect?.(selected);
            }}
            onblur={field?.handleBlur}
          />
          <span class="wrap-normal">
            {option.label}
          </span>
        </label>
      {/each}
    </div>
    <div class="flex flex-col mt-2">
      {#each field?.state.meta.errors as error}
        <span class="badge-xs text-xs badge badge-error empty:hidden">
          <span>{error.message}</span>
        </span>
      {/each}
    </div>
  </div>
{/snippet}

{#snippet singleSelect(
  title: string,
  name: string,
  options: { value: string; label: string }[],
  onSelect?: (selected: string) => void,
  field: AnyFieldApi | null = null,
)}
  <div
    class="flex flex-col justify-start border p-2 border-base-200/50 rounded-lg"
    aria-invalid={field?.state.meta.errors.length ? true : false}
  >
    <div class="text-lg flex flex-col">
      <span class="text-md font-medium"> {title} </span>
    </div>
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2 columns-2">
      {#each options as option (option.value)}
        <label class="label">
          <input
            required
            type="radio"
            {name}
            class="radio"
            value={option.value}
            onchange={(e) => {
              const selected = e.currentTarget.value;
              onSelect?.(selected);
            }}
            onblur={field?.handleBlur}
          />
          <span class="wrap-normal">
            {option.label}
          </span>
        </label>
      {/each}
    </div>
    <div class="flex flex-col mt-2">
      {#each field?.state.meta.errors as error}
        <span class="badge-xs text-xs badge badge-error empty:hidden">
          <span>{error.message}</span>
        </span>
      {/each}
    </div>
  </div>
{/snippet}

<article class="prose mt-10">
  <h1>แบบสอบถาม</h1>
  <p>
    โปรดตอบแบบสอบถามตามความเห็นของท่านด้านล่างเพื่อรับเกียรติบัตร
    เนื้อหาในการตอบแบบสอบถามของคุณจะถูกเก็บเป็นความลับ
    และใช้เพื่อพัฒนาและปรับปรุงโครงการในครั้งต่อไปให้ดียิ่งขึ้น
    ศึกษารายละเอียดเพิ่มเติมได้ที่<a href="/info/privacy-policy"
      >นโยบายความเป็นส่วนตัว</a
    >ของโครงการ
  </p>

  <form
    onsubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }}
  >
    <div class="space-y-6">
      <Fieldset title="ข้อมูลทั่วไป">
        <form.Field name="purposeOfAttendance">
          {#snippet children(field)}
            {@render multipleSelect(
              "เหตุผลในการเข้าร่วมงาน (เลือกได้หลายตัวเลือก)",
              field.name,
              [
                "สนใจศึกษาต่อ",
                "ดูสถานที่และบรรยากาศ",
                "มาเป็นเพื่อนกับเพื่อน",
                "รับเกียรติบัตร",
                "เข้าร่วมเวิร์กช็อป",
                "ศึกษาข้อมูลหลักสูตร",
                "พบกับนิสิตที่กำลังศึกษาในภาควิชาที่สนใจ",
              ].map((label) => ({
                value: label,
                label,
              })),
              (v) => {
                console.log(v);
                field.handleChange(v);
              },
              field,
            )}
          {/snippet}
        </form.Field>
      </Fieldset>
      <Fieldset title="ความพึงพอใจต่อบูธของภาควิชา">
        <form.Field name="satisfication">
          <form.Field name="satisfication.department.interestedDepartment">
            {#snippet children(field)}
              {@render multipleSelect(
                "ภาควิชาที่มีความสนใจ (เลือกได้หลายตัวเลือก)",
                field.name,
                departments.map((d) => ({
                  label: d.thName,
                  value: d.thName,
                })),
                (v) => field.handleChange(v),
                field,
              )}
            {/snippet}
          </form.Field>
          <form.Field
            name="satisfication.department.mostFavouriteDepartmentBooth"
          >
            {#snippet children(field)}
              {@render singleSelect(
                "บูธของภาควิชาที่ชื่นชอบที่สุด",
                field.name,
                departments.map((d) => ({
                  label: d.thName,
                  value: d.thName,
                })),
                (v) => field.handleChange(v),
              )}
            {/snippet}
          </form.Field>
        </form.Field>
        <form.Field name="satisfication.department.boothSatisfaction">
          {#snippet children(field)}
            <FieldStarRating
              title="กิจกรรมในบูธต่าง ๆ น่าสนใจและเป็นประโยชน์"
              {field}
            />
          {/snippet}
        </form.Field>
      </Fieldset>
      <Fieldset title="สถานที่จัดงาน">
        <form.Field name="satisfication.placeAndFacilities.crowdManagement">
          {#snippet children(field)}
            <FieldStarRating title="ความแออัดของสถานที่จัดงาน" {field} />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.placeAndFacilities.transportation">
          {#snippet children(field)}
            <FieldStarRating
              title="ความสะดวกในการเดินทางไปยังสถานที่จัดงาน"
              {field}
            />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.placeAndFacilities.tolietFacilities">
          {#snippet children(field)}
            <FieldStarRating
              title="ความสะอาดและความเพียงพอของห้องน้ำ"
              {field}
            />
          {/snippet}
        </form.Field>
        <form.Field
          name="satisfication.placeAndFacilities.nursingPointFacilities"
        >
          {#snippet children(field)}
            <FieldStarRating title="ความเหมาะสมของจุดพยาบาล" {field} />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.placeAndFacilities.cleanliness">
          {#snippet children(field)}
            <FieldStarRating title="ความสะอาดภายในงานและจุดทิ้งขยะ" {field} />
          {/snippet}
        </form.Field>
      </Fieldset>
      <Fieldset title="การลงทะเบียนเข้าร่วมงาน">
        <form.Field name="satisfication.registration.websiteEaseOfAcess">
          {#snippet children(field)}
            <FieldStarRating
              title="ความสะดวกในการเข้าถึงเว็บไซต์ลงทะเบียน"
              {field}
            />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.registration.websiteEaseOfUse">
          {#snippet children(field)}
            <FieldStarRating
              title="ความง่ายในการใช้งานเว็บไซต์ลงทะเบียน"
              {field}
            />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.registration.websiteBeautifulness">
          {#snippet children(field)}
            <FieldStarRating title="ความสวยงามของเว็บไซต์ลงทะเบียน" {field} />
          {/snippet}
        </form.Field>
      </Fieldset>
      <Fieldset title="กิจกรรมภายในงาน">
        <form.Field name="satisfication.activities.informationClarity">
          {#snippet children(field)}
            <FieldStarRating
              title="ท่านได้รับข้อมูลเกี่ยวกับงานครบถ้วน ไม่สับสน"
              {field}
            />
          {/snippet}
        </form.Field>
        <form.Field
          name="satisfication.activities.workshopRegistrationDuration"
        >
          {#snippet children(field)}
            <FieldStarRating
              title="ระยะเวลาลงทะเบียนเวิร์กช็อปเหมาะสม"
              {field}
            />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.activities.canJoinWorkshopAsDesired">
          {#snippet children(field)}
            <FieldStarRating
              title="สามารถเข้าร่วมเวิร์กช็อปได้ตามต้องการ"
              {field}
            />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.activities.souvenirAppropriateness">
          {#snippet children(field)}
            <FieldStarRating title="ของที่ระลึกที่ได้มีความเหมาะสม" {field} />
          {/snippet}
        </form.Field>
      </Fieldset>
      <Fieldset title="เวิร์กช็อป">
        <form.Field name="satisfication.workshop.workshopContentSatisfaction">
          {#snippet children(field)}
            <FieldStarRating
              title="เนื้อหาสาระกิจกรรมตรงตามความคาดหวัง"
              {field}
            />
          {/snippet}
        </form.Field>
      </Fieldset>
      <Fieldset title="ภาพรวมของงาน Open House">
        <form.Field name="satisfication.overall.overallSatisfaction">
          {#snippet children(field)}
            <FieldStarRating
              title="ความพึงพอใจโดยรวมต่องาน Open House"
              {field}
              starLabels={[
                "ไม่พึงพอใจอย่างยิ่ง",
                "ไม่พึงพอใจ",
                "เฉย ๆ",
                "พึงพอใจ",
                "พึงพอใจอย่างยิ่ง",
              ]}
            />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.overall.recommendToOthers">
          {#snippet children(field)}
            <FieldStarRating
              title="หากมีโอกาสหน้าท่านจะแนะนำ Sci Chula Openhouse แก่ผู้อื่น"
              {field}
              starLabels={[
                "จะไม่แนะนำแน่นอน",
                "จะไม่แนะนำ",
                "ขอพิจารณาก่อน",
                "อาจจะแนะนำ",
                "จะแนะนำแน่นอน",
              ]}
            />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.overall.intendToStudyHere">
          {#snippet children(field)}
            {@render singleSelect(
              "หลังจากเข้าร่วมงาน ท่านมีความตั้งใจที่จะศึกษาต่อที่คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัยหรือไม่",
              field.name,
              [
                {
                  label: "สนใจศึกษาต่อ",
                  value: "สนใจศึกษาต่อ",
                },
                {
                  label: "ขอพิจารณาก่อน",
                  value: "ขอพิจารณาก่อน",
                },
                {
                  label: "ไม่สนใจ",
                  value: "ไม่สนใจ",
                },
              ],
              (v) => field.handleChange(v),
            )}
          {/snippet}
        </form.Field>
      </Fieldset>
      <Fieldset
        title="ความคิดเห็นเกี่ยวกับบูธ {formValues.current.satisfication
          .department.mostFavouriteDepartmentBooth}"
      >
        <form.Field name="satisfication.departmentBooth.contentMetExpectation">
          {#snippet children(field)}
            <FieldStarRating
              title="เนื้อหาที่ได้รับตรงกับความคาดหวัง"
              {field}
            />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.departmentBooth.staffCommunication">
          {#snippet children(field)}
            <FieldStarRating
              title="ความเหมาะสมในการสื่อสารของผู้ปฎิบัติงานประจําบูธ"
              starLabels={[
                "ไม่เหมาะสมอย่างยิ่ง",
                "ไม่เหมาะสม",
                "เฉย ๆ",
                "เหมาะสม",
                "เหมาะสมอย่างยิ่ง",
              ]}
              {field}
            />
          {/snippet}
        </form.Field>
        <form.Field name="satisfication.departmentBooth.interestingOfContent">
          {#snippet children(field)}
            <FieldStarRating
              title="ความน่าสนใจของสื่อใช้ในการนําเสนอ"
              starLabels={[
                "ไม่น่าสนใจเลย",
                "ไม่น่าสนใจ",
                "เฉย ๆ",
                "น่าสนใจ",
                "น่าสนใจอย่างยิ่ง",
              ]}
              {field}
            />
          {/snippet}
        </form.Field>
      </Fieldset>

      <Fieldset title="ข้อติชม/ข้อเสนอแนะ">
        <form.Field name="satisfication.otherFeedback.feedbackAndSuggestions">
          {#snippet children(field)}
            <div class="flex flex-col">
              <label for={field.name}
                >ข้อเสนอแนะอื่น ๆ เพิ่มเติมเกี่ยวกับงาน</label
              >
              <textarea
                class="textarea min-h-24"
                placeholder="อยากให้..."
                onblur={field.handleBlur}
                onchange={(e) => field.handleChange(e.currentTarget.value)}
              ></textarea>
              <p class="label">ไม่บังคับ</p>
            </div>
          {/snippet}
        </form.Field>
      </Fieldset>
    </div>
    <form.Subscribe
      selector={({ canSubmit }) => ({
        canSubmit,
      })}
    >
      {#snippet children(field)}
        <button
          type="submit"
          disabled={!field.canSubmit}
          class="btn btn-primary mt-6"
        >
          ส่งแบบสอบถาม
        </button>
      {/snippet}
    </form.Subscribe>
  </form>
</article>
