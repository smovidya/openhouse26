import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import * as model from "@src/db/model";
import { Rewards } from "@src/data/rewards";
import { env } from "cloudflare:workers";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { surveys } from "@src/db/schema/survey.schema";
import { eq } from "drizzle-orm";
import { certificatePdfKvKey } from "@src/data/constants";

function validateTicketCode(code: string) {
  const regex = /^[SPEAT]\d{6}$/;
  return regex.test(code);
}

async function generateToken(ticketId: string, name: string, certId: number) {
  return jwt.sign(
    {
      sub: ticketId,
      name,
      certId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    env.BETTER_AUTH_SECRET,
  );
}

export const checkEligibility = defineAction({
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

    const rewards = new Rewards(checkins);

    if (!rewards.isEligibleForCertificate()) {
      return { status: "not_eligible" as const };
    }

    const survey = await model.survey.getSurveyByTicketId(
      ctx.locals.db,
      ticketId,
    );

    if (survey) {
      return {
        status: "eligible_has_survey" as const,
        // nameInCert: survey.nameInCert,
      };
    }

    return { status: "eligible_no_survey" as const };
  },
});

export const submitSurveyAndName = defineAction({
  input: z.object({
    ticketId: z.string(),
    name: z.string(),
    responses: z.record(z.string(), z.any()).optional(),
  }),
  handler: async ({ ticketId, name, responses }, ctx) => {
    if (!validateTicketCode(ticketId)) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid CU Ticket code",
      });
    }

    // Verify eligibility
    const checkins = await model.checkin.getCheckinByTicketId(
      ctx.locals.db,
      ticketId,
    );
    const rewards = new Rewards(checkins);
    if (!rewards.isEligibleForCertificate()) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "Not eligible for certificate",
      });
    }

    // Check if already exist
    const survey = await model.survey.getSurveyByTicketId(
      ctx.locals.db,
      ticketId,
    );
    if (survey) {
      throw new ActionError({
        code: "CONFLICT",
        message: "Survey already submitted",
      });
    }

    const createdSurvey = await model.survey.createSurvey(ctx.locals.db, {
      ticketId,
      nameInCert: name,
      responses,
    });

    const token = await generateToken(
      ticketId,
      name,
      createdSurvey.certIndex || 0,
    );

    return { success: true, cert_url: "/cert/download?token=" + token };
  },
});

export const verifyName = defineAction({
  input: z.object({
    ticketId: z.string(),
    name: z.string(),
  }),
  handler: async ({ ticketId, name }, ctx) => {
    const survey = await model.survey.getSurveyByTicketId(
      ctx.locals.db,
      ticketId,
    );
    if (!survey) {
      throw new ActionError({ code: "NOT_FOUND", message: "Survey not found" });
    }

    if (survey.nameInCert !== name) {
      return {
        success: false,
        error: "ชื่อไม่ตรงกับในระบบ / Name does not match our records.",
      };
    }

    const token = await generateToken(ticketId, name, survey.certIndex || 0);

    return { success: true, cert_url: "/cert/download?token=" + token };
  },
});

export const getCertificatePDF = defineAction({
  input: z.object({
    token: z.string(),
  }),
  async handler({ token }, context) {
    if (!token) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "No token provided",
      });
    }

    const jwtVerified = await jwt.verify<{
      name: string;
      sub: string;
    }>(token, env.BETTER_AUTH_SECRET);

    if (!jwtVerified) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Invalid token",
      });
    }

    const { sub: ticketId, name } = jwtVerified.payload;
    let existingSurvey = await model.survey.getSurveyByTicketId(
      context.locals.db,
      ticketId,
    );

    if (!existingSurvey) {
      throw new ActionError({
        code: "FORBIDDEN",
        message:
          "ไม่สามารถสร้างใบประกาศนียบัตรได้ ผู้เข้าร่วมยังไม่ได้ส่งแบบสำรวจ",
      });
    }

    let certId = existingSurvey.certIndex;

    if (!certId) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่พบ certId สำหรับผู้เข้าร่วมนี้",
      });
    }

    const cacheKvKey = certificatePdfKvKey(certId);

    let pdfUint8: Uint8Array;

    try {
      pdfUint8 = await model.survey.getCertificatePdf(
        env.BROWSER,
        env.openhouse26_2_kv,
        cacheKvKey,
        context.request.url,
        name,
        certId || 0,
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
