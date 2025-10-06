import { getContext, setContext } from "svelte";

// this interface should be in the api file
export interface SelectedWorkshop {
  workshopId: string,
  roundNumber: number;
}

