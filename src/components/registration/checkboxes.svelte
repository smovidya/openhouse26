<script lang="ts">
  import CutoutBox from "../common/cutout-box.svelte";

  interface Props {
    title: string;
    options: {
      label: string;
      value: string;
    }[];
    selected?: string[];
    showOther?: boolean;
    other?: string;
    useOther?: boolean;
    class?: any;
  }

  const id = $props.id();

  let {
    class: className,
    title,
    options,
    selected = $bindable([]),
    showOther = false,
    other = $bindable(""),
    useOther = $bindable(false),
  }: Props = $props();

  const set = (key: string) => (value: boolean) => {
    const included = selected.includes(key);
    if (!included && value) {
      selected.push(key);
    }
    if (included && !value) {
      selected = selected.filter((it) => it !== key);
    }
  };

  const get = (key: string) => () => selected.includes(key);
</script>

<section>
  <span>
    {title}
  </span>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
    {#each options as { label, value }}
      <label class="">
        <input
          type="checkbox"
          name="{id}-value-{value}"
          bind:checked={get(value), set(value)}
        />
        <span>{label}</span>
      </label>
    {/each}
    {#if showOther}
      <label>
        <div>
          <input type="checkbox" name="{id}-hasother" bind:checked={useOther} />
          <span>อื่นๆ (โปรดระบุ)</span>
        </div>
        <CutoutBox class="p-0! rounded-lg! mt-2">
          <input
            type="text"
            name="{id}-other"
            bind:value={other}
            disabled={!useOther}
            class="w-full p-2 rounded-lg outline-blue-500 outline-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
            placeholder="สมชาย"
          />
        </CutoutBox>
      </label>
    {/if}
  </div>
</section>
