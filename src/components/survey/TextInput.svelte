<script lang="ts">
  import FieldWrapper from "./FieldWrapper.svelte";

  interface Props {
    label: string;
    value: string;
    required?: boolean;
    error?: string;
    placeholder?: string;
  }

  let {
    label,
    value = $bindable(""),
    required = false,
    error = "",
    placeholder = "พิมพ์คำตอบที่นี่...",
  }: Props = $props();
</script>

<FieldWrapper {label} {required} {error}>
  <input
    type="text"
    bind:value
    class="input shadow-lg bg-white border-token-6 rounded-xl input-bordered w-full text-base {error
      ? 'input-error'
      : ''}"
    {placeholder}
  />
</FieldWrapper>
