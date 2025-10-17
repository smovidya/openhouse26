<script lang="ts">
  import { authClientSvelte } from "@src/auth/client";
  import Button from "./common/button.svelte";
  import type { Snippet } from "svelte";
  import { cn } from "./utils";

  const {
    children,
    class: className,
  }: {
    children?: Snippet;
    class?: string;
  } = $props();
</script>

<button
  class={cn("btn btn-sm btn-ghost", className)}
  onclick={async () => {
    await authClientSvelte.signOut();
    window.location.reload();
  }}
>
  {@render children?.()}
</button>
