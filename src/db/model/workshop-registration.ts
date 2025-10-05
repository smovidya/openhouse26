import type { SelectedWorkshop } from "@src/client/shared-state.svelte";

export async function getSelectedWorkshop(): Promise<SelectedWorkshop[]> {
  return [
    {
      timeSlotIndex: 1,
      workshopId: "kimchi"
    }
  ];
}

export async function getRegisteredParticipantCount(workshopId: string) {
  // TODO: implement this

  // each element is participant count for each time slot with same index
  return [1, 0, 4, 50];
}

export async function setSelectedWorkshopTimeSlots(workshopId: string, timeSlotIndex: number | undefined) {
  // ถ้ามีเคยเลือกของ workshopId เดียวกัน ให้ลบของเก่า แล้วเปลี่ยนเป็น timeSlotIndex ที่ pass มา
  // ถ้า pass undefined มาให้ลบอย่างเดียว
  // อย่าเช็ค if (timeSlotIndex) pls do  if (timeSlotIndex === undefined)
}