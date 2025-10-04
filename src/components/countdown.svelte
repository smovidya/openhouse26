<script lang="ts">
  import { onMount } from "svelte";
  import CutoutBox from "./common/cutout-box.svelte";
  import clsx from "clsx";

  interface Props {
    class?: any;
    /**
     * unix epoch
     */
    to: number;
  }

  let { class: className, to }: Props = $props();

  let now = $state(Date.now());

  let targetInSecond = $derived(to / 1000);
  let nowInSecond = $derived(now / 1000);
  let diffInSecond = $derived(targetInSecond - nowInSecond);

  let diff = $derived({
    seconds: Math.floor(diffInSecond % 60),
    minutes: Math.floor(diffInSecond / 60) % 60,
    hours: Math.floor(diffInSecond / 3600) % 24,
    days: Math.floor(diffInSecond / (3600 * 24)) % 60,
  });

  onMount(() => {
    const id = setInterval(() => {
      now = Date.now();
    }, 100);

    return () => clearInterval(id);
  });
</script>

<section class={clsx("flex gap-6 justify-center", className)}>
  <div class="flex flex-col gap-2 flex-1 max-w-16">
    <CutoutBox class="rounded-lg! h-15 p-0! flex items-center justify-center">
      <span class="text-black text-3xl font-bold font-serif">
        {diff.days}
      </span>
    </CutoutBox>
    <span class="text-sm"> วัน </span>
  </div>

  <div class="flex flex-col gap-2 flex-1 max-w-16">
    <CutoutBox class="rounded-lg! h-15 p-0! flex items-center justify-center">
      <span class="text-black text-3xl font-bold font-serif">
        {diff.hours}
      </span>
    </CutoutBox>
    <span class="text-sm"> ชั่วโมง </span>
  </div>

  <div class="flex flex-col gap-2 flex-1 max-w-16">
    <CutoutBox class="rounded-lg! h-15 p-0! flex items-center justify-center">
      <span class="text-black text-3xl font-bold font-serif">
        {diff.minutes}
      </span>
    </CutoutBox>
    <span class="text-sm"> นาที </span>
  </div>

  <div class="flex flex-col gap-2 flex-1 max-w-16">
    <CutoutBox class="rounded-lg! h-15 p-0! flex items-center justify-center">
      <span class="text-black text-3xl font-bold font-serif">
        {diff.seconds}
      </span>
    </CutoutBox>
    <span class="text-sm"> วินาที </span>
  </div>
</section>
