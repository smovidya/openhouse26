<script lang="ts">
  import clsx, { type ClassValue } from "clsx";
  import type { Snippet } from "svelte";

  interface Props {
    class?: ClassValue;
    children?: Snippet;
  }

  let { class: clazz, children }: Props = $props();
</script>

<div
  class={clsx(
    "border-neutral-400 border-1 rounded-xl bg-white p-4 shadow-inner shadow-black/30",
    clazz,
  )}
>
  {@render children?.()}
</div>
