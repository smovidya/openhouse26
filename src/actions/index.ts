import * as participantActions from "./participant";
import * as workshopActions from "./workshop";

export const server = {
  ...participantActions,
  ...workshopActions,
};
