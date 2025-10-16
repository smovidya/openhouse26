import { hasOneOfRoleIn } from "@src/auth/utils";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import {
  participantModel,
  checkinModel,
  staffModel,
  workshopModel,
} from "@src/db";
import { boothCheckpoints } from "@src/data/checkpoints";
import type { CheckinWorkshopData } from "@src/type";
import { sendEvent } from "@src/notification/server";

export const getParticipantByIdOrQrCodeId = defineAction({
  input: z.object({
    participantIdOrQrCodeId: z.string(),
    boothId: z.string().optional(),
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

    let checkins: Awaited<
      ReturnType<typeof checkinModel.getCheckinByParticipant>
    >;

    try {
      checkins = await checkinModel.getCheckinByParticipant(
        ctx.locals.db,
        input.participantIdOrQrCodeId,
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลการเข้าร่วมกิจกรรมได้",
      });
    }

    return {
      participant,
      checkinForBooth: checkins,
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
    let checkins: Awaited<
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
      checkins = await checkinModel.getCheckinByParticipantAndCheckpoint(
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

    // Does the attendee checkin at register?
    if (!checkins.find((v) => v.checkpoints?.type === "entry")) {
      throw new ActionError({
        code: "CONFLICT",
        message:
          "ผู้เข้าร่วมกิจกรรมนี้ยังไม่ได้ลงทะเบียนเข้างาน โปรดแจ้งให้ไปที่จุดลงทะเบียน",
      });
    }

    if (checkins.some((v) => v.checkpoints?.id === input.boothId)) {
      throw new ActionError({
        code: "CONFLICT",
        message: "ผู้เข้าร่วมกิจกรรมนี้ได้เข้าร่วมกิจกรรมในบูธนี้แล้ว",
      });
    }
    const attendedWorkshop =
      checkins.filter((v) => v.checkpoints?.type === "workshop") || [];

    for (const w of attendedWorkshop) {
      const currentTime = new Date();
      const parsedData = JSON.parse(
        (w.checkins.data || "{}") as string,
      ) as CheckinWorkshopData;
      if (parsedData && parsedData.type === "workshop") {
        const startTime = new Date(parsedData.startTime);
        const endTime = new Date(parsedData.endTime);
        // If the current time is within the workshop time, prevent check-in to other booths
        if (currentTime >= startTime && currentTime <= endTime) {
          throw new ActionError({
            code: "CONFLICT",
            message: `ผู้เข้าร่วมกิจกรรมนี้กำลังเข้าร่วมกิจกรรม Workshop อยู่ ไม่สามารถเข้าร่วมกิจกรรมอื่นได้ในขณะนี้`,
          });
        }
      }
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

export const staffCheckinWorkshop = defineAction({
  input: z.object({
    participantIdOrQrCodeId: z.string(),
    workshopId: z.string(),
    roundNumber: z.string(),
  }),
  handler: async (input, ctx) => {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
      });
    }
    if (!hasOneOfRoleIn(ctx.locals.user, ["admin", "workshopStaff"])) {
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

    let userRegisteredSlots: Awaited<
      ReturnType<
        (typeof workshopModel)["getTimeSlotRegistrationForParticipant"]
      >
    >;

    try {
      userRegisteredSlots =
        await workshopModel.getTimeSlotRegistrationForParticipant(
          ctx.locals.db,
          participant.id,
        );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลการลงทะเบียนกิจกรรมได้",
      });
    }

    const currentSlot = userRegisteredSlots.find((v) => {
      return (
        v.timeSlot.roundNumber === +input.roundNumber &&
        v.timeSlot.workshopId === input.workshopId
      );
    });

    if (!currentSlot) {
      throw new ActionError({
        code: "FORBIDDEN",
        message:
          "ผู้เข้าร่วมกิจกรรมนี้ไม่ได้ลงทะเบียนกิจกรรม Workshop ในรอบนี้ไว้",
      });
    }

    let staffId: Awaited<ReturnType<(typeof staffModel)["getStaffIdByUserId"]>>;

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
    // currentSlot.timeSlot.startTime is like 13:30
    // and currentSlot.timeSlot.date is a Date object
    // merge it to a single Date object
    if (!currentSlot.timeSlot.date) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ข้อมูลเวลาของกิจกรรมไม่ถูกต้อง (ไม่ได้ระบุวันที่)",
      });
    }

    try {
      const currentSlotStartTime = currentSlot.timeSlot.date;
      const [startHour, startMinute] = currentSlot.timeSlot.startTime
        .split(":")
        .map((v) => parseInt(v));
      currentSlotStartTime.setHours(startHour, startMinute, 0, 0);
      // do the same for end time
      const currentSlotEndTime = currentSlot.timeSlot.date;
      const [endHour, endMinute] = currentSlot.timeSlot.endTime
        .split(":")
        .map((v) => parseInt(v));
      currentSlotEndTime.setHours(endHour, endMinute, 0, 0);

      await checkinModel.addCheckinWorkshopForPreregisteredParticipant(
        ctx.locals.db,
        {
          participantId: participant.id,
          staffId: staffId,
          workshopId: input.workshopId,
          roundNumber: parseInt(input.roundNumber),
          data: {
            endTime: currentSlotStartTime.toISOString(),
            startTime: currentSlotEndTime.toISOString(),
            type: "workshop",
            workshopId: input.workshopId,
          },
        },
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถบันทึกข้อมูลการเข้าร่วมกิจกรรมได้",
      });
    }

    await sendEvent(ctx.locals.runtime.env.SSE, participant.id, {
      type: "workshop-checkin",
      workshopId: currentSlot.timeSlot.workshopId,
      roundNumber: currentSlot.timeSlot.roundNumber
    });
    
    return;
  },
});

