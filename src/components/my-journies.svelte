<script lang="ts">
  import { Rewards } from "@src/data/rewards";
  import { actions } from "astro:actions";
  import { resource } from "runed";
  import { alert } from "./common/drawer-alert-dialog.svelte";
  import ResourceWrapper from "./common/resource-wrapper.svelte";

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
    <!-- {@const rewardsProgress = new Rewards(participantId, data.checkins)} -->
    <div>
      {JSON.stringify(data)}
    </div>
  {/snippet}
</ResourceWrapper>
