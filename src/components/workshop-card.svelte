<script lang="ts">
  import type { Workshop } from "@src/data/workshops";
  import TimeFilled from "carbon-icons-svelte/lib/TimeFilled.svelte";

  import clsx from "clsx";
  interface Props {
    class?: any;
    workshop: Workshop;
    /**
     * Only to be used in my workshop section
     */
    selectedTimeSlotText?: string;
    variant?: "red" | "yellow";
  }

  let {
    class: className,
    workshop,
    variant = "yellow",
    selectedTimeSlotText,
  }: Props = $props();

  const df = new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
</script>

<div
  class={clsx(
    "border border-white/50 p-4 shadow-lg shadow-black/20",
    variant,
    variant === "yellow" && "text-black",
    variant === "red" && "text-white",
    className,
  )}
>
  <div class="flex gap-3">
    <img
      src={workshop.image}
      alt=""
      class="size-28 aspect-square bg-neutral-200 rounded overflow-clip"
    />
    <div>
      <h2 class="text-lg">{workshop.title}</h2>
      <p
        class={clsx(
          "text-sm",
          variant === "yellow" && "text-yellow-700",
          variant === "red" && "text-red-200",
        )}
      >
        {workshop.hostDepartmentAbbr}
      </p>
      <div class="text-sm mt-1 flex gap-1 items-center">
        <TimeFilled />
        <span>
          {df.format(workshop.slots[0].date)}
          {selectedTimeSlotText}
        </span>
      </div>
    </div>
  </div>

  <div class="flex flex-col items-end mt-3 gap-3">
    <p class="line-clamp-3 text-sm">
      {workshop.description}
    </p>
    <a
      href="/workshops/{workshop.id}"
      class={clsx(
        "block shadow-inner shadow-black/20 border rounded-md text-nowrap px-5 py-1.5 text-white text-shadow-md bg-black/25",
        variant === "yellow" && "border-amber-200/50",
        variant === "red" && "border-red-200/50",
      )}
    >
      ดูเพิ่มเติม
    </a>
  </div>
</div>

<style>
  .red {
    background: linear-gradient(180deg, #f15c5c 52.88%, #7c0101 100%);
  }

  .yellow {
    background: linear-gradient(180deg, #ffce7e 52.88%, #ec9609 100%);
  }
</style>
