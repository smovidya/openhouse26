<script lang="ts">
  import { cn } from "@src/components/utils";
  import { BrowserMultiFormatReader } from "@zxing/library";
  import Renew from "carbon-icons-svelte/lib/Renew.svelte";
  import { onMount, untrack, type Snippet } from "svelte";
  import { Spring } from "svelte/motion";
  import { IsDocumentVisible, ScrollState } from "runed";
  import Console from "@src/components/dev/console.svelte";
  import { getUsableMediaDevices } from "@src/utils/camera";
  import DrawerAlertDialog from "@src/components/common/drawer-alert-dialog.svelte";
  import { Toaster } from "svelte-sonner";

  const isTabActive = new IsDocumentVisible();
  const scroll = new ScrollState({
    element: () => window,
  });
  const isAtTop = $derived(scroll.y <= 120);

  let consoleComponent: Console | undefined;
  let videoElement: HTMLVideoElement;
  let canvasElement: HTMLCanvasElement;

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

  const doEnable = $derived(enable && isAtTop && isTabActive.current);

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
    const sorted = videoInputDevices.toSorted((a, b) =>
      a.label.localeCompare(b.label),
    );

    const usables = getUsableMediaDevices(sorted);

    const index = usables.findIndex((it) => it.deviceId === before);

    // if (index === -1) {
    //   return;
    // }

    const device = usables.at((index + 1) % usables.length)!;
    activeInputDeviceId = device.deviceId;
    consoleComponent?.log(device);
    startDecode(activeInputDeviceId);
  }

  function startDecode(deviceId: string) {
    if (!doEnable) {
      return;
    }
    videoElement.pause();
    reader.decodeFromVideoDevice(
      deviceId,
      untrack(() => videoElement),
      (result) => {
        if (result) {
          consoleComponent?.log(result);
          if (doEnable) {
            onResult?.(result.getText());
          }
        }
      },
    );
  }

  function blurCamera() {
    const context = canvasElement.getContext("2d")!;

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

  onMount(() => {
    switchDevice();
  });

  $effect(() => {
    consoleComponent?.log({ doEnable });
    if (doEnable) {
      untrack(() => {
        if (activeInputDeviceId) {
          startDecode(activeInputDeviceId);
        }
      });
    } else {
      untrack(() => blurCamera());
    }

    // return () => reader.stopContinuousDecode();
    // return () => videoElement.pause();
  });

  const videoBlur = new Spring(0);

  $effect.pre(() => {
    if (!fancyDisabledAnimation) {
      videoBlur.set(0);
      return;
    }

    if (doEnable) {
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
    class="object-cover w-full aspect-[9/16] sm:aspect-[3/4] p-0! m-0! bg-neutral-700"
    style="filter: blur({videoBlur.current}px);"
  >
  </video>
  <canvas
    bind:this={canvasElement}
    class={cn(
      "absolute inset-0 w-full object-cover aspect-[9/16] sm:aspect-[3/4] bg-transparent",
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

<!-- <Console bind:this={consoleComponent} /> -->

<!-- Temporary fix: astro is stupid, if i place this inside a layout some time its instance will be lost -->
<DrawerAlertDialog />

<!-- Same here -->
<Toaster />

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
