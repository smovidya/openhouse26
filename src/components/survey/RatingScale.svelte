<script lang="ts">
  import FieldWrapper from "./FieldWrapper.svelte";

  interface Props {
    label: string;
    value: number | null;
    required?: boolean;
    error?: string;
  }

  let {
    label,
    value = $bindable(null),
    required = false,
    error = "",
  }: Props = $props();

  const ratings = [1, 2, 3, 4, 5];
</script>

<FieldWrapper {label} {required} {error}>
  <div class="flex items-center gap-2 mt-2 w-full justify-between sm:justify-start sm:gap-4 flex-wrap">
    {#each ratings as r}
      <button
        type="button"
        class="btn btn-square {value === r ? 'btn-primary' : 'btn-outline border-base-300'} w-14 h-14"
        onclick={() => (value = r)}
      >
        <span class="text-xl font-bold">{r}</span>
      </button>
    {/each}
  </div>
  <div class="flex w-full justify-between sm:w-[325px] text-xs text-base-content/50 mt-2 px-1 font-medium">
    <span>น้อยที่สุด (1)</span>
    <span>มากที่สุด (5)</span>
  </div>
</FieldWrapper>
