import puppeteer from "@cloudflare/puppeteer";
import { certificatePdfKvKey } from "@src/data/constants";
import { checkinModel, participantModel, surveyModel } from "@src/db";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";

export const checkSurveyEligibility = defineAction({
  async handler(_, context) {
    if (!context.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
      });
    }

    let participant: Awaited<
      ReturnType<typeof participantModel.getParticipantByUserId>
    >;

    try {
      participant = await participantModel.getParticipantByUserId(
        context.locals.db,
        context.locals.user.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลผู้เข้าร่วมได้",
      });
    }

    if (!participant) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบข้อมูลผู้เข้าร่วม",
      });
    }

    let checkins: Awaited<
      ReturnType<typeof checkinModel.getCheckinByParticipant>
    >;
    let existingSurvey: Awaited<
      ReturnType<typeof surveyModel.getSurveyByParticipantId>
    >;

    try {
      checkins = await checkinModel.getCheckinByParticipant(
        context.locals.db,
        participant.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลเช็คอินได้",
      });
    }

    try {
      existingSurvey = await surveyModel.getSurveyByParticipantId(
        context.locals.db,
        participant.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลแบบสำรวจได้",
      });
    }

    if (!checkins.some((checkin) => checkin.checkpoints?.type === "entry")) {
      return {
        eligible: false,
        status: "not_checked_in" as const,
      };
    }

    if (existingSurvey?.isNameConfirmed) {
      return {
        eligible: true,
        status: "name_confirmed" as const,
      };
    }

    if (existingSurvey) {
      return {
        eligible: true,
        status: "survey_submitted" as const,
      };
    }

    return { eligible: true, status: "can_submit_survey" as const };
  },
});

export const submitSurvey = defineAction({
  input: z.object({
    purposeOfAttendance: z
      .array(z.string())
      .min(1, "กรุณาเลือกอย่างน้อย 1 ข้อ"),
    satisfication: z.object({
      department: z.object({
        interestedDepartment: z
          .array(z.string())
          .min(1, "กรุณาเลือกอย่างน้อย 1 ข้อ"),
        mostFavouriteDepartmentBooth: z.string(),
        boothSatisfaction: z.number(),
      }),
      placeAndFacilities: z.object({
        crowdManagement: z.number(),
        transportation: z.number(),
        tolietFacilities: z.number(),
        nursingPointFacilities: z.number(),
        cleanliness: z.number(),
      }),
      registration: z.object({
        websiteEaseOfAcess: z.number(),
        websiteEaseOfUse: z.number(),
        websiteBeautifulness: z.number(),
      }),
      activities: z.object({
        informationClarity: z.number(),
        workshopRegistrationDuration: z.number(),
        canJoinWorkshopAsDesired: z.number(),
        souvenirAppropriateness: z.number(),
      }),
      workshop: z.object({
        workshopContentSatisfaction: z.number(),
      }),
      overall: z.object({
        overallSatisfaction: z.number(),
        recommendToOthers: z.number(),
        intendToStudyHere: z.string(),
      }),
      otherFeedback: z.object({
        feedbackAndSuggestions: z.string(),
      }),
      departmentBooth: z.object({
        contentMetExpectation: z.number(),
        staffCommunication: z.number(),
        interestingOfContent: z.number(),
      }),
    }),
  }),
  async handler(input, context) {
    if (!context.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
      });
    }

    let participant: Awaited<
      ReturnType<typeof participantModel.getParticipantByUserId>
    >;

    try {
      participant = await participantModel.getParticipantByUserId(
        context.locals.db,
        context.locals.user.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลผู้เข้าร่วมได้",
      });
    }

    if (!participant) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบข้อมูลผู้เข้าร่วม",
      });
    }

    let checkins: Awaited<
      ReturnType<typeof checkinModel.getCheckinByParticipant>
    >;

    try {
      checkins = await checkinModel.getCheckinByParticipant(
        context.locals.db,
        participant.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลเช็คอินได้",
      });
    }

    if (!checkins.some((checkin) => checkin.checkpoints?.type === "entry")) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "ไม่สามารถส่งแบบสำรวจได้ ผู้เข้าร่วมยังไม่ได้เช็คอินเข้างาน",
      });
    }

    let existingSurvey: Awaited<
      ReturnType<typeof surveyModel.getSurveyByParticipantId>
    >;

    try {
      existingSurvey = await surveyModel.getSurveyByParticipantId(
        context.locals.db,
        participant.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลแบบสำรวจได้",
      });
    }

    if (existingSurvey) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ผู้เข้าร่วมได้ทำการส่งแบบสำรวจไปแล้ว",
      });
    }

    let insertedSurvey: Awaited<ReturnType<typeof surveyModel.insertSurvey>>;

    try {
      insertedSurvey = await surveyModel.insertSurvey(
        context.locals.db,
        participant.id,
        input,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถบันทึกข้อมูลแบบสำรวจได้",
      });
    }

    return {
      survey: insertedSurvey,
    };
  },
});

