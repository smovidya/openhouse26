import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { authModel, participantModel } from "@src/db";
import {
  howDidYouKnowUsOptions,
  whyJoinThisOptions,
} from "@src/data/constants";
import { departments } from "@src/data/departments";

export const registerParticipant = defineAction({
  input: z
    .object({
      givenName: z.string().min(1),
      familyName: z.string().min(1),
      age: z.number().min(1).max(100),
      specialNeeds: z.string().optional(),
      residentProvince: z.string().min(1),
      attendeeType: z.string().min(1),
      school: z.string().optional(),

      howDidYouKnowUs: z
        .enum([...howDidYouKnowUsOptions.map((it) => it.value), "other"] as any)
        .array()
        .min(1),
      howDidYouKnowUsOther: z.string(),

      whyJoinThis: z
        .enum([[...whyJoinThisOptions.map((it) => it.value), "other"]] as any)
        .array()
        .min(1),
      whyJoinThisOther: z.string(),

      interestedDepartments: z
        .enum([...departments.map((it) => String(it.id)), "none"] as any)
        .array()
        .length(3),
    })
    .transform((data) => {
      if (data.attendeeType === "ผู้ปกครอง" || data.attendeeType === "อื่นๆ") {
        return {
          ...data,
          interestedDepartments: ["none", "none", "none"],
        };
      }

      return data;
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
    const departmentTextList = input.interestedDepartments.map((id) => {
      const dept = departments.find((d) => d.id === id);
      return dept ? dept.thName : "ไม่ทราบ";
    });

    try {
      insertedParticipant = await participantModel.insertParticipant(
        locals.db,
        {
          givenName: input.givenName,
          familyName: input.familyName,
          age: input.age,
          specialNeeds: input.specialNeeds ?? "-",
          residentProvince: input.residentProvince,
          attendeeType: input.attendeeType,
          school: input.school,
          questions: JSON.stringify({
            howDidYouKnowUs: input.howDidYouKnowUs,
            howDidYouKnowUsOther: input.howDidYouKnowUsOther,
            whyJoinThis: input.whyJoinThis,
            whyJoinThisOther: input.whyJoinThisOther,
            interestedDepartments: departmentTextList,
          }),
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
