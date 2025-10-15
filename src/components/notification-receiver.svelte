<script lang="ts">
  import { onNotify, type UserEvent } from "@src/notification/client";
  import { UserEventMaptoast } from "svelte-sonner";

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

    // todo: map eventUserEventMap
    toast(JSON.stringify(event));
  }
</script>

<Toaster />
