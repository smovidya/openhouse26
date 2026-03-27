import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import * as model from "@src/db/model";
import { Rewards } from "@src/data/rewards";
import { env } from "cloudflare:workers";

function validateTicketCode(code: string) {
  const regex = /^[SPEAT]\d{6}$/;
  return regex.test(code);
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
      return { status: "not_eligible" };
    }

    const survey = await model.survey.getSurveyByTicketId(ctx.locals.db, ticketId);
    
    if (survey) {
      return { status: "eligible_has_survey", nameInCert: survey.nameInCert };
    }

    return { status: "eligible_no_survey" };
  },
});

export const submitSurveyAndName = defineAction({
  input: z.object({
    ticketId: z.string(),
    name: z.string(),
  }),
  handler: async ({ ticketId, name }, ctx) => {
    if (!validateTicketCode(ticketId)) {
       throw new ActionError({ code: "BAD_REQUEST", message: "Invalid CU Ticket code" })
    }

    // Verify eligibility
    const checkins = await model.checkin.getCheckinByTicketId(ctx.locals.db, ticketId);
    const rewards = new Rewards(checkins);
    if (!rewards.isEligibleForCertificate()) {
      throw new ActionError({ code: "FORBIDDEN", message: "Not eligible for certificate" });
    }

    // Check if already exist
    const survey = await model.survey.getSurveyByTicketId(ctx.locals.db, ticketId);
    if (survey) {
      throw new ActionError({ code: "CONFLICT", message: "Survey already submitted" });
    }

    await model.survey.createSurvey(ctx.locals.db, {
      ticketId,
      nameInCert: name,
    });

    return { success: true };
  },
});

export const verifyName = defineAction({
  input: z.object({
    ticketId: z.string(),
    name: z.string(),
  }),
  handler: async ({ ticketId, name }, ctx) => {
    const survey = await model.survey.getSurveyByTicketId(ctx.locals.db, ticketId);
    if (!survey) {
      throw new ActionError({ code: "NOT_FOUND", message: "Survey not found" });
    }

    if (survey.nameInCert !== name) {
      return { success: false, error: "ชื่อไม่ตรงกับในระบบ / Name does not match our records." };
    }

    return { success: true };
  },
});

export const getCertUrl = defineAction({
  input: z.object({
    ticketId: z.string(),
    name: z.string(),
  }),
  handler: async ({ ticketId, name }, ctx) => {
    const token = env.BETTER_AUTH_SECRET;
    return { url: `/cert/render?name=${encodeURIComponent(name)}&code=${encodeURIComponent(ticketId)}&token=${encodeURIComponent(token)}` };
  }
});
