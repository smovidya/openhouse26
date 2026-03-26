<script lang="ts">
  import Header from "@src/components/card.svelte";
  import { cardData as data, wings } from "@src/data/card";
  import { fade, fly, slide } from "svelte/transition";

  let selectedWing = $state("all");
  let selectedDay = $state("all");

  const days = ["all", 28, 29];

  const filtered = $derived(
    data.filter((item) => {
      const wingMatch =
        selectedWing === "all" || item.wing.includes(selectedWing);
      const dayMatch =
        selectedDay === "all" || item.day.includes(Number(selectedDay));
      return wingMatch && dayMatch;
    }),
  );
</script>

<div class="flex flex-col items-center">
  <Header class="-translate-y-17 w-80!">
    <span class="text-xl font-bold text-center">Workshop Schedule</span>
  </Header>

  <div class="flex gap-2 -translate-y-12 mb-4 w-full px-4">
    <select
      bind:value={selectedDay}
      class="select px-3 py-2 rounded-full bg-token-5 text-sm text-shadow-2xs shadow-sm focus:outline-none focus:ring-2 focus:ring-border-1"
    >
      {#each days as day}
        <option class="text-white" value={day}>
          {day === "all" ? "Both Days" : `Day ${day}`}
        </option>
      {/each}
    </select>
    <select
      bind:value={selectedWing}
      class="select px-3 py-2 grow w-full rounded-full bg-token-5 text-shadow-2xs text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-border-1"
    >
      <option class="text-white" value="all"> All Wings </option>
      {#each wings as wing}
        <option class="text-white" value={wing.id}>
          {wing.name}
        </option>
      {/each}
    </select>
  </div>

  <div class="flex flex-wrap justify-center gap-4">
    {#each filtered as item (item.img)}
      <div>
        <img class="w-full" src={item.img} alt={item.img} />
      </div>
    {/each}
  </div>
</div>
