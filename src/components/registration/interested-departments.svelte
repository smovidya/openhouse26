<script lang="ts">
  import { departments } from "@src/data/departments";
  import CutoutBox from "../common/cutout-box.svelte";

  interface Props {
    class?: any;
    selectedIds?: string[];
  }

  const departmentsOptions = departments.map((it) => ({
    label: it.thName,
    value: String(it.id),
  }));

  let {
    class: className,
    selectedIds = $bindable([departmentsOptions[0].value]),
  }: Props = $props();

  const get = (index: number) => () => {
    // if (index < selectedIds.length) {
    return selectedIds[index];
    // } else {
    //   return "none";
    // }
  };

  const set = (index: number) => (value: string) => {
    // console.log({ value });
    // if (index < selectedIds.length) {
    selectedIds[index] = value;
    // } else {
    //   selectedIds.push(value);
    // }

    // console.log(JSON.stringify(selectedIds));
    selectedIds = selectedIds;
  };
</script>

<section>
  <span> สาขาวิชาที่สนใจ </span>
  <div class="grid grid-cols-[auto_1fr] gap-2">
    <div
      class="h-full aspect-square border border-neutral-300 rounded-md flex items-center justify-center"
    >
      1
    </div>
    <CutoutBox class="p-0! rounded-md!">
      <select
        bind:value={get(0), set(0)}
        class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
      >
        {#each departmentsOptions as d, index}
          <option value={d.value}>{d.label}</option>
        {/each}
      </select>
    </CutoutBox>
    <div
      class="h-full aspect-square border border-neutral-300 rounded-md flex items-center justify-center"
    >
      2
    </div>
    <CutoutBox class="p-0! rounded-md!">
      <select
        bind:value={get(1), set(1)}
        class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
      >
        <option value="none">ไม่เลือกเพิ่มเติม</option>
        {#each departmentsOptions.filter((it) => it.value !== get(0)()) as d}
          <option value={d.value}>{d.label}</option>
        {/each}
      </select>
    </CutoutBox>
    <div
      class="h-full aspect-square border border-neutral-300 rounded-md flex items-center justify-center"
    >
      3
    </div>
    <CutoutBox class="p-0! rounded-md!">
      <select
        bind:value={get(2), set(2)}
        class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2"
      >
        <option value="none">ไม่เลือกเพิ่มเติม</option>
        {#each departmentsOptions.filter((it) => it.value !== get(0)() && it.value !== get(1)()) as d}
          <option value={d.value}>{d.label}</option>
        {/each}
      </select>
    </CutoutBox>
  </div>
</section>
