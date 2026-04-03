<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { cn } from "../utils";

  interface Props {
    name: string;
    disabled?: boolean;
    placeholder?: string;
    value?: string;
    class?: string;
  }

  let {
    value = $bindable(),
    disabled,
    placeholder,
    name,
    class: className,
    ...restProps
  }: Props & HTMLInputAttributes = $props();
</script>

<input
  id={name}
  type="text"
  bind:value
  {placeholder}
  class={cn(
    "border-token-6 text-lg border invalid:border-2 shadow-md shadow-black/20 text-center invalid:bg-error/25 rounded-2xl p-2",
    className,
  )}
  {disabled}
  {...restProps}
/>
