<script lang="ts">
  import FieldWrapper from "./FieldWrapper.svelte";

  interface Option {
    label: string;
    value: string;
  }

  interface Props {
    label: string;
    options: Option[];
    value: string[];
    required?: boolean;
    error?: string;
  }

  let {
    label,
    options,
    value = $bindable([]),
    required = false,
    error = "",
  }: Props = $props();

  function toggleOption(v: string) {
    if (value.includes(v)) {
      value = value.filter((item) => item !== v);
    } else {
      value = [...value, v];
    }
  }
</script>

<FieldWrapper {label} {required} {error}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
    {#each options as option (option.value)}
      <label
        class="cursor-pointer justify-start gap-4 p-2 rounded-lg hover:bg-primary/10 transition-colors {value.includes(
          option.value,
        )
          ? 'bg-primary/20'
          : ''}"
      >
        <input
          type="checkbox"
          class="checkbox checkbox-primary mr-2"
          value={option.value}
          checked={value.includes(option.value)}
          onchange={() => toggleOption(option.value)}
        />
        <span class="label-text text-base leading-snug">{option.label}</span>
      </label>
    {/each}
  </div>
</FieldWrapper>
