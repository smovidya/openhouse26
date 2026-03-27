<script lang="ts">
  import FieldWrapper from "./FieldWrapper.svelte";

  interface Option {
    label: string;
    value: string;
  }

  interface Props {
    label: string;
    options: Option[];
    value: string;
    required?: boolean;
    error?: string;
    placeholder?: string;
  }

  let {
    label,
    options,
    value = $bindable(""),
    required = false,
    error = "",
    placeholder = "เลือกคำตอบ",
  }: Props = $props();
</script>

<FieldWrapper {label} {required} {error}>
  <select
    bind:value
    class="select shadow-lg rounded-xl bg-white select-bordered border-token-6 w-full text-base {error
      ? 'select-error'
      : ''}"
  >
    <option value="" disabled selected>{placeholder}</option>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</FieldWrapper>
