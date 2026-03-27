import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import * as model from "@src/db/model";
import { Rewards } from "@src/data/rewards";
import { hasOneOfRoleIn } from "@src/auth/utils";

function validateTicketCode(code: string) {
  const regex = /^[SPEAT]\d{6}$/;
  return regex.test(code);
}

export const listAttendancesProgress = defineAction({
  input: z.object({
    ticketId: z.string(),
  }),
  handler: async ({ ticketId }, ctx) => {
    if (!validateTicketCode(ticketId)) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "รูปแบบรหัส CU Ticket ไม่ถูกต้อง",
      });
    }

    const checkins = await model.checkin.getCheckinByTicketId(
      ctx.locals.db,
      ticketId,
    );

    return { checkins };
  },
});

export const listAttendancesProgressWithStaff = defineAction({
  input: z.object({
    ticketId: z.string(),
  }),
  handler: async ({ ticketId }, ctx) => {
    if (!validateTicketCode(ticketId)) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "รูปแบบรหัส CU Ticket ไม่ถูกต้อง",
      });
    }

    if (
      !hasOneOfRoleIn(ctx.locals.user, [
        "admin",
        "majorBoothStaff",
        "rewardStaff",
        "workshopStaff",
      ])
    )
      throw new ActionError({
        code: "FORBIDDEN",
        message: "คุณไม่มีสิทธิ์ในการเช็คอิน",
      });

    const checkins = await model.checkin.getCheckinByTicketIdWithStaff(
      ctx.locals.db,
      ticketId,
    );

    return { checkins };
  },
});

export const checkinCheckpoint = defineAction({
  input: z.object({
    checkpointId: z.string(),
    ticketId: z.string(),
  }),
  handler: async ({ checkpointId, ticketId }, ctx) => {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "โปรดเข้าสู่ระบบก่อการเช็คอิน",
      });
    }

    if (
      !hasOneOfRoleIn(ctx.locals.user, [
        "admin",
        "majorBoothStaff",
        "rewardStaff",
        "workshopStaff",
      ])
    )
      throw new ActionError({
        code: "FORBIDDEN",
        message: "คุณไม่มีสิทธิ์ในการเช็คอิน",
      });

    if (!validateTicketCode(ticketId)) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "รูปแบบรหัส CU Ticket ไม่ถูกต้อง",
      });
    }

    const checkins = await model.checkin.getCheckinByTicketId(
      ctx.locals.db,
      ticketId,
    );

    const rewards = new Rewards(checkins);

    const { canCheckin, reason } = rewards.isCanCheckinCheckpoint(checkpointId);
    if (!canCheckin) {
      throw new ActionError({
        code: "CONFLICT",
        message: reason,
      });
    }

    if (checkpointId == "redeem-reward") {
      await model.checkin.createCheckin(ctx.locals.db, {
        checkpointId,
        ticketId,
        staffId: ctx.locals.user.staffId || "",
        data: JSON.stringify({
          rewardSnapshot: rewards.serialize(),
        }),
      });

      return { success: true };
    }

    await model.checkin.createCheckin(ctx.locals.db, {
      checkpointId,
      ticketId,
      staffId: ctx.locals.user.staffId || "",
      data: null,
    });

    return { success: true };
  },
});

export const listCheckinsByCheckpoint = defineAction({
  input: z.object({
    checkpointId: z.string(),
  }),
  handler: async ({ checkpointId }, ctx) => {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "โปรดเข้าสู่ระบบก่อนทำการเช็คอิน",
      });
    }

    if (
      !hasOneOfRoleIn(ctx.locals.user, [
        "admin",
        "rewardStaff",
        "workshopStaff",
      ])
    )
      throw new ActionError({
        code: "FORBIDDEN",
        message: "คุณไม่มีสิทธิ์ในการดูข้อมูลเช็คอิน",
      });

    const checkins = await model.checkin.getCheckinByCheckpointId(
      ctx.locals.db,
      checkpointId,
    );

    return { checkins };
  },
});
