<script lang="ts">
  import CutoutBox from "../common/cutout-box.svelte";

  interface Props {
    title: string;
    options: {
      label: string;
      value: string;
    }[];
    selected?: string[];
    class?: any;
    onChange?: (select: string[]) => unknown; // fuck tanstack
  }

  const id = $props.id();

  let {
    class: className,
    title,
    options,
    selected = $bindable([]),
  }: Props = $props();

  const set = (key: string) => (value: boolean) => {
    const included = selected.includes(key);
    if (!included && value) {
      selected.push(key);
    }
    if (included && !value) {
      selected = selected.filter((it) => it !== key);
    }

    // fuck tanstack store
    selected = selected;
  };

  const get = (key: string) => () => selected.includes(key);
</script>

<section class="text-white">
  <span class="text-lg">
    {title}
  </span>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-3">
    {#each options as { label, value }}
      <label>
        <input
          type="checkbox"
          name="{id}-value-{value}"
          class="checkbox bg-base-100 checked:bg-base-300 size-4 accent-neutral-400"
          bind:checked={get(value), set(value)}
        />
        <span class="ml-1">{label}</span>
      </label>
    {/each}
  </div>
</section>
