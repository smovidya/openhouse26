<script lang="ts">
  import { onMount } from "svelte";

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
    seconds: diffInSecond % 60,
    minutes: (diffInSecond / 60) % 60,
    hours: (diffInSecond / 3600) % 60,
    days: (diffInSecond / (3600 * 24)) % 60,
  });

  onMount(() => {
    const id = setInterval(() => {
      now = Date.now();
    }, 100);

    return () => clearInterval(id);
  });
</script>

{JSON.stringify(diff)}
