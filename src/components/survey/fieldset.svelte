<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  const { title, children }: Props = $props();
</script>

<fieldset
  class="fieldset text-md border-dashed border-base-200 border p-3 rounded-2xl text-white"
>
  <legend class="fieldset-legend text-lg px-1"> {title} </legend>
  {@render children?.()}
</fieldset>
