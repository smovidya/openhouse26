import { sendEvent } from "@src/notification/server";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const sentStuff = defineAction({
  input: z.object({
    to: z.string(),
    data: z.any(),
  }),
  handler(input, context) {
    if (!(import.meta.env.DEV || context.locals.runtime.env.ENVIRONMENT === "staging")) {
      return;
    }
    return sendEvent(context.locals.runtime.env.SSE, input.to, input.data);
  },
});
