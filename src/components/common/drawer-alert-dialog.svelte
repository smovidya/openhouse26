<script module lang="ts">
  let open = $state(false);
  let title = $state("");
  let description = $state("" as Snippet | string);
  let mode = $state("alert" as "alert" | "confirm");

  let onConfirmed: (() => unknown) | undefined = $state();
  let onCancel: (() => unknown) | undefined = $state();

  export async function alert(options: {
    title: string;
    description: string | Snippet;
  }) {
    title = options.title;
    description = options.description;
    mode = "alert";

    const { promise, resolve } = Promise.withResolvers<void>();
    onConfirmed = () => resolve();
    onCancel = () => resolve();

    return promise;
  }

  export function confirm(options: {
    title: string;
    description: string | Snippet;
  }) {
    title = options.title;
    description = options.description;
    mode = "confirm";

    const { promise, resolve } = Promise.withResolvers<boolean>();
    onConfirmed = () => resolve(true);
    onCancel = () => resolve(false);

    return promise;
  }

  $effect.root(() => {
    $effect(() => {
      if (!open) {
        onCancel?.();
      }
    });
  });
</script>

<script lang="ts">
  import DrawerButton from "@src/components/common/drawer-button.svelte";
  import Drawer from "@src/components/common/drawer.svelte";
  import type { Snippet } from "svelte";
</script>

<Drawer bind:open>
  {#snippet header()}
    <h2 class="text-3xl">{title}</h2>
  {/snippet}
  {#if typeof description === "string"}
    <p class="text-neutral-600">
      {description}
    </p>
  {:else}
    {@render description()}
  {/if}
  {#snippet buttons()}
    {#if mode == "confirm"}
      <DrawerButton variant="neutral" onclick={onCancel}>ยกเลิก</DrawerButton>
    {/if}
    <DrawerButton onclick={onConfirmed}>ตกลง</DrawerButton>
  {/snippet}
</Drawer>
