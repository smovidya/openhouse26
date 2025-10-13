<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    href,
  }: {
    children: Snippet;
    href: string;
  } = $props();
</script>

<a {href} class="btn btn-xl">
  {@render children?.()}
</a>
