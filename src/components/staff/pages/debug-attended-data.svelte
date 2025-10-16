<script lang="ts">
  import { type Actions } from "astro:actions";
  import { type ResourceReturn } from "runed";

  interface Props {
    participantData: ResourceReturn<
      Awaited<ReturnType<Actions["getParticipantByIdOrQrCodeId"]>>["data"]
    >;
  }

  const { participantData }: Props = $props();
</script>

<div>
  <table class="table table-md">
    <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      {#if participantData.current}
        {#each Object.entries(participantData.current.participant) as [key, value]}
          <tr>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<pre>{JSON.stringify(participantData.current, null, 2)}</pre>
