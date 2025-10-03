<script lang="ts">
  import {
    howDidYouKnowUsOptions,
    participantStatus,
    whyJoinThisOptions,
    type ParticipantStatus,
  } from "@src/data/constants";
  import { createForm } from "@tanstack/svelte-form";
  import type { EventHandler } from "svelte/elements";
  import { z } from "zod/v4";
  import Button from "../common/button.svelte";
  import CutoutBox from "../common/cutout-box.svelte";
  import Checkboxes from "./checkboxes.svelte";
  import { provincesOptions } from "@src/data/provinces";
  import InterestedDepartments from "./interested-departments.svelte";
  import { departments } from "@src/data/departments";
  import Logo from "@src/assets/logo.png";

  const howDidYouKnowUsOptions2 = [
    ...howDidYouKnowUsOptions,
    {
      value: "other",
      label: "อื่นๆ (โปรดระบุ)",
    },
  ];

  const whyJoinThisOptions2 = [
    ...whyJoinThisOptions,
    {
      value: "other",
      label: "อื่นๆ (โปรดระบุ)",
    },
  ];

  interface Props {}

  let {}: Props = $props();

  const form = createForm(() => ({
    defaultValues: {
      firstname: "",
      lastname: "",
      age: 0,
      specialNeeds: "",
      province: "0",
      howDidYouKnowUs: [] as string[],
      howDidYouKnowUsOther: "",

      whyJoinThis: [] as string[],
      whyJoinThisOther: "",

      reason: "",
      status: "" as ParticipantStatus | "",
      school: "",
      interestedDepertments: [
        String(departments[0].id),
        "none",
        "none",
      ] as string[],
    },
    onSubmitInvalid(props) {
      console.log(props);
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  }));

  const status = form.useStore((it) => it.values.status);
  const showDepartmentPicker = $derived(
    status.current != "ผู้ปกครอง" && status.current != "อื่นๆ",
  );
  const showOther = form.useStore((it) =>
    it.values.howDidYouKnowUs.includes("other"),
  );

  const showOther2 = form.useStore((it) =>
    it.values.whyJoinThis.includes("other"),
  );

  const onsubmit: EventHandler<SubmitEvent, HTMLFormElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  };
</script>

