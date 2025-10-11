<script lang="ts">
  interface Props {
    searchQuery: string;
  }

  let { searchQuery = $bindable("") }: Props = $props();
</script>

<input type="text" bind:value={searchQuery} />
