import * as auth from "./auth.schema";
import * as participant from "./participant.schema";
import * as workshop from "./workshop.schema";
import * as staff from "./staff.schema";

export const schema = {
  ...auth,
  ...participant,
  ...workshop,
  ...staff,
};
