<script lang="ts">
  import QrIcon from "@src/assets/icons/qrcode.svg";
  import LogoNoCircle from "@src/assets/logo-no-circle.png";
  import clsx from "clsx";

  interface Props {
    class?: any;
  }

  let { class: className }: Props = $props();
</script>

<nav
  class={clsx(
    "w-full h-24 velvet relative shadow-md shadow-black/30",
    className,
  )}
>
  <div class="absolute strip-3 -translate-y-[0.5px] inset-y-1 inset-x-0"></div>
  <div class="absolute strip-2 translate-y-[0.5px] inset-y-1 inset-x-0"></div>
  <div class="absolute strip-1 inset-y-1 inset-x-0"></div>

  <div class="flex justify-between items-center w-full h-full px-4">
    <img src={LogoNoCircle.src} alt="logo" class="size-14 object-cover" />

    <div class="flex z-3 h-full items-center text-white/80 text-xs font-serif">
      <a
        href="/my-id"
        class="flex flex-col items-center justify-center w-17 h-18 button-active"
      >
        <span>
          <img src={QrIcon.src} alt="" class="size-8 m-1" />
        </span>
        <span class="mt-1"> MyId </span>
      </a>

      <!-- <button
        class="flex flex-col items-center justify-center w-17 h-18"
      >
        <img src={NavIcon.src} alt="" class="size-8 m-1" />
        <span class="mt-1"> นำทาง </span>
      </button> -->
    </div>
  </div>
</nav>

<style>
  .button-active {
    border-radius: 9.549px;
    border: 0.796px solid rgba(89, 2, 2, 0.61);
    background: rgba(1, 1, 1, 0.14);
    box-shadow:
      0 0.796px 0 0 rgba(255, 255, 255, 0.24),
      0 3.183px 8.754px 1.592px rgba(0, 0, 0, 0.46) inset;
  }

  .velvet {
    background: linear-gradient(
      180deg,
      #ff3c3c 0%,
      #920909 4.03%,
      #730202 35.33%,
      #6a0000 50%,
      #730202 66.67%,
      #920909 96.22%,
      #ff3c3c 100%
    );
  }

  .strip-1 {
    border: 2px dashed #ff8888;
    border-left: none;
    border-right: none;
  }

  .strip-2 {
    border: 2px dashed #bf6666;
    border-left: none;
    border-right: none;
  }

  .strip-3 {
    border: 2px dashed #4f0000;
    border-left: none;
    border-right: none;
  }
</style>
