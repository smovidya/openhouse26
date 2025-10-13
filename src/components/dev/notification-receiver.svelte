<script lang="ts">
  import CutoutBox from "@src/components/common/cutout-box.svelte";
  import React from "@src/components/react/react.svelte";
  import { onNotify } from "@src/notification/client";
  import { toast, Toaster } from 'sonner';


  interface Props {
    wsUrl: string;
  }

  let { wsUrl }: Props = $props();
  let jwt = $state("isei"); // no jwt yet, use uid instead

  const events = $state([]) as any[];
  let latestEvent = $state() as any;

  $effect(() => {
    const stop = onNotify(wsUrl, jwt, (event) => {
      events.push(event);
      console.log(event);
      toast(JSON.stringify(event));
      latestEvent = event;
    });

    return stop;
  });
</script>

<div class="flex flex-col gap-3 border rounded p-2">
  <h1 class="text-2xl">noti receiver</h1>

  <label>
    <span>jwt (no jwt yet, use uid instead)</span>
    <CutoutBox class="p-0! text-black">
      <input type="text" bind:value={jwt} class="p-2 w-full" />
    </CutoutBox>
  </label>

  <h3>Latest event</h3>
  <CutoutBox class="text-black font-mono">
    <pre>{JSON.stringify(latestEvent, null, 2)}</pre>
  </CutoutBox>

  <h3>all events</h3>
  <CutoutBox class="text-black font-mono">
    <pre>{JSON.stringify(events, null, 2)}</pre>
  </CutoutBox>
</div>


<React component={Toaster} props={{ position: "bottom-center" }} />