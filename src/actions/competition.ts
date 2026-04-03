import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import * as model from "@src/db/model";
import { env } from "cloudflare:workers";
import jwt from "@tsndr/cloudflare-worker-jwt";
import stringComparison from "string-comparison";

export const getCertificate = defineAction({
  input: z.object({
    teamId: z.string(),
    contactInfo: z.string(),
    printingName: z.string(),
  }),
  handler: async ({ teamId, contactInfo, printingName }, ctx) => {
    if (!contactInfo.trim() || !printingName.trim()) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }
    // 1. remove all 0-prefix
    // 2. left zero pad to 3 digits
    const normalizedTeamId = teamId.replace(/^0+/, "");
    const paddedTeamId = normalizedTeamId.padStart(3, "0");

    // 3. add T- prefix
    const formattedTeamId = `T-${paddedTeamId}`;
    const team = await model.competition.getTeamByTeamId(
      ctx.locals.db,
      formattedTeamId,
    );
    if (!team) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบทีมที่ระบุ โปรดตรวจสอบหมายเลขทีมและลองใหม่อีกครั้ง",
      });
    }

    const cleanedPhone = team.phone?.replace(/\D/g, "");
    const cleanedContactInfo = contactInfo.replace(/\D/g, "");

    if ((team.email && !team.phone) || (!team.email && team.phone)) {
      // If only one contact info is provided, require exact match on that field
      if (
        (team.email &&
          team.email.toLocaleLowerCase() !== contactInfo.toLocaleLowerCase()) ||
        (team.phone && cleanedPhone !== cleanedContactInfo)
      ) {
        console.error({
          teamId: formattedTeamId,
          registeredEmail: team.email,
          registeredPhone: team.phone,
          providedContactInfo: contactInfo,
        });

        throw new ActionError({
          code: "BAD_REQUEST",
          message:
            "ข้อมูลการติดต่อไม่ตรงกับที่ลงทะเบียนไว้ โปรดติดต่อโครงการหากต้องการความช่วยเหลือ",
        });
      }
    } else {
      // If both email and phone are provided, allow match on either field
      if (
        team.email &&
        team.email.toLocaleLowerCase() !== contactInfo.toLocaleLowerCase() &&
        team.phone &&
        cleanedPhone !== cleanedContactInfo
      ) {
        console.error({
          teamId: formattedTeamId,
          registeredEmail: team.email,
          registeredPhone: team.phone,
          providedContactInfo: contactInfo,
        });

        throw new ActionError({
          code: "BAD_REQUEST",
          message:
            "ข้อมูลการติดต่อไม่ตรงกับที่ลงทะเบียนไว้ โปรดติดต่อโครงการหากต้องการความช่วยเหลือ",
        });
      }
    }

    if (team.tier === "ไม่เข้าสอบ") {
      return {
        team,
        certUrl: null,
      };
    }

    if (!team.names) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ข้อมูลทีมไม่สมบูรณ์ โปรดติดต่อโครงการหากต้องการความช่วยเหลือ",
      });
    }

    const namesNoPrefix = team.names.map((name) =>
      name.replace(/^(นาย|นางสาว|นาง)/, ""),
    );
    const inputNoPrefix = printingName.replace(/^(นาย|นางสาว|นาง)/, "");

    const matchedRating = stringComparison.levenshtein
      .sortMatch(inputNoPrefix, namesNoPrefix)
      .toSorted((a, b) => b.rating - a.rating);

    if (matchedRating[0].rating < 0.5) {
      console.error({
        input: inputNoPrefix,
        candidates: namesNoPrefix,
        ratings: matchedRating,
      });
      throw new ActionError({
        code: "BAD_REQUEST",
        message:
          "ชื่อที่ใช้ในการพิมพ์ไม่ตรงกับชื่อสมาชิกในทีม โปรดตรวจสอบและลองใหม่อีกครั้ง หรือหากมีปัญหาโปรดติดต่อโครงการ",
      });
    }

    const certData = {
      name: printingName,
      teamId: team.teamId,
      tier: team.tier,
    };

    const certToken = await jwt.sign(certData, env.RENDER_SECRET);

    return {
      team,
      certUrl: "/scilympic/download?token=" + certToken,
    };
  },
});
