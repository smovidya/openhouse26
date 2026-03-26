<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "./utils";

  interface Props {
    class?: string;
    widthMode?: "full" | "auto";
    children: Snippet;
  }

  const { class: className, children, widthMode = "auto" }: Props = $props();
</script>

<div
  class={cn(
    `w-auto bg-header-card text-background flex p-1.5 items-center justify-center rounded-2xl`,
    widthMode === "full" && "w-full rounded-none px-0",
    className,
  )}
>
  <div
    class={cn(
      "w-full h-full flex items-center ring-border-1 ring-2 text-center rounded-xl p-2 justify-center px-4 shadow-md",
      widthMode === "full" && "rounded-none",
    )}
  >
    {@render children()}
  </div>
</div>
