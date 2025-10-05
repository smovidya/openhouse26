import { getContext, setContext } from "svelte";

// this interface should be in the api file
export interface SelectedWorkshop {
  workshopId: string,
  timeSlotIndex: number;
}

// unused becuase this wont be persisted across client navigation anyway
class SelectedWorkshopState {
  #selectedWorkshops = $state([] as SelectedWorkshop[]);

  constructor(initial?: SelectedWorkshop[]) {
    if (initial) {
      this.#selectedWorkshops = initial;
    }
  }

  get selectedWorkshops() {
    return this.#selectedWorkshops;
  }

  refresh() {
    // TODO: pull from server
  }

  add(workshopId: string, timeSlotIndex: number) {
    this.#selectedWorkshops.push({
      workshopId,
      timeSlotIndex
    });
  }

  remove(workshopId: string, timeSlotIndex: number) {
    this.#selectedWorkshops = this.#selectedWorkshops.filter(it => !(it.timeSlotIndex === timeSlotIndex && it.workshopId === workshopId));
  }
}

export function provideSelectedWorkshopState() {
  const state = new SelectedWorkshopState();
  return setContext("SelectedWorkshopState", state);
}

export function useSelectedWorkshopState() {
  return getContext("SelectedWorkshopState") as SelectedWorkshopState;
}