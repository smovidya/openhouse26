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
  import LogoutButton from "@src/components/logout-button.svelte";
  import InterestedDepartments from "./interested-departments.svelte";
  import { departments } from "@src/data/departments";
  import Logo from "@src/assets/logo.png";
  import { actions } from "astro:actions";
  import WarningDiamond from "carbon-icons-svelte/lib/WarningDiamond.svelte";
  import { authClientSvelte } from "@src/auth/client";

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
      age: 15,
      specialNeeds: "",
      province: 0,
      howDidYouKnowUs: [] as string[],
      howDidYouKnowUsOther: "",

      whyJoinThis: [] as string[],
      whyJoinThisOther: "",

      status: "" as ParticipantStatus | "",
      school: "",
      interestedDepartments: [
        String(departments[0].id),
        "none",
        "none",
      ] as string[],
    },
    onSubmitInvalid(props) {
      alert("กรุณากรอกข้อมูลให้ถูกต้อง");
    },
    onSubmit: async ({ value }) => {
      console.log({ value });
      const { error } = await actions.registerParticipant({
        givenName: value.firstname,
        familyName: value.lastname,
        age: value.age,
        specialNeeds: value.specialNeeds,
        attendeeType: value.status,
        residentProvince: value.province,
        school: value.school,
        howDidYouKnowUs: value.howDidYouKnowUs.includes("other")
          ? [...value.howDidYouKnowUs.filter((it) => it !== "other")]
          : value.howDidYouKnowUs,
        whyJoinThis: value.whyJoinThis.includes("other")
          ? [...value.whyJoinThis.filter((it) => it !== "other")]
          : value.whyJoinThis,
        interestedDepartments: value.interestedDepartments
          .filter((it) => it !== "none")
          .map((it) => Number(it)),
        howDidYouKnowUsOther: value.howDidYouKnowUsOther,
        whyJoinThisOther: value.whyJoinThisOther,
      });

      if (error) {
        alert("เกิดข้อผิดพลาด: " + error.message);
        return;
      }

      window.location.href = "/register/finish";
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

  let acceptPrivacyPolicy = $state(false);
</script>

<article class="oph-soft-white">
  <div class="flex justify-end">
    <button
      class="text-white underline hover:cursor-pointer"
      onclick={async () => {
        await authClientSvelte.signOut();
        window.location.href = "/";
      }}
    >
      ออกจากระบบ
    </button>
  </div>
  <img src={Logo.src} alt="logo" class="size-24" />
  <h1 class="text-3xl oph-soft-white mt-8 font-serif text-white font-bold">
    ลงทะเบียนเข้าร่วมงาน
  </h1>
  <h2 class="mt-4 text-xl text-white font-serif font-bold">ข้อมูลส่วนตัว</h2>

  <form {onsubmit} class="mt-4 space-y-4 text-sm">
    <section class="grid grid-cols-2 gap-x-3 gap-y-1">
      <form.Field
        name="firstname"
        validators={{
          onChange: z.string().min(1, "กรุณาระบุชื่อ"),
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
                class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2 placeholder:"
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
          onChange: z.string().min(1, "กรุณาระบุนามสกุล"),
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

      <p class="col-span-2 text-orange-100">
        * ตรวจสอบให้ถูกต้องหากต้องการรับเกียรติบัตรการเข้าร่วม
      </p>
    </section>

    <form.Field
      name="age"
      validators={{
        onChange: z
          .number("กรุณาระบุอายุ")
          .min(5, "อายุน้อยเกินไป")
          .max(100, "อายุมากเกินไป"),
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
              min="5"
              max="100"
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
        onChange: (it) => (it.value === 0 ? "กรุณาเลือกจังหวัด" : undefined),
      }}
    >
      {#snippet children(field)}
        <label class="flex flex-col gap-1">
          <span class="text-white">จังหวัดที่พำนัก</span>
          <select
            name={field.name}
            bind:value={
              () => field.state.value, (value) => field.handleChange(value)
            }
            onblur={field.handleBlur}
            class="select shadow-inner shadow-black/30 w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
          >
            <!-- TODO: report this issue -->
            <!-- <button>เลือก</button> -->
            <option value="0" selected disabled hidden>เลือก</option>
            {#each provincesOptions as { label, value }}
              <option {value}>{label}</option>
            {/each}
          </select>
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
              class="select shadow-inner shadow-black/30 w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
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
            onChange: z.string().min(1, "กรุณาระบุสถานศึกษา"),
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
          name="interestedDepartments"
          validators={{
            onChange: (it) => {
              // console.log($state.snapshot(it.value))
              let founded = false;
              for (const departments of it.value) {
                // console.log(departments, founded)
                if (departments === "none") {
                  founded = true;
                } else if (founded) {
                  return "กรุณาเรียงลำดับให้ถูกต้อง";
                }
              }
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
              title="เหตุผลในการเข้าร่วมงานในครั้งนี้ (เลือกหลายคำตอบ)"
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

        {#if showOther2.current}
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
                  placeholder="ต้องการเข้าร่วมงานเพื่อ..."
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
            title="ท่านทราบและติดตามข่าวสารเกี่ยวกับงานผ่านช่องทางใดบ้าง (เลือกหลายคำตอบ)"
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
                placeholder="ช่องทาง"
              />
            </CutoutBox>
            <!-- {@render fieldError(field.state.meta.errors.map((it: any) => it?.message ?? "").join(", "))} -->
          {/snippet}
        </form.Field>
      {/if}
    {/if}

    <label>
      <input
        type="checkbox"
        class="checkbox bg-base-100 checked:bg-base-200"
        name="accept-privacy-policy"
        bind:checked={acceptPrivacyPolicy}
      />
      <span class="text-white">
        ยอมรับนโยบาย<a class="link" href="/info/privacy-policy"
          >ข้อมูลส่วนบุคคล</a
        >และ<a class="link" href="/info/terms-of-service"
          >ข้อกำหนดการให้บริการ</a
        >
      </span>
    </label>

    <Button
      color="yellow"
      type="submit"
      class="mt-6 text-white py-3 shadow-xs! shadow-black/10 w-full"
      disabled={status.current === "" || !acceptPrivacyPolicy}
    >
      <span class="flex flex-col items-center text-lg">ลงทะเบียน</span>
    </Button>
  </form>
</article>

{#snippet fieldError(message: string)}
  {#if message}
    <span class="text-error-content bg-error/50 rounded-md p-1 label">
      <WarningDiamond size={16} />
      {message}
    </span>
  {/if}
{/snippet}
