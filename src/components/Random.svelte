<script lang="ts">
  import { actions } from "astro:actions";

  let { name }: { name: string } = $props();

  async function getRandomValue() {
    console.log("Fetching random value...");
    const { data, error } = await actions.random({
      seed: 1,
    });
    alert(error ? `Error: ${error.message}` : data.number);
  }
</script>

<button onclick={() => getRandomValue()}>Get Random Value</button>

<style>
  button {
    padding: 0.5em 1em;
    font-size: 1rem;
    cursor: pointer;
  }
</style>
