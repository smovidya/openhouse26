import * as auth from "./auth.schema";
import * as checkin from "./checkin.schema";
import * as survey from "./survey.schema";
import * as staff from "./staff.schema";
import * as competitor from "./competitor.schema";

export const schema = {
  ...auth,
  ...staff,
  ...survey,
  ...checkin,
  ...competitor,
};
