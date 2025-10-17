<script lang="ts">
  import { resource } from "runed";
  import ResourceWrapper from "./common/resource-wrapper.svelte";
  import { _ } from "../../dist/_worker.js/chunks/schemas_C0Er5qCK.mjs";
  import { actions } from "astro:actions";
  import { alert } from "./common/drawer-alert-dialog.svelte";
  import { Rewards } from "@src/data/rewards";

  interface Props {
    participantId: string;
    class?: string;
  }
  const { participantId, class: className }: Props = $props();

  const participantResource = resource([() => participantId], async ([id]) => {
    const { error, data } = await actions.getMyParticipant();

    if (error) {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
      });
    }

    return data;
  });
</script>

<!-- WIP -->

<ResourceWrapper resourceLoader={participantResource}>
  {#snippet children(data)}
    {@const rewardsProgress = new Rewards(participantId, data.checkins)}
    <div>
      {JSON.stringify(data)}
    </div>
  {/snippet}
</ResourceWrapper>
