<script lang="ts">
  import { cn } from "@src/components/utils";
  import { BrowserMultiFormatReader } from "@zxing/library";
  import Renew from "carbon-icons-svelte/lib/Renew.svelte";
  import { onMount, type Snippet } from "svelte";
  import { Spring } from "svelte/motion";
  import { IsDocumentVisible } from "runed";

  const isTabActive = new IsDocumentVisible();

  let videoElement = $state(null) as HTMLVideoElement | null;
  let canvasElement = $state(null) as HTMLCanvasElement | null;
  const context = $derived(canvasElement?.getContext("2d"));

  interface Props {
    bottomUi?: Snippet;
    notSoBottomUi?: Snippet;
    onResult?: (value: string) => unknown;
    header?: Snippet;
    enable?: boolean;
    fancyDisabledAnimation?: boolean;
  }

  let {
    bottomUi,
    notSoBottomUi,
    onResult,
    header,
    enable = $bindable(true),
    fancyDisabledAnimation = true,
  }: Props = $props();

  // const reader = new BrowserAztecCodeReader();
  const reader = new BrowserMultiFormatReader();

  let activeInputDeviceId: MediaDeviceInfo["deviceId"] | null = $state(null);

  function computeCoverTransform(
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number,
  ) {
    if (!sourceWidth || !sourceHeight) {
      return null;
    }

    const scale = Math.max(
      targetWidth / sourceWidth,
      targetHeight / sourceHeight,
    );

    return {
      sx: scale,
      sy: scale,
      dx: (targetWidth - sourceWidth * scale) / 2,
      dy: (targetHeight - sourceHeight * scale) / 2,
    } as const;
  }

  async function switchDevice() {
    const videoInputDevices = await reader.listVideoInputDevices();
    const before = activeInputDeviceId;

    const index = videoInputDevices.findIndex(
      (it) => it.deviceId === activeInputDeviceId,
    );

    // if (index === -1) {
    //   return;
    // }

    const device = videoInputDevices.at(
      (index + 1) % videoInputDevices.length,
    )!;
    activeInputDeviceId = device.deviceId;
    console.log({ active: activeInputDeviceId, before });
  }

  onMount(async () => {
    switchDevice();
  });

  $effect(() => {
    if (!videoElement || !context) {
      return;
    }
    
    const id = activeInputDeviceId;
    onResult;
    if (enable && isTabActive.current) {
      // these are to track

      const timeoutId = setTimeout(() => {
        reader.decodeFromVideoDevice(id, videoElement, (result) => {
          if (result) {
            console.log(result);
            if (enable && isTabActive.current) {
              onResult?.(result.getText());
            }
          }
        });
      }, 0);

      return () => clearTimeout(timeoutId);
    } else {
      const { width, height } = videoElement.getBoundingClientRect();
      context.canvas.width = width;
      context.canvas.height = height;

      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      // we need diffrent cropping based on aspect ratio
      const transform = computeCoverTransform(
        videoWidth,
        videoHeight,
        width,
        height,
      );

      if (!transform) {
        return;
      }

      const { sx, sy, dx, dy } = transform;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, width, height);
      context.setTransform(sx, 0, 0, sy, dx, dy);
      context.drawImage(videoElement, 0, 0);
      context.setTransform(1, 0, 0, 1, 0, 0);
      // reader.decodeOnce(videoElement)
      videoElement.pause();
      reader.reset();
    }

    // return () => reader.stopContinuousDecode();
    // return () => videoElement.pause();
  });

  const videoBlur = new Spring(0);
  $effect(() => {
    if (!fancyDisabledAnimation) {
      videoBlur.set(0);
      return;
    }

    if (enable && isTabActive.current) {
      const id = setTimeout(() => videoBlur.set(0), 400);
      return () => clearTimeout(id);
    } else {
      videoBlur.set(24);
    }
  });
</script>

<div
  class="relative w-full rounded-2xl min-h-12 font-serif select-none overflow-clip text-white mt-6 shadow-lg shadow-black/20"
>
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={videoElement}
    class="object-cover w-full aspect-[3/4] p-0! m-0! bg-neutral-700"
    style="filter: blur({videoBlur.current}px);"
  >
  </video>
  <canvas
    bind:this={canvasElement}
    class={cn(
      "absolute inset-0 w-full object-cover aspect-[3/4] bg-transparent",
    )}
    style="filter: blur({videoBlur.current}px); opacity: {videoBlur.current /
      24};"
  ></canvas>
  <div class="dim-overlay absolute inset-0 rounded-2xl"></div>
  <div class="absolute top-0 inset-x-0">
    {@render header?.()}
  </div>
  <div
    class="absolute inset-x-9 top-48 aspect-square rounded-3xl border-4 border-yellow-500"
  ></div>
  <section
    class="absolute bottom-4 right-4 left-4 flex flex-col items-center gap-3"
  >
    <div>
      {@render notSoBottomUi?.()}
    </div>
    <div class="flex gap-3 w-full">
      <div class="flex-1 h-full w-full">
        {@render bottomUi?.()}
      </div>
      <button
        class="aspect-square rounded-full p-3 bg-black/40 active:bg-neutral-800/30 border border-white/15 backdrop-blur-2xl transition-colors"
        onclick={switchDevice}
      >
        <Renew class="size-6" />
      </button>
    </div>
  </section>
</div>

<style>
  .dim-overlay {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.65) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0.68) 100%
    );
  }
</style>
