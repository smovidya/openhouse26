<script lang="ts">
  let logs = $state("");

  export function log(data: any) {
    logs += "\n" + JSON.stringify(data, null, 2);
  }
</script>

<pre>{logs}</pre>
