<script lang="ts">
  import {
    howDidYouKnowUsOptions,
    participantStatus,
    type ParticipantStatus,
  } from "@src/data/constants";
  import type { EventHandler } from "svelte/elements";
  import Button from "../common/button.svelte";
  import CutoutBox from "../common/cutout-box.svelte";
  import Checkboxes from "./checkboxes.svelte";

  interface Props {
    class?: any;
  }

  let { class: className }: Props = $props();

  const form = createForm

  const formData = $state({
    firstname: "",
    lastname: "",
    age: 0,
    specialNeeds: "",
    province: "",
    howDidYouKnowUs: [] as string[],
    howDidYouKnowUsOther: "",
    reason: "",
    status: "" as ParticipantStatus | "",
    school: "",
    interestedDepertments: [] as string[],
  });

  const showDepartmentPicker = $derived(
    formData.status != "ผู้ปกครอง" && formData.status != "อื่นๆ",
  );

  const errors: Partial<Record<keyof typeof formData, string>> = $state({});

  function validate(field: keyof typeof formData) {
    //
  }

  const onsubmit: EventHandler<SubmitEvent, HTMLFormElement> = (event) => {
    event.preventDefault();
  };
</script>

<main>
  <h1 class="text-2xl">ลงทะเบียนเข้าร่วมงาน</h1>
  <h2 class="mt-4 text-xl">ข้อมูลส่วนตัว</h2>

  <form {onsubmit} class="mt-4 space-y-4">
    <section class="grid grid-cols-2 gap-x-3 gap-y-1">
      <div>
        <label class="flex flex-col gap-1">
          <span>ชื่อและคำนำหน้า</span>
          <CutoutBox class="p-0! rounded-lg!">
            <input
              class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
              placeholder="สมชาย"
            />
          </CutoutBox>
        </label>
      </div>

      <div>
        <label class="flex flex-col gap-1">
          <span>นามสกุล</span>
          <CutoutBox class="p-0! rounded-lg!">
            <input
              class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
              placeholder="ใจดี"
            />
          </CutoutBox>
        </label>
      </div>

      <p class="col-span-2">
        * ตรวจสอบให้ถูกต้องหากต้องการรับเกียรติบัตรการเข้าร่วม
      </p>
    </section>

    <section>
      <label class="flex flex-col gap-1">
        <span>อายุ (ปี)</span>
        <CutoutBox class="p-0! rounded-lg!">
          <input
            class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
            placeholder="45"
          />
        </CutoutBox>
      </label>
    </section>

    <section>
      <label class="flex flex-col gap-1">
        <span>ความต้องการพิเศษ (ถ้ามี)</span>
        <CutoutBox class="p-0! rounded-lg!">
          <input
            class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
            placeholder="เช่น พิการทางการได้ยิน หรือ Wheelchair"
          />
        </CutoutBox>
      </label>
    </section>

    <section>
      <label class="flex flex-col gap-1">
        <span>จังหวัดที่พำนัก</span>
        <CutoutBox class="p-0! rounded-lg!">
          <input
            class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
            placeholder="TODO: select"
          />
        </CutoutBox>
      </label>
    </section>

    <section>
      <label class="flex flex-col gap-1">
        <span>สถานะ</span>
        <CutoutBox class="p-0! rounded-lg!">
          <select
            bind:value={formData.status}
            class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
          >
            <option value="" selected disabled hidden>เลือก</option>
            {#each participantStatus as status}
              <option value={status}>{status}</option>
            {/each}
          </select>
        </CutoutBox>
      </label>
    </section>

    {#if formData.status !== ""}
      {#if showDepartmentPicker}
        <section>
          <label class="flex flex-col gap-1">
            <span>สถานศึกษา</span>
            <CutoutBox class="p-0! rounded-lg!">
              <input
                class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
                placeholder="โรงเรียนเตรียมอุดมศึกษา"
              />
            </CutoutBox>
          </label>
        </section>
      {/if}

      <Checkboxes
        title="ท่านทราบและติดตามข่าวสารเกี่ยวกับงานผ่านช่องทางใดบ้าง(เลือกหลายคำตอบ)"
        options={howDidYouKnowUsOptions}
        bind:selected={formData.howDidYouKnowUs}
        bind:other={formData.howDidYouKnowUsOther}
        showOther
      />

      <section>
        <label class="flex flex-col gap-1">
          <span>นโยบายข้อมูลส่วนบุคคล</span>
          <CutoutBox class="p-2! rounded-lg!">
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
  </form>

  <Button
    color="yellow"
    class="mt-6 text-white"
    disabled={formData.status === ""}
  >
    <span class="flex flex-col items-center text-2xl">ลงทะเบียน</span>
  </Button>
</main>
