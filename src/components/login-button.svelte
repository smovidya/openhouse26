<script>
  import { authClientSvelte } from "@src/auth/client";
  import Button from "./common/button.svelte";

  const { children } = $props();
</script>

<Button
  onclick={async () => {
    await authClientSvelte.signIn.social({
      provider: "google",
      callbackURL: "/register",
    });
  }}
>
  {@render children?.()}
</Button>
