import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { authModel, participantModel, checkinModel, adminModel } from "@src/db";
import { hasOneOfRoleIn } from "@src/auth/utils";

export const adminAddStaff = defineAction({
  input: z.object({
    name: z.string().min(1),
    studentId: z.string().nullable(),
    emails: z.string().min(1).array(),
    phone: z.string(),
    boothName: z.string(),
    requestedRole: z.string().array(),
  }),
  handler: async (input, ctx) => {
    if (!ctx.locals.user || !hasOneOfRoleIn(ctx.locals.user, ["admin"])) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "คุณไม่มีสิทธิ์ในการดำเนินการนี้",
      });
    }

    const { name, boothName, emails, phone, requestedRole, studentId } = input;

    console.log(input);
    const staffAccount = await adminModel.addStaff(ctx.locals.db, {
      emails: JSON.stringify(emails),
      name: name,
      phone: phone,
      studentId: studentId,
      boothName: boothName,
      requestedRole: JSON.stringify(requestedRole),
    });

    // update existed users to link to this staff
    for (const email of emails) {
      // find user by email
      const userRecord = await authModel.getUserByEmail(ctx.locals.db, email);
      if (!userRecord) continue;
      // @ts-ignore
      const user = await ctx.locals.auth.api.setRole({
        headers: ctx.request.headers,
        body: {
          role: requestedRole as any[],
          userId: userRecord.id,
        },
      });

      await authModel.linkStaffToUser(
        ctx.locals.db,
        staffAccount.id,
        userRecord.id,
      );
    }

    return {
      staffId: staffAccount.id,
    };
  },
});
