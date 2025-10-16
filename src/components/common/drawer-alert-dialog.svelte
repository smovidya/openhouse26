<script module lang="ts">
  let open = $state(false);
  let title = $state("");
  let description = $state("" as Snippet | string);
  let mode = $state("alert" as "alert" | "confirm");
  let disabledConfirm = $state(false);

  let onConfirmed: (() => unknown) | undefined = $state();
  let onCancel: (() => unknown) | undefined = $state();

  export async function alert(options: {
    title: string;
    description: string | Snippet;
  }) {
    disabledConfirm = false;
    title = options.title;
    description = options.description;
    mode = "alert";
    open = true;

    const { promise, resolve } = Promise.withResolvers<void>();
    onConfirmed = () => resolve();
    onCancel = () => resolve();

    await promise;
    open = false;
  }

  export async function confirm(options: {
    title: string;
    description: string | Snippet;
    blockConfirmUntil?: Promise<any>;
  }) {
    title = options.title;
    description = options.description;
    mode = "confirm";
    // disabledConfirm = options.blockConfirmUntil !== undefined;
    open = true;

    const { promise, resolve } = Promise.withResolvers<boolean>();
    onConfirmed = () => resolve(true);
    onCancel = () => resolve(false);

    if (options.blockConfirmUntil) {
      options.blockConfirmUntil
        .then(() => {
          console.log("Then");
          disabledConfirm = false;
        })
        .catch((e) => {
          console.log("error");
          console.error(e);
          onCancel?.();
        });
    }

    console.log("what");
    const result = await promise;
    open = false;

    return result;
  }
</script>

<script lang="ts">
  import DrawerButton from "@src/components/common/drawer-button.svelte";
  import Drawer from "@src/components/common/drawer.svelte";
  import type { Snippet } from "svelte";
</script>

{open}
<Drawer
  bind:open={
    () => open,
    (v) => {
      if (v) {
        console.log("wtf");
      } else {
        onCancel?.();
        open = false;
      }
    }
  }
>
  {#snippet header()}
    <h2 class="text-3xl">{title}</h2>
  {/snippet}
  {#if typeof description === "string"}
    <p class="mx-6 text-neutral-600">
      {description}
    </p>
  {:else}
    <div class="mx-4">
      {@render description()}
    </div>
  {/if}
  {#snippet buttons()}
    {#if mode == "confirm"}
      <DrawerButton variant="neutral" onclick={onCancel}>ยกเลิก</DrawerButton>
    {/if}
    <DrawerButton onclick={onConfirmed} disabled={disabledConfirm}
      >ตกลง</DrawerButton
    >
  {/snippet}
</Drawer>
