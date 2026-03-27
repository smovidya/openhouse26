import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import * as model from "@src/db/model";
import { Rewards } from "@src/data/rewards";

export const listAttendancesProgress = defineAction({
  input: z.object({
    ticketId: z.string(),
  }),
  handler: async ({ ticketId }, ctx) => {
    const checkins = await model.checkin.getCheckinByTicketId(
      ctx.locals.db,
      ticketId,
    );

    return { checkins };
  },
});
