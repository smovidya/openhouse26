import { hasOneOfRoleIn } from "@src/auth/utils";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { participantModel, checkinModel, staffModel } from "@src/db";
import { boothCheckpoints } from "@src/data/checkpoints";

export const getParticipantCheckinBoothByIdOrQrCodeId = defineAction({
  input: z.object({
    participantIdOrQrCodeId: z.string(),
    boothId: z.string().nullable(),
  }),
  handler: async (input, ctx) => {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
      });
    }
    if (
      !hasOneOfRoleIn(ctx.locals.user, [
        "admin",
        "majorBoothStaff",
        "registarStaff",
        "rewardStaff",
        "workshopStaff",
      ])
    ) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "ไม่ได้รับอนุญาต คุณไม่มีสิทธิ์เข้าใช้งาน",
      });
    }

    let participant: Awaited<
      ReturnType<typeof participantModel.getParticipantByIdOrQrCodeId>
    >;
    try {
      participant = await participantModel.getParticipantByIdOrQrCodeId(
        ctx.locals.db,
        input.participantIdOrQrCodeId,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลผู้เข้าร่วมกิจกรรมได้",
      });
    }

    if (!participant) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบผู้เข้าร่วมกิจกรรม",
      });
    }

    if (!input.boothId) {
      return {
        participant,
        checkinForBooth: null,
      };
    }

    let checkinForBooth: Awaited<
      ReturnType<typeof checkinModel.getCheckinByParticipantAndCheckpoint>
    >;

    try {
      checkinForBooth = await checkinModel.getCheckinByParticipantAndCheckpoint(
        ctx.locals.db,
        participant.id,
        input.boothId,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลการเข้าร่วมกิจกรรมได้",
      });
    }

    if (!checkinForBooth) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบการเข้าร่วมกิจกรรม",
      });
    }

    return {
      participant,
      checkinForBooth,
    };
  },
});

export const staffCheckin = defineAction({
  input: z.object({
    participantIdOrQrCodeId: z.string(),
    boothId: z.string(),
  }),
  handler: async (input, ctx) => {
    if (!boothCheckpoints.some((v) => v.id === input.boothId)) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบบูธ",
      });
    }

    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "ไม่ได้เข้าสู่ระบบ",
      });
    }

    if (
      !hasOneOfRoleIn(ctx.locals.user, [
        "admin",
        "majorBoothStaff",
        "workshopStaff",
      ])
    ) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "ไม่ได้รับอนุญาต",
      });
    }

    let participant: Awaited<
      ReturnType<typeof participantModel.getParticipantByIdOrQrCodeId>
    >;
    let checkinForBooth: Awaited<
      ReturnType<typeof checkinModel.getCheckinByParticipantAndCheckpoint>
    >;

    try {
      participant = await participantModel.getParticipantByIdOrQrCodeId(
        ctx.locals.db,
        input.participantIdOrQrCodeId,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลผู้เข้าร่วมกิจกรรมได้",
      });
    }

    if (!participant) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบผู้เข้าร่วมกิจกรรม",
      });
    }

    try {
      checkinForBooth = await checkinModel.getCheckinByParticipantAndCheckpoint(
        ctx.locals.db,
        participant.id,
        input.boothId,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลการเข้าร่วมกิจกรรมได้",
      });
    }

    if (checkinForBooth.some((v) => v.checkpoints?.id === input.boothId)) {
      throw new ActionError({
        code: "CONFLICT",
        message: "ผู้เข้าร่วมกิจกรรมนี้ได้เข้าร่วมกิจกรรมในบูธนี้แล้ว",
      });
    }

    let staffId: Awaited<ReturnType<typeof staffModel.getStaffIdByUserId>>;

    try {
      staffId = await staffModel.getStaffIdByUserId(
        ctx.locals.db,
        ctx.locals.user.id,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลสตาฟได้",
      });
    }

    if (!staffId) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบสตาฟ",
      });
    }

    try {
      await checkinModel.addCheckinForParticipant(ctx.locals.db, {
        participantId: participant.id,
        staffId: staffId,
        checkpointId: input.boothId,
      });
    } catch (err) {
      console.error(err);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าร่วมกิจกรรมได้ เกิดข้อผิดพลาดภายใน",
      });
    }

    return;
  },
});
