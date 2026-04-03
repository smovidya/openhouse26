import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import * as model from "@src/db/model";
import { hasOneOfRoleIn } from "@src/auth/utils";
import { competitorTiers } from "@src/data/scilympic";
import { env } from "cloudflare:workers";
import jwt from "@tsndr/cloudflare-worker-jwt";
import stringComparison from "string-comparison";

const competitorTierEnum = z.enum(competitorTiers);

const parseNames = (raw: string) =>
  raw
    .split("\n")
    .map((name) => name.trim())
    .filter(Boolean);

const normalizeOnlineRoundScore = (input: number) => {
  const scaled = Math.round(input * 10);
  if (Math.abs(input * 10 - scaled) > Number.EPSILON) {
    throw new ActionError({
      code: "BAD_REQUEST",
      message: "คะแนนรอบออนไลน์ต้องมีทศนิยมไม่เกิน 1 ตำแหน่ง",
    });
  }

  return scaled;
};

const assertAdmin = (user: { role?: string | null } | null) => {
  if (!hasOneOfRoleIn(user, ["admin"])) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "คุณไม่มีสิทธิ์ดำเนินการนี้",
    });
  }
};

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
          message: "ข้อมูลการติดต่อไม่ตรงกับที่ลงทะเบียนไว้",
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
          message: "ข้อมูลการติดต่อไม่ตรงกับที่ลงทะเบียนไว้",
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
        message:
          "ชื่อที่ใช้ในการพิมพ์มีความคล้ายคลึงกับชื่อสมาชิกในทีมต่ำเกินไป",
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

export const listCompetitorsAdmin = defineAction({
  input: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(500).default(20),
    searchQuery: z.string().optional(),
    tier: competitorTierEnum.optional(),
  }),
  handler: async ({ page, limit, searchQuery, tier }, ctx) => {
    assertAdmin(ctx.locals.user);
    const { items, total } = await model.competition.listCompetitors(
      ctx.locals.db,
      {
        page,
        limit,
        searchQuery,
        tier,
      },
    );

    return {
      items,
      total,
      maxPage: Math.ceil(total / limit),
    };
  },
});

const mutableCompetitorInput = z.object({
  teamId: z.string().trim().min(1),
  email: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  namesText: z.string().trim().min(1),
  tier: competitorTierEnum,
  onlineRoundScore: z.number().min(0).refine(Number.isFinite),
});

export const createCompetitorAdmin = defineAction({
  input: mutableCompetitorInput,
  handler: async (input, ctx) => {
    assertAdmin(ctx.locals.user);

    const names = parseNames(input.namesText);
    if (names.length === 0) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "กรุณากรอกชื่อสมาชิกอย่างน้อย 1 คน",
      });
    }

    const normalizedOnlineRoundScore = normalizeOnlineRoundScore(
      input.onlineRoundScore,
    );

    const competitor = await model.competition.createCompetitor(ctx.locals.db, {
      ...input,
      names,
      onlineRoundScore: normalizedOnlineRoundScore,
    });

    return { competitor };
  },
});

export const updateCompetitorAdmin = defineAction({
  input: mutableCompetitorInput.extend({
    id: z.string().trim().min(1),
  }),
  handler: async ({ id, ...input }, ctx) => {
    assertAdmin(ctx.locals.user);

    const names = parseNames(input.namesText);
    if (names.length === 0) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "กรุณากรอกชื่อสมาชิกอย่างน้อย 1 คน",
      });
    }

    const normalizedOnlineRoundScore = normalizeOnlineRoundScore(
      input.onlineRoundScore,
    );

    const competitor = await model.competition.updateCompetitorById(
      ctx.locals.db,
      {
        id,
        ...input,
        names,
        onlineRoundScore: normalizedOnlineRoundScore,
      },
    );

    if (!competitor) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบข้อมูลทีมที่ต้องการแก้ไข",
      });
    }

    return { competitor };
  },
});

export const deleteCompetitorAdmin = defineAction({
  input: z.object({
    id: z.string().trim().min(1),
  }),
  handler: async ({ id }, ctx) => {
    assertAdmin(ctx.locals.user);

    const competitor = await model.competition.softDeleteCompetitorById(
      ctx.locals.db,
      id,
    );

    if (!competitor) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบข้อมูลทีมที่ต้องการลบ",
      });
    }

    return { id: competitor.id };
  },
});