export const staffRemoveCheckinWorkshopForPreregisteredParticipant =
  defineAction({
    input: z.object({
      participantIdOrQrCodeId: z.string(),
      workshopId: z.string(),
      roundNumber: z.string(),
    }),
    handler: async (input, ctx) => {
      if (!ctx.locals.user) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
        });
      }
      if (!hasOneOfRoleIn(ctx.locals.user, ["admin", "workshopStaff"])) {
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

      let userRegisteredSlots: Awaited<
        ReturnType<
          (typeof workshopModel)["getTimeSlotRegistrationForParticipant"]
        >
      >;

      try {
        userRegisteredSlots =
          await workshopModel.getTimeSlotRegistrationForParticipant(
            ctx.locals.db,
            participant.id,
          );
      } catch (err) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "ไม่สามารถเข้าถึงข้อมูลการลงทะเบียนกิจกรรมได้",
        });
      }

      const currentSlot = userRegisteredSlots.find((v) => {
        return (
          v.timeSlot.roundNumber === +input.roundNumber &&
          v.timeSlot.workshopId === input.workshopId
        );
      });

      if (!currentSlot) {
        throw new ActionError({
          code: "FORBIDDEN",
          message:
            "ผู้เข้าร่วมกิจกรรมนี้ไม่ได้ลงทะเบียนกิจกรรม Workshop ในรอบนี้ไว้",
        });
      }

      try {
        await checkinModel.removeCheckinWorkshopForPreregisteredParticipant(
          ctx.locals.db,
          {
            participantId: participant.id,
            workshopId: input.workshopId,
            roundNumber: parseInt(input.roundNumber),
          },
        );
      } catch (err) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "ไม่สามารถลบข้อมูลการเข้าร่วมกิจกรรมได้",
        });
      }

      return;
    },
  });

export const staffAddOnSiteCheckinParticipant = defineAction({
  input: z.object({
    participantIdOrQrCodeId: z.string(),
    workshopId: z.string(),
    roundNumber: z.string(),
  }),
  handler: async (input, ctx) => {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
      });
    }
    if (!hasOneOfRoleIn(ctx.locals.user, ["admin", "workshopStaff"])) {
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

    let staffId: Awaited<ReturnType<(typeof staffModel)["getStaffIdByUserId"]>>;
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

    let currentSlot: Awaited<
      ReturnType<(typeof workshopModel)["getWorkshopTimeSlotByRoundNumber"]>
    >;
    try {
      currentSlot = await workshopModel.getWorkshopTimeSlotByRoundNumber(
        ctx.locals.db,
        input.workshopId,
        parseInt(input.roundNumber),
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถเข้าถึงข้อมูลรอบการทำงานได้",
      });
    }

    if (!currentSlot) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "ไม่พบรอบการทำงาน",
      });
    }

    if (!currentSlot.date) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ข้อมูลเวลาของกิจกรรมไม่ถูกต้อง (ไม่ได้ระบุวันที่)",
      });
    }

    try {
      const currentSlotStartTime = currentSlot.date;
      const [startHour, startMinute] = currentSlot.startTime
        .split(":")
        .map((v) => parseInt(v));
      currentSlotStartTime.setHours(startHour, startMinute, 0, 0);
      // do the same for end time
      const currentSlotEndTime = currentSlot.date;
      const [endHour, endMinute] = currentSlot.endTime
        .split(":")
        .map((v) => parseInt(v));
      currentSlotEndTime.setHours(endHour, endMinute, 0, 0);

      await workshopModel.insertOnsiteWorkshopParticipant(
        ctx.locals.db,
        participant.id,
        currentSlot.id,
      );
      await checkinModel.addCheckinWorkshopForOnsiteParticipant(
        ctx.locals.db,
        participant.id,
        currentSlot.workshopId,
        currentSlot.roundNumber,
        {
          type: "workshop",
          workshopId: currentSlot.workshopId,
          startTime: currentSlotStartTime.toISOString(),
          endTime: currentSlotEndTime.toISOString(),
        },
      );
    } catch (err) {
      console.error(err);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถบันทึกข้อมูลการเข้าร่วมกิจกรรมได้",
      });
    }

    return;
  },
});

export const staffRemoveOnSiteCheckinParticipant = defineAction({
  input: z.object({
    participantIdOrQrCodeId: z.string(),
    workshopId: z.string(),
    roundNumber: z.string(),
  }),
  handler: async (input, ctx) => {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
      });
    }
    if (!hasOneOfRoleIn(ctx.locals.user, ["admin", "workshopStaff"])) {
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

    try {
      await workshopModel.removeOnsiteWorkshopParticipant(
        ctx.locals.db,
        participant.id,
        input.workshopId,
        parseInt(input.roundNumber),
      );
      await checkinModel.removeCheckinWorkshopForPreregisteredParticipant(
        ctx.locals.db,
        {
          participantId: participant.id,
          workshopId: input.workshopId,
          roundNumber: parseInt(input.roundNumber),
        },
      );
    } catch (err) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "ไม่สามารถลบข้อมูลการเข้าร่วมกิจกรรมได้",
      });
    }

    return;
  },
});