export const submitNameForCertificate = defineAction({
  input: z.object({
    givenName: z.string().min(1, "กรุณากรอกชื่อจริง"),
    familyName: z.string().min(1, "กรุณากรอกนามสกุล"),
  }),
  async handler(input, context) {
    if (!context.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
      });
    }

    let participant: Awaited<
      ReturnType<typeof participantModel.getParticipantByUserId>
    >;

    try {
      participant = await participantModel.getParticipantByUserId(
        context.locals.db,
        context.locals.user.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลผู้เข้าร่วมได้",
      });
    }

    if (!participant) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบข้อมูลผู้เข้าร่วม",
      });
    }

    try {
      await surveyModel.updateParticipantName(
        context.locals.db,
        participant.id,
        {
          givenName: input.givenName,
          familyName: input.familyName,
        },
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถอัปเดตชื่อสำหรับเกียรติบัตรได้",
      });
    }

    return {
      success: true,
    };
  },
});

export const getCertificatePDF = defineAction({
  async handler(_, context) {
    if (!context.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
      });
    }

    let participant: Awaited<
      ReturnType<typeof participantModel.getParticipantByUserId>
    >;

    try {
      participant = await participantModel.getParticipantByUserId(
        context.locals.db,
        context.locals.user.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลผู้เข้าร่วมได้",
      });
    }

    if (!participant) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบข้อมูลผู้เข้าร่วม",
      });
    }

    // check checkins
    let checkins: Awaited<
      ReturnType<typeof checkinModel.getCheckinByParticipant>
    >;

    try {
      checkins = await checkinModel.getCheckinByParticipant(
        context.locals.db,
        participant.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลเช็คอินได้",
      });
    }

    if (!checkins.some((checkin) => checkin.checkpoints?.type === "entry")) {
      throw new ActionError({
        code: "FORBIDDEN",
        message:
          "ไม่สามารถสร้างใบประกาศนียบัตรได้ ผู้เข้าร่วมยังไม่ได้เช็คอินเข้างาน",
      });
    }

    let existingSurvey: Awaited<
      ReturnType<typeof surveyModel.getSurveyByParticipantId>
    >;

    try {
      existingSurvey = await surveyModel.getSurveyByParticipantId(
        context.locals.db,
        participant.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลแบบสำรวจได้",
      });
    }

    if (!existingSurvey) {
      throw new ActionError({
        code: "FORBIDDEN",
        message:
          "ไม่สามารถสร้างใบประกาศนียบัตรได้ ผู้เข้าร่วมยังไม่ได้ส่งแบบสำรวจ",
      });
    }

    let certId = existingSurvey.certId;

    const cacheKvKey = certificatePdfKvKey(certId);

    let pdfUint8: Uint8Array;

    try {
      pdfUint8 = await surveyModel.getCertificatePdf(
        context.locals.runtime.env.BROWSER,
        context.locals.runtime.env.openhouse26_kv,
        cacheKvKey,
        context.request.url,
        `${participant.givenName} ${participant.familyName}`,
        certId,
        context.locals.runtime.env.BETTER_AUTH_SECRET,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: `ไม่สามารถสร้างใบประกาศนียบัตรได้ (${(err as Error).message})`,
      });
    }

    return {
      pdfUint8,
    };
  },
});
