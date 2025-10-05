import type { SelectedWorkshop } from "@src/client/shared-state.svelte";

export async function getSelectedWorkshop(): Promise<SelectedWorkshop[]> {
  return [
    {
      timeSlotIndex: 1,
      workshopId: "kimchi"
    }
  ]
}

export async function getRegisteredParticipantCount(workshopId: string) {
  // TODO: implement this

  // each element is participant count for each time slot with same index
  return [1, 0, 4, 50]
}