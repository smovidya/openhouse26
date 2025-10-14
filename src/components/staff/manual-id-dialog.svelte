<script lang="ts">
  import DrawerButton from "@src/components/common/drawer-button.svelte";
  import Drawer from "@src/components/common/drawer.svelte";

  interface Props {
    headerText?: string;
    subText?: string;
    open?: boolean;
    onDone?: (value: string) => unknown;
  }

  let {
    open = $bindable(false),
    headerText,
    subText,
    onDone,
  }: Props = $props();

  let codeInput = $state("");

  $effect(() => {
    if (open) {
      codeInput = "";
    }
  });

  function onConfirmed() {
    onDone?.(codeInput);
  }
</script>

<Drawer bind:open>
  {#snippet header()}
    <h2 class="text-3xl">{headerText}</h2>
    <p class="text-neutral-600">
      {subText}
    </p>
  {/snippet}
  <section class="px-6">
    <label class="flex flex-col gap-1">
      <span>โค้ด</span>
      <input
        type="text"
        class="input"
        placeholder="UI490"
        bind:value={codeInput}
      />
    </label>
  </section>
  {#snippet buttons()}
    <DrawerButton variant="neutral" onclick={() => (open = false)}>
      ยกเลิก
    </DrawerButton>
    <DrawerButton onclick={onConfirmed}>ตกลง</DrawerButton>
  {/snippet}
</Drawer>
