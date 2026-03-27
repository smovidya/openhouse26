import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import * as model from "@src/db/model";
import { hasOneOfRoleIn } from "@src/auth/utils";

export const addStaff = defineAction({
  input: z.object({
    name: z.string(),
    studentId: z.string(),
    emails: z.string().array(),
    phone: z.string(),
    booth: z.string(),
    roles: z.string().array(),
  }),
  handler: async ({ name, studentId, emails, phone, booth, roles }, ctx) => {
    if (!ctx.locals.user || !hasOneOfRoleIn(ctx.locals.user, ["admin"]))
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "คุณไม่มีสิทธิ์ดำเนินการนี้",
      });

    const staffAccount = await model.staff.addStaff(ctx.locals.db, {
      booth,
      emails: emails.join("\n"),
      name,
      phone,
      roles: roles.join(","),
      studentId,
    });

    for (const email of emails) {
      // find user by email
      const userRecord = await model.auth.getUserByEmail(ctx.locals.db, email);
      if (!userRecord) continue;
      // @ts-ignore
      await ctx.locals.auth.api.setRole({
        headers: ctx.request.headers,
        body: {
          role: staffAccount.requestedRole.split(",") as string[],
          userId: userRecord.id,
        },
      });

      await model.staff.linkStaffToUser(
        ctx.locals.db,
        userRecord.id,
        staffAccount.id,
      );

      // @ts-ignore
      await ctx.locals.auth.api.revokeUserSessions({
        headers: ctx.request.headers,
        body: {
          userId: userRecord.id,
        },
      });
    }

    return {
      staffId: staffAccount.id,
    };
  },
});

export const listStaffs = defineAction({
  handler: async (_, ctx) => {
    const staffs = await model.staff.listStaffs(ctx.locals.db);
    return { staffs };
  },
});
