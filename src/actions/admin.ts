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

    return await adminModel.addStaff(ctx.locals.db, {
      emails: JSON.stringify(emails),
      name: name,
      phone: phone,
      studentId: studentId,
      boothName: boothName,
      requestedRole: JSON.stringify(requestedRole),
    });
  },
});
