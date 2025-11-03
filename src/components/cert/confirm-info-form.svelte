<script lang="ts">
  import { actions } from "astro:actions";
  import CheckmarkOutline from "carbon-icons-svelte/lib/CheckmarkOutline.svelte";
  import WarningHexFilled from "carbon-icons-svelte/lib/WarningHexFilled.svelte";
  let inputs = {
    givenName1: "",
    givenName2: "",
    givenName3: "",
    familyName1: "",
    familyName2: "",
    familyName3: "",
  };

  async function handleSubmit(event: Event) {
    const givenName = inputs.givenName1;
    const familyName = inputs.familyName1;
    event.preventDefault();
    const { error, data } = await actions.submitNameForCertificate({
      givenName: givenName,
      familyName: familyName,
    });

    if (error) {
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } else {
      alert("ยืนยันชื่อเรียบร้อยแล้ว");
      window.location.href = "/cert/download";
    }
  }
</script>

<div class="max-w-lg mx-auto gap-2 flex flex-col">
  <div class="mb-4">
    <label for="givenName1" class="label">ชื่อ (ครั้งที่ 1):</label>
    <div class="join join-horizontal">
      <input
        class="input"
        id="givenName1"
        type="text"
        placeholder="ขื่อพร้อมคำนำหน้า"
        bind:value={inputs.givenName1}
        required
      />
      <input
        class="input"
        id="givenName1"
        type="text"
        placeholder="นามสกุล"
        bind:value={inputs.familyName1}
        required
      />
    </div>
  </div>
  <div class="mb-4">
    <label for="givenName2" class="label">ชื่อ (ครั้งที่ 2):</label>
    <div class="join join-horizontal">
      <input
        class="input"
        id="givenName2"
        type="text"
        placeholder="ขื่อพร้อมคำนำหน้า"
        bind:value={inputs.givenName2}
        required
      />
      <input
        class="input"
        id="givenName2"
        type="text"
        placeholder="นามสกุล"
        bind:value={inputs.familyName2}
        required
      />
    </div>
  </div>
  <div class="mb-4">
    <label for="givenName1" class="label">ชื่อ (ครั้งที่ 3):</label>
    <div class="join join-horizontal">
      <input
        class="input"
        id="givenName1"
        type="text"
        placeholder="ขื่อพร้อมคำนำหน้า"
        bind:value={inputs.givenName3}
        required
      />
      <input
        class="input"
        id="givenName1"
        type="text"
        placeholder="นามสกุล"
        bind:value={inputs.familyName3}
        required
      />
    </div>
  </div>
  {#if inputs.givenName1 !== inputs.givenName2 || inputs.givenName1 !== inputs.givenName3 || inputs.familyName1 !== inputs.familyName2 || inputs.familyName1 !== inputs.familyName3}
    <div class="alert alert-warning">
      <WarningHexFilled size={24} />
      <span> ชื่อไม่ตรงกัน </span>
    </div>
  {/if}

  {#if inputs.givenName1 === ""}
    <div class="alert alert-warning">
      <WarningHexFilled size={24} />
      <span> กรุณากรอกชื่อ </span>
    </div>
  {/if}

  {#if inputs.familyName1 === ""}
    <div class="alert alert-warning">
      <WarningHexFilled size={24} />
      <span> กรุณากรอกนามสกุล </span>
    </div>
  {/if}

  {#if inputs.givenName1 === inputs.givenName2 && inputs.givenName1 === inputs.givenName3 && inputs.familyName1 === inputs.familyName2 && inputs.familyName1 === inputs.familyName3 && inputs.givenName1 !== ""}
    <div class="alert alert-success">
      <CheckmarkOutline size={24} />
      <span class=""> ชื่อตรงกัน </span>
    </div>
  {/if}

  <button
    class="btn btn-primary mt-4"
    type="submit"
    onclick={handleSubmit}
    disabled={inputs.givenName1 !== inputs.givenName2 ||
      inputs.givenName1 !== inputs.givenName3 ||
      inputs.familyName1 !== inputs.familyName2 ||
      inputs.familyName1 !== inputs.familyName3 ||
      inputs.givenName1 === ""}
  >
    ยืนยันชื่อสำหรับใบประกาศนียบัตร
  </button>
</div>
