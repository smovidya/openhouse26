<script>
  import { authClientSvelte } from "@src/auth/client";
</script>

<button
  onclick={async () => {
    await authClientSvelte.signIn.social({
      provider: "google",
    });
  }}
>
  ลงทะเบียนเข้าร่วมกิจกรรม
</button>
