import * as auth from "./auth.schema";
import * as checkin from "./checkin.schema";
import * as participant from "./participant.schema";
import * as survey from "./survey.schema";
import * as staff from "./staff.schema";

export const schema = {
  ...auth,
  ...participant,
  ...staff,
  ...survey,
  ...checkin,
};
