<script lang="ts">
  import { workshops } from "@src/data/workshops";
  import { toLocalDateString } from "@src/utils/time";
  import CheckmarkFilled from "carbon-icons-svelte/lib/CheckmarkFilled.svelte";

  import clsx from "clsx";

  interface Props {
    class?: any;
    workshopId: string;
    initialSelected?: number;
    // slots: TimeSlot[]; // cant be serialized
  }

  let { class: className, workshopId, initialSelected }: Props = $props();

  const workshop = workshops.find((it) => it.id === workshopId);
  if (!workshop) {
    throw new Error("nah");
  }
</script>

<div class="mt-5">
  <h3 class="text-white text-xl">
    {toLocalDateString(workshop.slots[0].date)}
  </h3>
  <div class="grid sm:grid-cols-2 gap-2 mt-2">
    {#each workshop.slots as { start, end }, index}
      <button
        class={clsx(
          "rounded-lg border py-1.5 px-3 flex items-center justify-between transition-all cursor-pointer",
          index % 2 === 0
            ? "text-blue-200 border-blue-200/30 shadow shadow-black/20 hover:bg-white/5"
            : "text-blue-50 shadow-inner shadow-black/50 bg-blue-950/40 hover:bg-blue-950/60 border-white/30",
        )}
      >
        <span class="text-sm">
          {start.toString()} - {end.toString()} น.
        </span>
        <span>
          {#if index % 2 === 1}
            <CheckmarkFilled class="size-4" />
          {/if}
        </span>
      </button>
    {/each}
  </div>
</div>
