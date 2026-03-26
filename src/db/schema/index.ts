import * as auth from "./auth.schema";
import * as checkpoint from "./checkpoint.schema";
import * as participant from "./participant.schema";
import * as reward from "./reward.schema";
import * as survey from "./survey.schema";
import * as staff from "./staff.schema";

export const schema = {
  ...auth,
  ...participant,
  ...staff,
  ...survey,
  ...checkpoint,
  ...reward,
};
