<script lang="ts">
  import { toCanvas } from "@bwip-js/browser";
  import clsx from "clsx";
  interface Props {
    class?: any;
    content: string;
  }

  let { class: className, content }: Props = $props();

  // let svg = $derived(
  //   toSVG({
  //     text: content,
  //     bcid: "azteccode",
  //     // bcid: "azteccodecompact",
  //   }),
  // );

  let canvas = $state() as HTMLCanvasElement | undefined;

  $effect(() => {
    if (!canvas) {
      return;
    }

    toCanvas(canvas, {
      text: content,
      bcid: "qrcode",
      scale: 4,
    });
  });
</script>

<div class={clsx("bg-white", className)}>
  <canvas class="size-full" bind:this={canvas}>
    <!-- {@html svg} -->
  </canvas>
</div>
