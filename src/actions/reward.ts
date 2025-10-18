import { hasOneOfRoleIn } from "@src/auth/utils";
import { Rewards } from "@src/data/rewards";
import {
  checkinModel,
  participantModel,
  redeemModel,
  staffModel,
} from "@src/db";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const redeem = defineAction({
  input: z.object({
    qrId: z.string(),
  }),
  async handler(input, context) {
    if (!context.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
      });
    }

    if (!hasOneOfRoleIn(context.locals.user, ["admin", "rewardStaff"])) {
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
        context.locals.db,
        input.qrId,
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
        input.qrId,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลเช็คอินได้",
      });
    }

    const reward = new Rewards(participant.id, checkins);
    const currentTier = reward.getCurrentTier();

    if (reward.isRedeemedReward()) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ผู้เข้าร่วมได้ทำการแลกรางวัลไปแล้ว",
      });
    }

    let staffId: Awaited<ReturnType<typeof staffModel.getStaffIdByUserId>>;

    try {
      staffId = await staffModel.getStaffIdByUserId(
        context.locals.db,
        context.locals.user.id,
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
      await checkinModel.addCheckinForParticipant(context.locals.db, {
        checkpointId: "recive-reward",
        participantId: participant.id,
        staffId: staffId,
      });
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถบันทึกข้อมูลเช็คอินได้",
      });
    }
  },
});
