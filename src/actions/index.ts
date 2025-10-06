import * as participantActions from "./participant";
import * as workshopActions from "./workshop";
import * as workshopActions2 from "./workshop-but-do";

export const server = {
  ...participantActions,
  ...workshopActions,
  ...workshopActions2,
};
