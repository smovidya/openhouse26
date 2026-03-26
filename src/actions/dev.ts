import { defineAction } from "astro:actions";
import { z } from "astro/zod";
// import { sendEvent } from "@src/notification/server";
// import { env } from "cloudflare:workers";

export const sentStuff = defineAction({
  input: z.object({
    to: z.string(),
    data: z.any(),
  }),
  handler(_input, _context) {
    return new Response("not found", { status: 404 });
    // if (!import.meta.env.DEV) {
    //   return;
    // }
    // return sendEvent(env.SSE, input.to, input.data);
  },
});
