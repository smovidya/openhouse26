<script lang="ts">
  import type { Snippet } from "svelte";
  import { setFieldName } from "./context";
  interface Props {
    formState: any;
    name: string;
    children: Snippet;
  }

  let { children, formState, name }: Props = $props();

  setFieldName(name);
</script>

<div class="contents">
  {@render children?.()}
</div>
