<script lang="ts">
  import clsx, { type ClassValue } from "clsx";
  import type { Snippet } from "svelte";

  interface Props {
    class?: ClassValue;
    a: number;
    children?: Snippet;
  }

  let { class: clazz, children, a }: Props = $props();
</script>

<div
  class={clsx(
    "border-neutral-500 border-1 rounded-xl bg-white p-4 shadow-inner shadow-black/30",
    clazz,
  )}
>
  {@render children?.()}
</div>