<main class="font-serif">
  <img src={Logo.src} alt="logo" class="size-24" />
  <h1 class="text-3xl mt-8 font-sans text-white">ลงทะเบียนเข้าร่วมงาน</h1>
  <h2 class="mt-4 text-xl text-white">ข้อมูลส่วนตัว</h2>

  <form {onsubmit} class="mt-4 space-y-4 text-sm">
    <section class="grid grid-cols-2 gap-x-3 gap-y-1">
      <form.Field
        name="firstname"
        validators={{
          onChange: z.string().min(1, "กรุณากรอกชื่อ"),
        }}
      >
        {#snippet children(field)}
          <label class="flex flex-col gap-1">
            <span class="text-white">ชื่อและคำนำหน้า</span>
            <CutoutBox class="p-0! rounded-lg!">
              <input
                name={field.name}
                bind:value={
                  () => field.state.value, (value) => field.handleChange(value)
                }
                onblur={field.handleBlur}
                class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
                placeholder="สมชาย"
              />
            </CutoutBox>
            {@render fieldError(
              field.state.meta.errors
                .map((it: any) => it?.message ?? "")
                .join(", "),
            )}
          </label>
        {/snippet}
      </form.Field>

      <form.Field
        name="lastname"
        validators={{
          onChange: z.string().min(1, "กรุณากรอกนามสกุล"),
        }}
      >
        {#snippet children(field)}
          <label class="flex flex-col gap-1">
            <span class="text-white">นามสกุล</span>
            <CutoutBox class="p-0! rounded-lg!">
              <input
                name={field.name}
                bind:value={
                  () => field.state.value, (value) => field.handleChange(value)
                }
                onblur={field.handleBlur}
                class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
                placeholder="ใจดี"
              />
            </CutoutBox>
            {@render fieldError(
              field.state.meta.errors
                .map((it: any) => it?.message ?? "")
                .join(", "),
            )}
          </label>
        {/snippet}
      </form.Field>

      <p class="col-span-2 text-orange-300">
        * ตรวจสอบให้ถูกต้องหากต้องการรับเกียรติบัตรการเข้าร่วม
      </p>
    </section>

    <form.Field
      name="age"
      validators={{
        onChange: z.number().min(0, "ไม่เกิดที").max(200, "ไม่เชื่อ โม้"),
      }}
    >
      {#snippet children(field)}
        <label class="flex flex-col gap-1">
          <span class="text-white">อายุ (ปี)</span>
          <CutoutBox class="p-0! rounded-lg!">
            <input
              name={field.name}
              type="number"
              bind:value={
                () => field.state.value, (value) => field.handleChange(value)
              }
              onblur={field.handleBlur}
              class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
              placeholder="23"
            />
          </CutoutBox>
          {@render fieldError(
            field.state.meta.errors
              .map((it: any) => it?.message ?? "")
              .join(", "),
          )}
        </label>
      {/snippet}
    </form.Field>

    <form.Field name="specialNeeds">
      {#snippet children(field)}
        <label class="flex flex-col gap-1">
          <span class="text-white">ความต้องการพิเศษ (ถ้ามี)</span>
          <CutoutBox class="p-0! rounded-lg!">
            <input
              name={field.name}
              bind:value={
                () => field.state.value, (value) => field.handleChange(value)
              }
              onblur={field.handleBlur}
              class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
              placeholder="เช่น พิการทางการได้ยิน หรือ Wheelchair"
            />
          </CutoutBox>
        </label>
      {/snippet}
    </form.Field>

    <form.Field
      name="province"
      validators={{
        onChange: (it) => (it.value === "0" ? "กรุณาเลือกจังหวัด" : undefined),
      }}
    >
      {#snippet children(field)}
        <label class="flex flex-col gap-1">
          <span class="text-white">จังหวัดที่พำนัก</span>
          <CutoutBox class="p-0! rounded-lg!">
            <select
              name={field.name}
              bind:value={
                () => field.state.value, (value) => field.handleChange(value)
              }
              onblur={field.handleBlur}
              class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
            >
              <!-- TODO: report this issue -->
              <!-- <button>เลือก</button> -->
              <option value="0" selected disabled hidden>เลือก</option>
              {#each provincesOptions as { label, value }}
                <option {value}>{label}</option>
              {/each}
            </select>
          </CutoutBox>
          {@render fieldError(field.state.meta.errors.join(", "))}
        </label>
      {/snippet}
    </form.Field>

    <form.Field name="status">
      {#snippet children(field)}
        <label class="flex flex-col gap-1">
          <span class="text-white">สถานะ</span>
          <CutoutBox class="p-0! rounded-lg!">
            <select
              name={field.name}
              bind:value={
                () => field.state.value, (value) => field.handleChange(value)
              }
              onblur={field.handleBlur}
              class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
            >
              <option value="" selected disabled hidden>เลือก</option>
              {#each participantStatus as status}
                <option value={status}>{status}</option>
              {/each}
            </select>
          </CutoutBox>
          {@render fieldError("")}
        </label>
      {/snippet}
    </form.Field>

    {#if status.current !== ""}
      {#if showDepartmentPicker}
        <form.Field
          name="school"
          validators={{
            onChange: z.string().min(1, "กรุณากรอกสถานศึกษา"),
          }}
        >
          {#snippet children(field)}
            <label class="flex flex-col gap-1">
              <span class="text-white">สถานศึกษา</span>
              <CutoutBox class="p-0! rounded-lg!">
                <input
                  name={field.name}
                  bind:value={
                    () => field.state.value,
                    (value) => field.handleChange(value)
                  }
                  onblur={field.handleBlur}
                  class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
                  placeholder="โรงเรียนเตรียมอุดมศึกษา"
                />
              </CutoutBox>
              {@render fieldError(
                field.state.meta.errors
                  .map((it: any) => it?.message ?? "")
                  .join(", "),
              )}
            </label>
          {/snippet}
        </form.Field>

        <form.Field
          name="interestedDepertments"
          validators={{
            onChange: (it) => {
              // console.log($state.snapshot(it.value))
              let founded = false;
              for (const departments of it.value) {
                // console.log(departments, founded)
                if (departments === "none") {
                  founded = true;
                } else if (founded) {
                  console.log("asdnfgytu");
                  return "กรุณาเรียงลำดับให้ถูกต้อง";
                }
              }
              console.log("ok");
            },
          }}
        >
          {#snippet children(field)}
            <InterestedDepartments
              bind:selectedIds={
                () => field.state.value, (value) => field.handleChange(value)
              }
            />
            {@render fieldError(field.state.meta.errors.join(", "))}
          {/snippet}
        </form.Field>
      {:else}
        <form.Field
          name="whyJoinThis"
          validators={{
            onChange: z.string().array().min(1, "กรุณาเลือกอย่างน้อย 1 ข้อ"),
          }}
        >
          {#snippet children(field)}
            <Checkboxes
              title="ท่านทราบและติดตามข่าวสารเกี่ยวกับงานผ่านช่องทางใดบ้าง(เลือกหลายคำตอบ)"
              options={whyJoinThisOptions2}
              bind:selected={
                () => field.state.value, (value) => field.handleChange(value)
              }
            />
            {@render fieldError(
              field.state.meta.errors
                .map((it: any) => it?.message ?? "")
                .join(", "),
            )}
          {/snippet}
        </form.Field>

        {#if showOther.current}
          <form.Field name="whyJoinThisOther">
            {#snippet children(field)}
              <CutoutBox class="p-0! rounded-lg! -mt-2">
                <input
                  name={field.name}
                  bind:value={
                    () => field.state.value,
                    (value) => field.handleChange(value)
                  }
                  onblur={field.handleBlur}
                  class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
                  placeholder=""
                />
              </CutoutBox>
              <!-- {@render fieldError(field.state.meta.errors.map((it: any) => it?.message ?? "").join(", "))} -->
            {/snippet}
          </form.Field>
        {/if}
      {/if}

      <form.Field
        name="howDidYouKnowUs"
        validators={{
          onChange: z.string().array().min(1, "กรุณาเลือกอย่างน้อย 1 ข้อ"),
        }}
      >
        {#snippet children(field)}
          <Checkboxes
            title="ท่านทราบและติดตามข่าวสารเกี่ยวกับงานผ่านช่องทางใดบ้าง(เลือกหลายคำตอบ)"
            options={howDidYouKnowUsOptions2}
            bind:selected={
              () => field.state.value, (value) => field.handleChange(value)
            }
          />
          {@render fieldError(
            field.state.meta.errors
              .map((it: any) => it?.message ?? "")
              .join(", "),
          )}
        {/snippet}
      </form.Field>

      {#if showOther.current}
        <form.Field name="howDidYouKnowUsOther">
          {#snippet children(field)}
            <CutoutBox class="p-0! rounded-lg! -mt-2">
              <input
                name={field.name}
                bind:value={
                  () => field.state.value, (value) => field.handleChange(value)
                }
                onblur={field.handleBlur}
                class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
                placeholder=""
              />
            </CutoutBox>
            <!-- {@render fieldError(field.state.meta.errors.map((it: any) => it?.message ?? "").join(", "))} -->
          {/snippet}
        </form.Field>
      {/if}

      <section>
        <label class="flex flex-col gap-1">
          <span class="text-white">นโยบายข้อมูลส่วนบุคคล</span>
          <CutoutBox class="p-3! rounded-lg!">
            <p>
              何も無いんだ 何も無いんだ 何も無いんだ わたしって
              「間違った」その罰がさ 今もわたしを締め付ける さかなになって
              くじらになって 月夜に浮かぶ星になって 夢を見るわたしを
              どうか許してほしいの ずっと甘い幽々幽々と
              べつに悩んでるとかそういうわけじゃないよ ただ ただ漠然と
              なんていうか わたしってダメだなって ごめんね
            </p>
          </CutoutBox>
        </label>
      </section>
    {/if}

    <Button
      color="yellow"
      type="submit"
      class="mt-6 text-white py-3!"
      disabled={status.current === ""}
    >
      <span class="flex flex-col items-center text-lg">ลงทะเบียน</span>
    </Button>
  </form>
</main>

{#snippet fieldError(message: string)}
  <!-- fuck this -->
  <p class="text-red-400">
    {message}
  </p>
{/snippet}
