import * as participantActions from "./participant";
import * as workshopActions from "./workshop";
import * as devActions from "./dev";

export const server = {
  ...participantActions,
  ...workshopActions,
  ...devActions,
};
