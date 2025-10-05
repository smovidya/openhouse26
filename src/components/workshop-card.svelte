<script lang="ts">
  import type { Workshop } from "@src/data/workshops";
  import clsx from "clsx";
  interface Props {
    class?: any;
    workshop: Workshop;
    variant?: "red" | "yellow";
  }

  let { class: className, workshop, variant = "yellow" }: Props = $props();
</script>

<div class={clsx("border border-white/50 p-4 shadow-lg shadow-black/20", variant, className)}>
  <div class="flex gap-3">
    <div>
      <img src={workshop.image} alt="" class="size-28 bg-neutral-400" />
    </div>
    <div>
      <h2>{workshop.title}</h2>
      <p class="text-yellow-700 text-sm">{workshop.hostDepartmentAbbr}</p>
      <div class="text-sm">
        <!-- TODO: format time -->
        {workshop.slots.map((it) => it.start)}
      </div>
    </div>
  </div>

  <div class="flex flex-col items-end mt-3 gap-3">
    <p class="line-clamp-3 text-sm">
      {workshop.description}
    </p>
    <a
      href=""
      class="block shadow-inner shadow-black/20 border border-amber-100 rounded-md text-nowrap px-4 py-1.5 text-white text-shadow-md bg-black/25"
    >
      ดูเพิ่มเติม
    </a>
  </div>
</div>

<style>
  .red {
  }

  .yellow {
    background: linear-gradient(180deg, #ffce7e 52.88%, #ec9609 100%);
  }
</style>
