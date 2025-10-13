<script lang="ts" generics="T">
  import type { Snippet } from "svelte";

  interface Props {
    // we cant spread snippet props yet
    snippet: Snippet<[T]>;
    param: T;
  }

  const { snippet, param }: Props = $props();
</script>

{@render snippet(param)}
