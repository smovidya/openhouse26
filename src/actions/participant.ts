import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { authModel, participantModel } from "@src/db";

export const registerParticipant = defineAction({
  input: z.object({
    givenName: z.string().min(1),
    familyName: z.string().min(1),
    ags: z.number().min(1).max(6),
    specialNeed: z.string().optional(),
    residentProvince: z.string().min(1),
    attendeeType: z.string().min(1),
    school: z.string().optional(),
    questions: z.string().optional(),
  }),
  async handler(input, context) {
    const { locals } = context;
    if (!locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "คุณต้องเข้าสู่ระบบก่อนลงทะเบียน",
      });
    }

    let isExisted;

    try {
      isExisted = await participantModel.getParticipantByUserId(
        locals.db,
        locals.user.id
      );
    } catch (e) {
      console.error("Error checking existing participant:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูลผู้เข้าร่วม",
      });
    }

    if (isExisted) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "คุณได้ลงทะเบียนผู้เข้าร่วมแล้ว",
      });
    }

    let insertedParticipant;

    try {
      insertedParticipant = await participantModel.insertParticipant(
        locals.db,
        {
          givenName: input.givenName,
          familyName: input.familyName,
          ags: input.ags,
          specialNeed: input.specialNeed ?? "-",
          residentProvince: input.residentProvince,
          attendeeType: input.attendeeType,
          school: input.school,
          questions: input.questions,
          userId: locals.user!.id,
        }
      );
    } catch (e) {
      console.error("Error inserting participant:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดในการลงทะเบียนผู้เข้าร่วม",
      });
    }

    let linkResult;

    try {
      linkResult = await authModel.linkParticipantToUser(
        locals.db,
        insertedParticipant.id,
        locals.user.id
      );
    } catch (e) {
      console.error("Error linking participant to user:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดในการเชื่อมต่อบัญชีผู้ใช้",
      });
    }

    return {
      results: linkResult,
    };
  },
});
