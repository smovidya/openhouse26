<script>
  import { authClientSvelte } from "@src/auth/client";
  import Button from "./common/button.svelte";

  const { children } = $props();
</script>

<Button
  onclick={async () => {
    await authClientSvelte.signOut();
    alert("คุณได้ออกจากระบบแล้ว");
  }}
>
  {@render children?.()}
</Button>
