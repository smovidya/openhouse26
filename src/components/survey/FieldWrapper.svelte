<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    label: string;
    required?: boolean;
    error?: string;
    children: Snippet;
  }

  let { label, required = false, error = "", children }: Props = $props();
</script>

<div class="form-control w-full my-4">
  <div class="label text-wrap justify-start gap-1 pb-1">
    <span class="label-text font-bold text-base md:text-lg">{label}</span>
    {#if required}
      <span class="text-error font-bold">*</span>
    {/if}
  </div>

  <div class="mt-1">
    {@render children()}
  </div>

  {#if error}
    <div class="label pb-0 pt-1">
      <span class="label-text-alt text-error font-medium">{error}</span>
    </div>
  {/if}
</div>
