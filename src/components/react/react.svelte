<script lang="ts" generics="T extends {}">
  import { SvelteSnippet } from "@src/components/react/svelte-snippet";
  import { createElement, type FC } from "react";
  import { createRoot, type Root } from "react-dom/client";
  import type { Snippet } from "svelte";

  // lmao
  interface Props<T extends {}> {
    component: FC<T>;
    props: T;
    children?: Snippet;
  }

  const {
    component: Component,
    props: reactProps,
    children,
  }: Props<T> = $props();

  let container: HTMLDivElement | null = $state(null);
  let root = $state(null) as Root | null;

  $effect(() => {
    if (!container) {
      root = null;
      return;
    }

    root = createRoot(container);
    return () => root?.unmount();
  });

  $effect(() => {
    root?.render(
      createElement(
        Component,
        reactProps,
        children
          ? createElement(SvelteSnippet, {
              snippet: () => children!,
              param: () => undefined,
            })
          : undefined,
      ),
    );
  });
</script>

<div class="contents" bind:this={container}></div>
