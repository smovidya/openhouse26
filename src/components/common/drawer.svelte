<script lang="ts">
  import Close from "carbon-icons-svelte/lib/Close.svelte";
  import type { Snippet } from "svelte";
  import { Drawer } from "vaul-svelte";

  interface Props {
    open?: boolean;
    buttons?: Snippet;
    header?: Snippet;
    children?: Snippet;
  }

  let { open = $bindable(false), buttons, children, header }: Props = $props();

  function close() {
    open = false;
  }
</script>

<Drawer.Root {open} onOpenChange={(it) => (open = it)}>
  <Drawer.Overlay>
    <div class="fixed inset-0 bg-black/50"></div>
  </Drawer.Overlay>
  <Drawer.Portal>
    <Drawer.Content class="fixed safe-area bottom-0 left-0 right-0">
      <div
        class="m-2 mb-6 relative flex flex-col overflow-clip rounded-4xl bg-white border-neutral-300 shadow-2xl p-0 text-black"
      >
        <button
          class="absolute right-4 top-4 p-1 rounded-full bg-neutral-200 active:bg-neutral-300"
          onclick={close}
        >
          <Close size={32} />
        </button>

        <header class="m-6 mb-3 max-w-[80%]">
          {@render header?.()}
        </header>
        {@render children?.()}
        <div class="flex flex-col mt-6 m-4 gap-3">
          {@render buttons?.()}
        </div>
      </div>
    </Drawer.Content>
    <Drawer.Overlay />
  </Drawer.Portal>
</Drawer.Root>
