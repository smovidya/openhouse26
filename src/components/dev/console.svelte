<script lang="ts">
  import { untrack } from "svelte";

  let logs = $state("");

  export function log(data: any) {
    untrack(() => {
      logs += "\n" + JSON.stringify(data, null, 2);
    });
  }
</script>

<pre>{logs}</pre>
