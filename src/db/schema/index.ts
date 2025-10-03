import * as auth from "./auth.schema";
import * as participant from "./participant.schema";
import * as workshop from "./workshop.schema";

export const schema = {
  ...auth,
  ...participant,
  ...workshop,
};
