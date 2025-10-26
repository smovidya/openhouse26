import * as participantActions from "./participant";
import * as workshopActions from "./workshop";
import * as devActions from "./dev";
import * as checkinActions from "./checkin";
import * as adminActions from "./admin";
import * as rewardActions from "./reward";
import * as surveyActions from "./survey";

export const server = {
  ...participantActions,
  ...workshopActions,
  ...devActions,
  ...checkinActions,
  ...adminActions,
  ...rewardActions,
  ...surveyActions,
};
