<script lang="ts">
  import { boothCheckpoints } from "@src/data/checkpoints";
  import { workshops } from "@src/data/workshops";
  import type { Actions } from "astro:actions";
  import type { ResourceReturn } from "runed";

  interface Props {
    boothId?: string;
    // boothData: ResourceReturn<
    //   Awaited<ReturnType<Actions[""]>>["data"]
    // >;
  }

  let {
    boothId = $bindable(boothCheckpoints[0].id),
    // boothData,
  }: Props = $props();
</script>

<h2 class="mt-6 mb-4">ประวัติการเช็คอิน</h2>

<section>
  <label class="flex flex-col gap-1">
    <span>บูธ/จุดสะสมคะแนน</span>
    <select class="select w-full" bind:value={boothId}>
      {#each boothCheckpoints as booth}
        <option value={booth.id}>{booth.name}</option>
      {/each}
    </select>
  </label>
</section>

<section class="mt-6">
  <!-- {#if boothData.loading}
    <div class="flex items-center w-full justify-center py-10">
      <span class="loading loading-spinner"></span>
    </div>
  {:else if boothData.error}
    <div class="alert alert-error">
      <p>
        เกิดข้อผิดพลาด: {boothData.error.message}
      </p>
    </div>
  {/if}
  -->

  <div class="flex justify-between items-center py-2">
    <div class="flex flex-col leading-5">
      <span>{"givenName"} {"familyName"}</span>
      <span class="text-sm">17 ปี ผู้ปกครอง</span>
    </div>
    <!-- <button> -> </button> -->
  </div>
</section>
