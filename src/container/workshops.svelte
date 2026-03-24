<script>
  import Header from "@src/components/card.svelte";
  const { data } = $props();

  let selectedWing = $state("all");
  let selectedDay = $state("all");

  const wings = ["all", ...new Set(data.flatMap((item) => item.wing))];
  const days = [
    "all",
    ...new Set(data.flatMap((item) => item.day)).values(),
  ].sort((a, b) => a - b);

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
  <Header className="-translate-y-17 w-80!">
    <span class="text-lg text-center">Workshop Schedule</span>
  </Header>

  <div class="flex gap-2 -translate-y-12 mb-4 w-full px-4">
    <select
      bind:value={selectedDay}
      class="px-3 py-2 rounded-full bg-(--color-5) text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-(--border-1)"
    >
      {#each days as day}
        <option class="text-(--text-white)" value={day}>
          {day === "all" ? "All Days" : `Day ${day}`}
        </option>
      {/each}
    </select>
    <select
      bind:value={selectedWing}
      class="px-3 py-2 grow w-full rounded-full bg-(--color-5) text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-(--border-1)"
    >
      {#each wings as wing}
        <option class="text-(--text-white)" value={wing}>
          {wing === "all"
            ? "All Wings"
            : wing.charAt(0).toUpperCase() + wing.slice(1)}
        </option>
      {/each}
    </select>
  </div>

  <div class="flex flex-wrap justify-center gap-4 -translate-y-8">
    {#each filtered as item (item.img)}
      <div>
        <img class="w-full" src={item.img} alt={item.img} />
      </div>
    {/each}
  </div>
</div>
