<script>
  import { authClientSvelte } from "@src/auth/client";
  import Button from "./common/button.svelte";

  const { children } = $props();
</script>

<button
  class="btn btn-sm btn-ghost"
  onclick={async () => {
    await authClientSvelte.signOut();
    window.location.reload();
  }}
>
  {@render children?.()}
</button>
