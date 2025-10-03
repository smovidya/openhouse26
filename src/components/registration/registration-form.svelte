<script lang="ts">
  import type { ParticipantStatus } from "@src/data/constants";
  import type { EventHandler } from "svelte/elements";
  import Button from "../common/button.svelte";
  import CutoutBox from "../common/cutout-box.svelte";

  interface Props {
    class?: any;
  }

  let { class: className }: Props = $props();

  const formData = $state({
    firstname: "",
    lastname: "",
    age: 0,
    specialNeeds: "",
    province: "",
    howDidYouKnowUs: [],
    status: "" as ParticipantStatus | "",

    interestedDepertments: [],
  });

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
              id=""
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
              id=""
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
            id=""
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
            id=""
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
            id=""
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
          <input
            id=""
            class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
            placeholder="TODO: select"
          />
        </CutoutBox>
      </label>
    </section>
  </form>

  <Button color="yellow" class="mt-6 text-white">
    <span class="flex flex-col items-center text-2xl">ลงทะเบียน</span>
  </Button>
</main>
