<script lang="ts">
  import { BrowserMultiFormatReader } from "@zxing/library";
  import Renew from "carbon-icons-svelte/lib/Renew.svelte";
  import { onMount, tick, type Snippet } from "svelte";

  let videoElement: HTMLVideoElement;

  interface Props {
    bottomUi?: Snippet;
    notSoBottomUi?: Snippet;
    onResult?: (value: string) => unknown;
    header?: Snippet;
    enable?: boolean;
  }

  let {
    bottomUi,
    notSoBottomUi,
    onResult,
    header,
    enable = $bindable(true),
  }: Props = $props();

  // const reader = new BrowserAztecCodeReader();
  const reader = new BrowserMultiFormatReader();

  let videoInputDevices: MediaDeviceInfo[] = $state([]);
  let activeInputDeviceId: MediaDeviceInfo["deviceId"] | null = $state(null);

  function switchDevice() {
    const index = videoInputDevices.findIndex(
      (it) => it.deviceId === activeInputDeviceId,
    );

    if (index === -1) {
      return;
    }

    const device = videoInputDevices.at(
      (index + 1) % videoInputDevices.length,
    )!;
    activeInputDeviceId = device.deviceId;
    // console.log(device, videoInputDevices);
  }

  onMount(async () => {
    videoInputDevices = await reader.listVideoInputDevices();
    activeInputDeviceId = videoInputDevices[0].deviceId;

    videoInputDevices;
  });

  $effect(() => {
    if (!videoElement) {
      return;
    }

    if (enable) {
      setTimeout(() => {
        reader.decodeFromVideoDevice(
          activeInputDeviceId,
          videoElement,
          (result) => {
            if (result) {
              console.log(result);
              if (enable) {
                onResult?.(result.getText());
              }
            }
          },
        );
      }, 100);
    } else {
      reader.stopContinuousDecode();
    }

    // return () => reader.stopContinuousDecode();
    // return () => videoElement.pause();
  });
</script>

<div class="relative w-full min-h-12 font-serif select-none text-white">
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={videoElement}
    class="object-cover aspect-[9/16] bg-neutral-700"
  >
  </video>
  <div class="dim-overlay absolute inset-0"></div>
  <div class="absolute top-0 inset-x-0">
    {@render header?.()}
  </div>
  <div
    class="absolute inset-x-9 top-48 aspect-square rounded-3xl border-4 border-yellow-500"
  ></div>
  <section class="absolute bottom-4 right-4 left-4 flex flex-col gap-3">
    <div>
      {@render notSoBottomUi?.()}
    </div>
    <div class="flex gap-3">
      <div class="flex-1 h-full">
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
