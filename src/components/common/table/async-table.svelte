<script lang="ts" generics="T">
  import { blur } from "svelte/transition";
  import type { Snippet } from "svelte";

  interface Props {
    header?: Snippet<[T]>;
    table: Snippet<[T]>;
    footer?: Snippet<[T]>;
    loaderFn: () => Promise<T>;
  }
  let { header, table, footer, loaderFn }: Props = $props();
</script>

<div class="overflow-x-auto">
  {#await loaderFn()}
    <span class="loading loading-spinner loading-lg"></span>
  {:then loadedData}
    {#if loadedData}
      {#if header}
        <div class="flex justify-between">
          {@render header(loadedData)}
        </div>
      {/if}
      <table class="table" in:blur>
        {@render table(loadedData)}
      </table>
      {#if footer}
        <div class="flex justify-end">
          {@render footer(loadedData)}
        </div>
      {/if}
    {/if}
  {:catch error}
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
      <span>{error.message}</span>
    </div>
  {/await}
</div>
