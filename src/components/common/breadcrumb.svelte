<script lang="ts">
  interface Props {
    items: { label: string; href?: string }[];
  }
  const { items } = $props();
</script>

<div class="breadcrumbs text-sm m-0">
  <ul class="p-0">
    {#each items as item (item.label)}
      {#if item.href}
        <li><a href={item.href}>{item.label}</a></li>
      {:else}
        <li>{item.label}</li>
      {/if}
    {/each}
  </ul>
</div>
