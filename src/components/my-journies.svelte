<script lang="ts">
  import { actions } from "astro:actions";
  import { resource } from "runed";
  import { alert } from "./common/drawer-alert-dialog.svelte";
  import { Rewards, rewardsInfo } from "@src/data/rewards";
  import CheckmarkFilled from "carbon-icons-svelte/lib/CheckmarkFilled.svelte";
  import RadioButton from "carbon-icons-svelte/lib/RadioButton.svelte";
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

<ResourceWrapper resourceLoader={participantResource}>
  {#snippet children(data)}
    {@const rewards = new Rewards(participantId, data.checkins)}
    {#if !!data}
      <ul
        class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical not-prose"
      >
        <li class="not-prose">
          <div class="timeline-middle">
            {#if rewards.getCurrentLevel() > -1}
              <CheckmarkFilled size={20} />
            {:else}
              <RadioButton size={20} />
            {/if}
          </div>
          <div class="timeline-end mb-10 flex flex-row">
            <div>
              <span class="font-mono italic">Tier 0</span>
              <h3 class="text-2xl font-black">เช็คอินที่จุดลงทะเบียนหน้างาน</h3>
              <p class="text-sm">รับของที่ระลึกทันทีเมื่อเข้างาน!</p>
              {#if rewards.getCurrentLevel() > -1}
                <span class="mt-5 badge">คุณได้รับรางวัลนี้แล้ว </span>
              {/if}
            </div>
          </div>
          <hr />
        </li>
        <li class="not-prose">
          <div class="timeline-middle">
            {#if rewards.getCurrentLevel() > 0}
              <CheckmarkFilled size={20} />
            {:else}
              <RadioButton size={20} />
            {/if}
          </div>
          <div class="timeline-end mb-10 flex flex-row">
            <div>
              <span class="font-mono italic">Tier 3</span>
              <h3 class="text-2xl font-black">เสือฮอตเนิร์ด</h3>
              <p class="text-sm">รับกระดาษโน้ต และปากกามูจิเมื่อครบเงื่อนไข</p>
            </div>
          </div>
          <hr />
        </li>
        <li class="not-prose">
          <div class="timeline-middle">
            {#if rewards.getCurrentLevel() > 1}
              <CheckmarkFilled size={20} />
            {:else}
              <RadioButton size={20} />
            {/if}
          </div>
          <div class="timeline-end mb-10 flex flex-row">
            <div>
              <span class="font-mono italic">Tier 2</span>
              <h3 class="text-2xl font-black">เสือผจญภัย</h3>
              <p class="text-sm">
                กระบอกน้ำและหมวกสุดเอ็กคลูสีฟสำหรับ 50
                คนแรกที่ตรงเงื่อนไขเท่านั้น!!!!
              </p>
            </div>
          </div>
          <hr />
        </li>
        <li class="not-prose">
          <div class="timeline-middle">
            {#if rewards.getCurrentLevel() > 2}
              <CheckmarkFilled size={20} />
            {:else}
              <RadioButton size={20} />
            {/if}
          </div>
          <div class="timeline-end mb-10 flex flex-row">
            <div>
              <span class="font-mono italic">Tier 3</span>
              <h3 class="text-2xl font-black">เสือซีเคร็ท</h3>
              <p class="text-sm">
                กล่องจุ่มลับสุดคิวท์เฉพาะ 15 คนแรกของแต่ละวัน
                ไม่เอาไม่ได้แล้วมั้ยยยย
              </p>
            </div>
          </div>
        </li>
      </ul>
    {/if}
  {/snippet}
</ResourceWrapper>
