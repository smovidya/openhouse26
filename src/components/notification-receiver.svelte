<script lang="ts">
  import { boothCheckpoints } from "@src/data/checkpoints";
  import { workshops } from "@src/data/workshops";
  import { onNotify, type UserEvent } from "@src/notification/client";
  import { toast, Toaster } from "svelte-sonner";

  interface Props {
    wsUrl: string;
    token: string;
  }

  let { wsUrl, token }: Props = $props();

  const events = $state([]) as any[];
  let latestEvent = $state() as any;

  $effect(() => onNotify(wsUrl, token, onEvent));

  function onEvent(event: UserEvent) {
    events.push(event);
    latestEvent = event;

    switch (event.type) {
      case "registrar-checkin":
        toast.success("เช็คอินเข้างานสำเร็จ");
        break;
      case "booth-checkin":
        const booth = boothCheckpoints.find((it) => it.id === event.boothId)!;
        toast.success(`เช็คอินบูธสำเร็จ`, {
          description: `${booth.name}`,
        });
        break;
      case "workshop-checkin":
        const workshop = workshops.find((it) => it.id === event.workshopId)!;
        const slot = workshop.slots.find(
          (it) => it.round === event.roundNumber,
        )!;
        toast.success(`เช็คอินเวิร์กช็อปสำเร็จ`, {
          description: `${workshop.title} รอบ ${slot.start.toString()}`,
        });
        break;
      case "workshop-onsite-participate":
        const workshop2 = workshops.find((it) => it.id === event.workshopId)!;
        const slot2 = workshop2.slots.find(
          (it) => it.round === event.roundNumber,
        )!;
        toast.success(`ลงทะเบียนเข้าร่วมเวิร์กช็อปสำเร็จ`, {
          description: `${workshop2.title} รอบ ${slot2.start.toString()}`,
        });
        break;
      case "redeem":
        toast.success(`ยืนยันรับรางวัลสำเร็จ`, {
          // TODO: text for this
          // description: JSON.stringify(event),
        });
        break;
    }
  }
</script>

<Toaster />
