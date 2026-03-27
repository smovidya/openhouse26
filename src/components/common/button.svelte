<script lang="ts">
  import { cn } from "../utils";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props {
    /**
     * Label for the button
     */
    children?: Snippet;
    href?: string;
    class?: string;
    color?: "yellow";
  }

  const {
    children,
    color = "yellow",
    href,
    disabled,
    class: clazz,
    ...props
  }: Props & HTMLButtonAttributes = $props();
</script>

{#if href}
  <a
    {href}
    {disabled}
    class={cn(
      "bg-token-5 block w-fit group shadow-md p-1 min-w-40 rounded-2xl font-bold uppercase",
      "active:shadow-xs duration-100 active:translate-y-0.5",
      clazz,
    )}
    {...props as any}
  >
    <span
      class="shadow-md border-2 border-white block rounded-xl py-1 group-hover:shadow-sm duration-100 group-active:shadow-none"
    >
      {@render children?.()}
    </span>
  </a>
{:else}
  <button
    {disabled}
    type="button"
    class={cn(
      "bg-token-5 group shadow-md p-1 min-w-40 rounded-2xl font-bold uppercase",
      "active:shadow-xs duration-100 active:translate-y-0.5",
      clazz,
    )}
    {...props}
  >
    <span
      class="shadow-md w-full border-2 border-white block rounded-xl py-1 group-hover:shadow-sm duration-100 group-active:shadow-none"
    >
      {@render children?.()}
    </span>
  </button>
{/if}
