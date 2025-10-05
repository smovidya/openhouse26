<script lang="ts">
  import { workshops } from "@src/data/workshops";
  import clsx from "clsx";
  import WorkshopCard from "./workshop-card.svelte";

  interface Props {
    class?: any;
  }

  let { class: className }: Props = $props();
</script>

<section class={clsx("grid sm:grid-cols-2", className)}>
  <WorkshopCard workshop={workshops[0]} />
</section>
