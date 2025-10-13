<script lang="ts" generics="T extends {}">
  import { createElement, type FC } from "react";
  import { createRoot, type Root } from "react-dom/client";

  // lmao
  interface Props<T extends {}> {
    component: FC<T>;
    props: T;
  }

  const { component: Component, props: reactProps }: Props<T> = $props();

  $inspect(Component, "Component");

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
    root?.render(createElement(Component, reactProps));
  });
</script>

<div class="contents" bind:this={container}></div>
