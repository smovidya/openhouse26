import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { roleList } from "@src/auth/permissions";

function onlyDevelopment() {
  if (!import.meta.env.DEV)
    throw new ActionError({
      code: "FORBIDDEN",
      message: "This action is only available in development mode.",
    });
}

export default {
  setMyRole: defineAction({
    input: z.object({
      role: z.string().refine((val) => roleList.includes(val as any), {
        message: "Invalid role",
      }),
    }),
    handler: async (input, ctx) => {
      onlyDevelopment();
    },
  }),
};
