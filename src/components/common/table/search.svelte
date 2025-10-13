<script lang="ts">
  import { cn } from "@src/components/utils";
  import type { HTMLAttributes } from "svelte/elements";
  type Props = {
    searchQuery: string;
    class?: string;
  } & HTMLAttributes<HTMLInputElement>;

  let {
    searchQuery = $bindable(""),
    class: className = "",
    ...rest
  }: Props = $props();
</script>

<input
  class={cn("input input-sm", className)}
  type="text"
  bind:value={searchQuery}
  placeholder="ค้นหา..."
  {...rest}
/>
