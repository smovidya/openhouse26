<script lang="ts">
  import { cn } from "@src/components/utils";

  export interface NavigationRailItem {
    label: string;
    value: string;
    disabled?: boolean;
  }

  interface Props {
    /**
     * Items to render inside the rail. Provide at least one item.
     */
    items: NavigationRailItem[];
    /**
     * Currently selected value. Bind to react to changes.
     */
    selected?: string | null;
    /**
     * Optional aria-label for the underlying nav element.
     */
    ariaLabel?: string;
  }

  let {
    items,
    selected = $bindable<string | null>(null),
    ariaLabel,
  }: Props = $props();

  $effect(() => {
    if (!items?.length) {
      return;
    }

    const hasMatch = items.some((item) => item.value === selected);

    if (!hasMatch) {
      selected = items[0]?.value ?? null;
    }
  });

  function handleSelect(item: NavigationRailItem) {
    if (item.disabled || item.value === selected) {
      return;
    }

    selected = item.value;
  }

  const baseButtonClass =
    "relative flex-1 min-w-0 whitespace-nowrap rounded-full px-5 py-2 text-base font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:cursor-not-allowed disabled:opacity-40";
</script>

{#if items?.length}
  <nav
    class="flex w-full h-10 items-center space-x-1 rounded-full border border-white/10 bg-black/40 p-0.5 backdrop-blur-2xl"
    aria-label={ariaLabel}
  >
    {#each items as item (item.value)}
      <button
        type="button"
        class={cn(
          baseButtonClass,
          item.value === selected
            ? "-mx-1 h-10 bg-white border border-neutral-800/20 text-neutral-900 shadow"
            : "text-white/60 hover:bg-white/10 active:bg-white/15 border-transparent",
          item.disabled && "pointer-events-none",
        )}
        aria-pressed={item.value === selected}
        aria-current={item.value === selected ? "page" : undefined}
        disabled={item.disabled}
        onclick={() => handleSelect(item)}
      >
        {item.label}
      </button>
    {/each}
  </nav>
{:else}
  <div
    class="rounded-full border border-dashed border-white/15 px-6 py-3 text-sm text-white/60"
  >
    ไม่มีรายการสำหรับนำทาง
  </div>
{/if}
