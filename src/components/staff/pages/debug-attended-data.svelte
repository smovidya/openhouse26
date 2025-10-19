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
            <td class="break-all">{value}</td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<h2>บูธที่เข้าร่วมแล้ว เรียงตามเวลา</h2>

<ul class="steps steps-vertical">
  {#each participantData.current?.checkinForBooth as checkin (checkin.checkins.id)}
    <li class="step step-primary">
      <div class="text-start flex flex-col gap-1">
        <h3 class="text-left">
          {checkin.checkpoints?.name}
        </h3>
        <span>
          {new Date(checkin.checkins.createdAt).toLocaleString("th-TH", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </span>
        <span
          >เช็คอินโดย {checkin.staffs?.name} ({checkin.staffs?.boothName})</span
        >
      </div>
    </li>
  {/each}
</ul>
