import { hasOneOfRoleIn } from "@src/auth/utils";
import { redeemModel, staffModel } from "@src/db";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const redeem = defineAction({
    input: z.object({
        qrId: z.string()
    }),
    async handler(input, context) {
        if (!context.locals.user) {
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
            });
        }
        if (
            !hasOneOfRoleIn(context.locals.user, [
                "admin",
                "rewardStaff"
            ])
        ) {
            throw new ActionError({
                code: "FORBIDDEN",
                message: "ไม่ได้รับอนุญาต คุณไม่มีสิทธิ์เข้าใช้งาน",
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
            const result = await redeemModel.markAsRedeemed(context.locals.db, input.qrId, staffId);
            if (result === "user-not-exist") {
                throw new ActionError({
                    code: "NOT_FOUND",
                    message: "ไม่พบข้อมูลผู้เข้าร่วม",
                });
            }

            if (result === "redeemed") {
                throw new ActionError({
                    code: "CONFLICT",
                    message: "ผู้เข้าร่วมรับของที่ระลึกแล้ว",
                });
            }
        } catch {
            throw new ActionError({
                code: "INTERNAL_SERVER_ERROR",
                message: "เกิดข้อผิดพลาดไม่ทราบสาเหตุ",
            });
        }

    },
})

export const getParticipantRewardLevel = defineAction({
    input: z.object({
        qrId: z.string()
    }),
    async handler(input, context) {
        if (!context.locals.user) {
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
            });
        }
        if (
            !hasOneOfRoleIn(context.locals.user, [
                "admin",
                "rewardStaff"
            ])
        ) {
            throw new ActionError({
                code: "FORBIDDEN",
                message: "ไม่ได้รับอนุญาต คุณไม่มีสิทธิ์เข้าใช้งาน",
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
            const result = await redeemModel.getRewardInfo(context.locals.db, input.qrId);
            if (result === "user-not-exist") {
                throw new ActionError({
                    code: "NOT_FOUND",
                    message: "ไม่พบข้อมูลผู้เข้าร่วม",
                });
            }

            return result.getCurrentTier();
        } catch {
            throw new ActionError({
                code: "INTERNAL_SERVER_ERROR",
                message: "เกิดข้อผิดพลาดไม่ทราบสาเหตุ",
            });
        }
    },
})
