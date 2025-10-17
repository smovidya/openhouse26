<script>
  import { authClientSvelte } from "@src/auth/client";
  import Button from "./common/button.svelte";

  const { children, redirect = "/register" } = $props();
</script>

<Button
  onclick={async () => {
    await authClientSvelte.signIn.social({
      provider: "google",
      callbackURL: redirect,
    });
  }}
>
  {@render children?.()}
</Button>
