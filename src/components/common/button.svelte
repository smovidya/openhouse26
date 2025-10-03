<script lang="ts">
  import clsx from "clsx";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props {
    /**
     * Label for the button
     */
    children?: Snippet;
    href?: string;
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
    class={clsx(
      "w-full text-center py-3 rounded-xl border border-[#fff4da64] shadow-lg shadow-black/30 cursor-pointer",
      color,
      clazz,
    )}
    {...props as any}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    {disabled}
    type="button"
    class={clsx(
      "w-full text-center py-3 rounded-xl border border-[#fff4da64] shadow-lg shadow-black/30 cursor-pointer",
      color,
      clazz,
    )}
    {...props}
  >
    {@render children?.()}
  </button>
{/if}

<style>
  .yellow {
    background: linear-gradient(
      180deg,
      #ffb843 0%,
      #e99100 37%,
      #dd8900 52%,
      #ec9300 70%,
      #ffb53d 100%
    );

    &:hover:not(:disabled),
    &:active:not(:disabled) {
      background: linear-gradient(
        180deg,
        #ea9200 1.58%,
        #d26c00 29.98%,
        #c06c06 51.86%,
        #e17400 69.55%,
        #e99100 98.42%
      );
    }

  }
  
  button:disabled {
    filter: grayscale();
    cursor: not-allowed;
  }
</style>
