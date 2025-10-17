<script lang="ts">
  import { actions } from "astro:actions";
  import { resource } from "runed";
  import { alert } from "./common/drawer-alert-dialog.svelte";
  import { Rewards, rewardsInfo, tierConditions } from "@src/data/rewards";
  import CheckmarkFilled from "carbon-icons-svelte/lib/CheckmarkFilled.svelte";
  import RadioButton from "carbon-icons-svelte/lib/RadioButton.svelte";
  import ResourceWrapper from "./common/resource-wrapper.svelte";
  import CloseLarge from "carbon-icons-svelte/lib/CloseLarge.svelte";
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import { cn } from "./utils";

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

{#snippet conditionRow(text: string, isMet: boolean)}
  <div
    class={cn(
      "bg-white/10 rounded-md px-2",
      isMet ? "bg-white/95 text-base-100" : "",
    )}
  >
    <span class="flex flex-row items-center gap-2">
      {text}
      {#if isMet}<Checkmark size={20} class="shrink-0" />{:else}<CloseLarge
          size={20}
        />{/if}
    </span>
  </div>
{/snippet}

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
              <CheckmarkFilled size={32} />
            {:else}
              <RadioButton size={32} />
            {/if}
          </div>
          <div class="timeline-end mb-10 flex flex-row">
            <div>
              <span class="text-sm italic">Tier 0</span>
              <h3 class="text-3xl font-black">เช็คอินที่จุดลงทะเบียนหน้างาน</h3>
              <p class="text-sm">รับของที่ระลึกทันทีเมื่อเข้างาน!</p>
              {#if rewards.getCurrentLevel() > -1}
                <span class="mt-5 badge">คุณได้รับรางวัลนี้แล้ว </span>
              {:else}
                <div class="alert alert-warning mt-5">
                  อย่าลืมมาเช็คอินที่จุดลงทะเบียนหน้างานเพื่อรับรางวัลนี้และได้สิทธิ์ในการรับเกียรติบัตรนะ!
                </div>
              {/if}
            </div>
          </div>
          <hr />
        </li>
        <li class="not-prose">
          <div class="timeline-middle">
            {#if rewards.getCurrentLevel() > 0}
              <CheckmarkFilled size={32} />
            {:else}
              <RadioButton size={32} />
            {/if}
          </div>
          <div class="timeline-end mb-10 flex flex-row">
            <div>
              <span class="italic text-sm">Tier 3</span>
              <h3 class="text-3xl font-black">เสือฮอตเนิร์ด</h3>
              <p class="text-sm">รับกระดาษโน้ต และปากกามูจิเมื่อครบเงื่อนไข</p>
              <div class="mt-2 flex flex-row gap-4">
                <img
                  src="rewards/postit.png"
                  alt="กระดาษโน้ต"
                  class="max-w-52 w-full object-contain"
                />
                <img
                  src="rewards/pen.png"
                  alt="ปากกามูจิ"
                  class="max-w-52 w-full object-contain"
                />
              </div>
              <div class="mt-2">
                <span class="italic text-blue-300/85">เงื่อนไข</span>
                <ul class="gap-1.5 flex flex-col">
                  {@render conditionRow(
                    ` (${
                      rewards.getCheckedInDepartmentBooth().length
                    }/5) เช็คอินบูธภาควิชา 5 บูธ`,
                    rewards.getCheckedInDepartmentBooth().length >= 5,
                  )}
                  {@render conditionRow(
                    `(${
                      rewards.getCheckedinTcasBooth().length
                    }/1) เช็คอินบูธ TCAS `,
                    rewards.getCheckedinTcasBooth().length > 0,
                  )}
                  {@render conditionRow(
                    `(${rewards.getCheckedinAddYours().length}/1) ภารกิจ Add your ลงโพสต์บรรยากาศในงาน จากไอจีของงานใน x หรือ Facebook พร้อมติด #ScienceChulaOpenhouse2026 แล้วแสดงที่จุดรับของที่ระลึกเล้ย`,
                    rewards.getCheckedinAddYours().length > 0,
                  )}
                </ul>
              </div>
            </div>
          </div>
          <hr />
        </li>
        <li class="not-prose">
          <div class="timeline-middle">
            {#if rewards.getCurrentLevel() > 1}
              <CheckmarkFilled size={32} />
            {:else}
              <RadioButton size={32} />
            {/if}
          </div>
          <div class="timeline-end mb-10 flex flex-row">
            <div>
              <span class="italic text-sm">Tier 2</span>
              <h3 class="text-3xl font-black">เสือผจญภัย</h3>
              <p class="text-sm">
                กระบอกน้ำและหมวกสุดเอ็กคลูสีฟสำหรับ 50
                คนแรกในแต่ละวันที่ตรงเงื่อนไขเท่านั้น!!!!
              </p>
              <div>
                <img
                  src="rewards/cap.png"
                  alt="หมวก"
                  class="max-w-80 w-full object-contain"
                />
              </div>
              <div class="mt-2">
                <span class="italic text-blue-300/85">เงื่อนไข</span>
                <ul class="gap-1.5 flex flex-col">
                  {@render conditionRow(
                    `(${
                      rewards.getCheckedInDepartmentBooth().length
                    }/10) เช็คอินบูธภาควิชา 10 บูธ`,
                    rewards.getCheckedInDepartmentBooth().length >= 10,
                  )}
                  {@render conditionRow(
                    `(${
                      rewards.getCheckedinTcasBooth().length
                    }/1) เช็คอินบูธ TCAS`,
                    rewards.getCheckedinTcasBooth().length > 0,
                  )}
                  {@render conditionRow(
                    `(${rewards.getCheckedinAddYours().length}/1) ภารกิจ Add your ลงโพสต์บรรยากาศในงาน จากไอจีของงานใน x หรือ Facebook พร้อมติด #ScienceChulaOpenhouse2026 แล้วแสดงที่จุดรับของที่ระลึกเล้ย`,
                    rewards.getCheckedinAddYours().length > 0,
                  )}
                  {@render conditionRow(
                    `(${
                      rewards.getCheckedinWorkshop().length
                    }/1) เข้าร่วมเวิร์กช็อปอย่างน้อย 1 ครั้ง`,
                    rewards.getCheckedinWorkshop().length > 0,
                  )}
                  {@render conditionRow(
                    `(${
                      rewards.getCheckedinSciPlayground().length
                    }/1) ร่วมกิจกรรมในนิทรรศการกลาง Sci Playground`,
                    rewards.getCheckedinSciPlayground().length > 0,
                  )}
                  {@render conditionRow(
                    `(${
                      rewards.getCheckeninHashtag().length
                    }/1) ถ่ายบรรยากาศงานในเฟซหรือไอจี พร้อมติด #ScienceChulaOpenhouse2026 แล้วนำมาโชว์ที่จุดรับของที่ระลึก`,
                    rewards.getCheckeninHashtag().length > 0,
                  )}
                </ul>
              </div>
            </div>
          </div>
          <hr />
        </li>
        <li class="not-prose">
          <div class="timeline-middle">
            {#if rewards.getCurrentLevel() > 2}
              <CheckmarkFilled size={32} />
            {:else}
              <RadioButton size={32} />
            {/if}
          </div>
          <div class="timeline-end mb-10 flex flex-row">
            <div>
              <span class="italic text-sm">Tier 3</span>
              <h3 class="text-3xl font-black">เสือซีเคร็ท</h3>
              <p class="text-sm">
                กล่องจุ่มลับสุดคิวท์เฉพาะ 15 คนแรกของแต่ละวัน
                ไม่เอาไม่ได้แล้วมั้ยยยย
              </p>
              <div>
                <img
                  src="rewards/randombox.png"
                  alt="กล่องจุ่มลับ"
                  class="max-w-52 w-full object-contain"
                />
              </div>
              <div class="mt-2">
                <span class="italic text-blue-300/85">เงื่อนไข</span>
                <ul class="gap-1.5 flex flex-col">
                  {@render conditionRow(
                    `(${
                      rewards.getCheckedInDepartmentBooth().length
                    }/17) เช็คอินบูธภาควิชา 17 บูธ`,
                    rewards.getCheckedInDepartmentBooth().length >= 15,
                  )}
                  {@render conditionRow(
                    `(${
                      rewards.getCheckedinTcasBooth().length
                    }/1) เช็คอินบูธ TCAS`,
                    rewards.getCheckedinTcasBooth().length > 0,
                  )}
                  {@render conditionRow(
                    `(${rewards.getCheckedinAddYours().length}/1) ภารกิจ Add your ลงโพสต์บรรยากาศในงาน จากไอจีของงานใน x หรือ Facebook พร้อมติด #ScienceChulaOpenhouse2026 แล้วแสดงที่จุดรับของที่ระลึกเล้ย`,
                    rewards.getCheckedinAddYours().length > 0,
                  )}
                  {@render conditionRow(
                    `(${
                      rewards.getCheckedinWorkshop().length
                    }/1) เข้าร่วมเวิร์กช็อปอย่างน้อย 1 ครั้ง`,
                    rewards.getCheckedinWorkshop().length >= 1,
                  )}
                  {@render conditionRow(
                    `(${
                      rewards.getCheckedinSciPlayground().length
                    }/1) ร่วมกิจกรรมในนิทรรศการกลาง Sci Playground`,
                    rewards.getCheckedinSciPlayground().length > 0,
                  )}
                  {@render conditionRow(
                    `(${
                      rewards.getCheckeninHashtag().length
                    }/1) ถ่ายบรรยากาศงานในเฟซหรือไอจี พร้อมติด #ScienceChulaOpenhouse2026 แล้วนำมาโชว์ที่จุดรับของที่ระลึก`,
                    rewards.getCheckeninHashtag().length > 0,
                  )}
                  {@render conditionRow(
                    `(${
                      rewards.getCheckedinStage().length
                    }/1) ร่วมกิจกรรมบนเวที!!!`,
                    rewards.getCheckedinStage().length > 0,
                  )}
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ul>
    {/if}
  {/snippet}
</ResourceWrapper>
