<script lang="ts" module>
  import { parse, stringify } from "devalue";
  import { PersistedState } from "runed";

  type HistoryEntry = {
    participant: {
      name: string;
      age: number;
      status: string;
    };
    boothId: string;
    createdAt: Date;
  };

  const history = new PersistedState<HistoryEntry[]>(
    "booth-checkin-history",
    [],
    {
      serializer: {
        serialize: stringify,
        deserialize: parse,
      },
    },
  );

  export function addToHistory(entry: Omit<HistoryEntry, "createdAt">) {
    history.current.push({ ...entry, createdAt: new Date() });
  }
</script>

<script lang="ts">
  import { boothCheckpoints } from "@src/data/checkpoints";

  interface Props {
    boothId?: string;
  }

  let {
    boothId = $bindable(boothCheckpoints[0].id),
    // boothData,
  }: Props = $props();
</script>

<h2 class="mt-6 mb-0">ประวัติการเช็คอิน</h2>
<!-- <p class="mt-0">บุคคลที่คุณเคยเช็คอินให้จะปรากฏขึ้นที่นี่</p> -->

<section>
  <!-- <label class="flex flex-col gap-1">
    <span>บูธ/จุดสะสมคะแนน</span>
    <select class="select w-full" bind:value={boothId}>
      {#each boothCheckpoints as booth}
        <option value={booth.id}>{booth.name}</option>
      {/each}
    </select>
  </label> -->
</section>

{#if history.current.length > 0}
  <section class="mt-3 px-4 py-0.5 bg-neutral-100 rounded-lg">
    {#each history.current as h}
      <div
        class="flex py-2 justify-between items-center not-last:border-b border-neutral-300"
      >
        <div class="flex flex-col leading-4">
          <span>{h.participant.name}</span>
          <span class="text-sm opacity-60"
            >{h.participant.age} ปี • {h.participant.status}</span
          >
        </div>
        <span class="line-clamp-1 max-w-[55%]">{boothCheckpoints.find((it) => it.id === h.boothId)!.name}</span>
      </div>
    {/each}
  </section>
{:else}
  <div
    class="flex mt-3 items-center justify-center rounded-xl border-neutral-200 border-2 border-dashed"
  >
    <p class="text-center opacity-60">
      <span class="text-xl">( •̀ ω •́ )</span> <br />
      ยังไม่มีประวัติการเช็คอิน
    </p>
  </div>
{/if}
