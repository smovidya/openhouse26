<script lang="ts" generics="T">
  import type { Snippet } from "svelte";
  import { resource, type ResourceReturn } from "runed";

  interface Props {
    header?: Snippet<[T]>;
    table: Snippet<[T]>;
    footer?: Snippet<[T]>;
    resourceLoader: ResourceReturn<T>;
  }

  let { header, table, footer, resourceLoader }: Props = $props();
</script>

<div class="overflow-x-auto">
  {#if resourceLoader.loading}
    <span class="loading loading-spinner loading-lg"></span>
  {/if}
  {#if resourceLoader.error}
    <div class="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        /></svg
      >
      <span>{resourceLoader.error.message}</span>
    </div>
  {/if}
  {#if !resourceLoader.loading && !resourceLoader.error}
    {#if resourceLoader.current}
      {#if header}
        <div class="flex justify-between">
          {@render header(resourceLoader.current)}
        </div>
      {/if}
      <table class="table">
        {@render table(resourceLoader.current)}
      </table>
      {#if footer}
        <div class="flex justify-end">
          {@render footer(resourceLoader.current)}
        </div>
      {/if}
    {/if}
  {/if}
</div>
