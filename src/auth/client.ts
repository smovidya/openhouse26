import { createAuthClient } from "better-auth/client";
import { createAuthClient as createAuthClientSvelte } from "better-auth/svelte";
import { createAuthClient as createAuthClientReact } from "better-auth/react";
import {
  adminClient,
  jwtClient,
  oneTapClient,
} from "better-auth/client/plugins";
import {
  admin as adminRole,
  ac,
  majorBoothStaff,
  registarStaff,
  rewardStaff,
  workshopStaff,
  user,
} from "./permissions";

export const plugins = [
  adminClient({
    ac,
    roles: {
      admin: adminRole,
      majorBoothStaff,
      registarStaff,
      rewardStaff,
      workshopStaff,
      user,
    },
  }),
  oneTapClient({
    clientId:
      "492442244723-srs10ae9048lgbab1qfp0hldiel8lvuv.apps.googleusercontent.com",
    cancelOnTapOutside: true,
    context: "signup",
  }),
  jwtClient(),
];

export const authClient = createAuthClient({
  plugins,
});

export const authClientSvelte = createAuthClientSvelte({
  plugins,
});

export const authClientReact = createAuthClientReact({
  plugins,
});
