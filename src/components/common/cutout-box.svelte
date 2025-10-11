<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../utils";

  interface Props {
    class?: any;
    children?: Snippet;
  }

  let { class: clazz, children }: Props = $props();
</script>

<div
  class={cn(
    "border-neutral-400 text-black border-1 rounded-xl bg-white p-4 shadow-inner shadow-black/30",
    clazz,
  )}
>
  {@render children?.()}
</div>
