<script lang="ts">
  import clsx from "clsx";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props {
    /**
     * Label for the button
     */
    children?: Snippet;
    color: "yellow";
  }

  const {
    children,
    color,
    class: clazz = "yellow",
    ...props
  }: Props & HTMLAttributes<HTMLButtonElement> = $props();
</script>

<button
  type="button"
  class={clsx(
    "w-full py-3 rounded-xl border border-[#fff4da64] shadow-lg shadow-black/30 cursor-pointer",
    color,
    clazz
  )}
  {...props}
>
  {@render children?.()}
</button>

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

    &:hover,
    &:active {
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
</style>
