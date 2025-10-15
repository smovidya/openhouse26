<script lang="ts">
  import React from "@src/components/react/react.svelte";
  import { onNotify, type UserEvent } from "@src/notification/client";
  import { toast, Toaster } from "sonner";

  interface Props {
    wsUrl: string;
    token: string;
  }

  let { wsUrl, token }: Props = $props();

  const events = $state([]) as any[];
  let latestEvent = $state() as any;

  $effect(() => onNotify(wsUrl, token, onEvent));

  function onEvent(event: UserEvent) {
    events.push(event);
    latestEvent = event;
    
    // todo: map event
    toast(JSON.stringify(event));
  }
</script>

<React component={Toaster} props={{ position: "bottom-center" }} />
