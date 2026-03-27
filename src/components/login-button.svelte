<script>
  import { authClientSvelte } from "@src/auth/client";

  const { children, redirect = "/register" } = $props();
</script>

<button
  class="btn btn-xl"
  onclick={async () => {
    await authClientSvelte.signIn.social({
      provider: "google",
      callbackURL: redirect,
    });
  }}
>
  {@render children?.()}
</button>
