import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { participantModel, workshopModel } from "@src/db";
import { Time, TimeSlot } from "@src/data/workshops";
import { featureFlags } from "@src/data/constants";
import { hasOneOfRoleIn } from "@src/auth/utils";

export const myCurrentRegistrationsForWorkshop = defineAction({
  input: z.object({ workshopId: z.string() }),
  async handler(input, ctx) {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถดูการลงทะเบียนเวิร์กช็อปได้",
      });
    }

    let registrations: Awaited<
      ReturnType<typeof workshopModel.getUserRegisteredSlots>
    >;

    try {
      registrations = await workshopModel.getUserRegisteredSlots(
        ctx.locals.db,
        ctx.locals.user.id,
      );
    } catch (e) {
      console.error("Error fetching registrations:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะดึงข้อมูลการลงทะเบียน กรุณาลองใหม่อีกครั้ง",
      });
    }

    let registeredParticipantsCount: Awaited<
      ReturnType<typeof workshopModel.getRegisteredParticipantCount>
    >;

    try {
      registeredParticipantsCount =
        await workshopModel.getRegisteredParticipantCount(
          ctx.locals.db,
          input.workshopId,
        );
    } catch (e) {
      console.error("Error counting registrations:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะดึงข้อมูลเวิร์กช็อป กรุณาลองใหม่อีกครั้ง",
      });
    }

    return {
      registrations,
      registeredParticipantsCount,
    };
  },
});

export const registerMeToSlot = defineAction({
  input: z.object({
    workshopId: z.string(),
    roundNumber: z.number(),
  }),
  async handler(input, ctx) {
    if (featureFlags.workshopRegistrationClosed)
      throw new ActionError({
        code: "FORBIDDEN",
        message: "ขออภัย ปิดการลงทะเบียนหรือแก้ไขเวิร์กช็อปแล้ว",
      });
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถลงทะเบียนเวิร์กช็อปได้",
      });
    }

    let participant: Awaited<
      ReturnType<typeof participantModel.getParticipantByUserId>
    >;

    try {
      participant = await participantModel.getParticipantByUserId(
        ctx.locals.db,
        ctx.locals.user.id,
      );
    } catch (e) {
      console.error("Error fetching participant:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะดึงข้อมูลผู้เข้าร่วม กรุณาลองใหม่อีกครั้ง",
      });
    }

    if (!participant) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ไม่พบข้อมูลผู้เข้าร่วม กรุณาลงทะเบียนเข้าร่วมงานก่อน",
      });
    }

    let workshop: Awaited<ReturnType<typeof workshopModel.getWorkshop>>;

    try {
      workshop = await workshopModel.getWorkshop(
        ctx.locals.db,
        input.workshopId,
      );
    } catch (e) {
      console.error("Error fetching workshop:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะดึงข้อมูลเวิร์กช็อป กรุณาลองใหม่อีกครั้ง",
      });
    }

    if (!workshop) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ไม่พบเวิร์กช็อปที่ระบุ กรุณาลองใหม่อีกครั้ง",
      });
    }

    if (
      workshop.timeSlots
        .map((v) => v.roundNumber)
        .indexOf(input.roundNumber) === -1
    ) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ไม่พบรอบที่ระบุ กรุณาลองใหม่อีกครั้ง",
      });
    }

    let myRegistrations: Awaited<
      ReturnType<typeof workshopModel.getTimeSlotRegistrationForParticipant>
    >;

    try {
      myRegistrations =
        await workshopModel.getTimeSlotRegistrationForParticipant(
          ctx.locals.db,
          participant.id,
        );
    } catch (e) {
      console.error("Error fetching my registrations:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "เกิดข้อผิดพลาดขณะดึงข้อมูลการลงทะเบียนของคุณ กรุณาลองใหม่อีกครั้ง",
      });
    }

    // Check if the current user has already registered for the current workshop by same department
    if (
      myRegistrations.find((reg) => reg.timeSlot.workshopId === workshop.id) !==
      undefined
    ) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message:
          "คุณได้ลงทะเบียนเวิร์กช็อปนี้ไปแล้วในรอบอื่น ไม่สามารถลงทะเบียนซ้ำได้ กดที่เวลาที่คุณลงทะเบียนไว้เพื่อยกเลิกการลงทะเบียนก่อนแล้วค่อยลงทะเบียนใหม่",
      });
    }

    // User need to explicitly remove old registration before adding new one or change the round
    if (myRegistrations.length >= 2) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message:
          "คุณลงทะเบียนเวิร์กช็อปครบจำนวนสูงสุดแล้ว (2 รอบ) กดยกเลิกอันเก่าก่อนแล้วค่อยลงทะเบียนใหม่",
      });
    }

    // Check if the slot start or end time is colliding with other registered slots
    const selectedSlot = workshop.timeSlots.find(
      (slot) => slot.roundNumber === input.roundNumber,
    );

    if (!selectedSlot || !selectedSlot.date) {
      // Actually should not happen because of previous checks, but just in case
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ไม่พบรอบที่ระบุ กรุณาลองใหม่อีกครั้ง",
      });
    }

    const selectedSlotTimeSlot = new TimeSlot({
      round: selectedSlot.roundNumber,
      date: selectedSlot.date,
      start: Time.fromString(selectedSlot.startTime),
      end: Time.fromString(selectedSlot.endTime),
    });

    for (const reg of myRegistrations) {
      const otherTimeSlot = new TimeSlot({
        round: reg.timeSlot.roundNumber,
        date: reg.timeSlot.date!,
        start: Time.fromString(reg.timeSlot.startTime),
        end: Time.fromString(reg.timeSlot.endTime),
      });

      if (selectedSlotTimeSlot.isIn1Hour(otherTimeSlot)) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `เวลาของเวิร์กช็อปนี้ (${selectedSlotTimeSlot.start.toString()} - ${selectedSlotTimeSlot.end.toString()}) ทับซ้อนกับเวลาที่คุณลงทะเบียนไว้ (${otherTimeSlot.start.toString()} - ${otherTimeSlot.end.toString()}) กรุณาเลือกเวลาที่ไม่ทับซ้อนกัน และห่างกันอย่างน้อย 60 นาที`,
        });
      }
    }

    // and That's al good! Wait! What about capacity?
    //
    let currentRegistrationCount: Awaited<
      ReturnType<typeof workshopModel.getRegisteredParticipantCount>
    >;

    try {
      currentRegistrationCount =
        await workshopModel.getRegisteredParticipantCount(
          ctx.locals.db,
          workshop.id,
        );
    } catch (e) {
      console.error("Error counting current registrations:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "เกิดข้อผิดพลาดขณะตรวจสอบจำนวนผู้ลงทะเบียน กรุณาลองใหม่อีกครั้ง",
      });
    }

    const currentTimeSlotCount = currentRegistrationCount.find(
      (count, index) =>
        workshop.timeSlots[index].roundNumber === input.roundNumber,
    )!;

    if (currentTimeSlotCount.count >= workshop.capacity) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: `ขออภัย รอบที่คุณเลือกเต็มแล้ว (จำนวนสูงสุด ${workshop.capacity} คนต่อรอบ) กรุณาเลือกเวิร์กช็อปรอบอื่น`,
      });
    }

    // All good, let's insert the registration
    try {
      await workshopModel.insertNewTimeSlotRegistration(
        ctx.locals.db,
        participant.id,
        workshop.id,
        selectedSlot.roundNumber,
        "pre-registration",
      );
    } catch (e) {
      console.error("Error inserting registration:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะลงทะเบียน กรุณาลองใหม่อีกครั้ง",
      });
    }

    let updatedWorkshopCounts: Awaited<
      ReturnType<typeof workshopModel.getRegisteredParticipantCount>
    >;

    try {
      updatedWorkshopCounts = await workshopModel.getRegisteredParticipantCount(
        ctx.locals.db,
        workshop.id,
      );
    } catch (e) {
      console.error("Error counting updated registrations:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะดึงข้อมูลเวิร์กช็อป กรุณาลองใหม่อีกครั้ง",
      });
    }

    return {
      success: true,
      data: {
        updatedWorkshopCounts,
      },
    };
  },
});

export const removeMeFromSlot = defineAction({
  input: z.object({
    workshopId: z.string(),
  }),
  async handler(input, ctx) {
    if (featureFlags.workshopRegistrationClosed)
      throw new ActionError({
        code: "FORBIDDEN",
        message: "ขออภัย ปิดการลงทะเบียนหรือแก้ไขเวิร์กช็อปแล้ว",
      });
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message:
          "คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถยกเลิกการลงทะเบียนเวิร์กช็อปได้",
      });
    }

    let participant: Awaited<
      ReturnType<typeof participantModel.getParticipantByUserId>
    >;

    try {
      participant = await participantModel.getParticipantByUserId(
        ctx.locals.db,
        ctx.locals.user.id,
      );
    } catch (e) {
      console.error("Error fetching participant:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะดึงข้อมูลผู้เข้าร่วม กรุณาลองใหม่อีกครั้ง",
      });
    }

    if (!participant) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ไม่พบข้อมูลผู้เข้าร่วม กรุณาลงทะเบียนเข้าร่วมงานก่อน",
      });
    }

    let workshop: Awaited<ReturnType<typeof workshopModel.getWorkshop>>;

    try {
      workshop = await workshopModel.getWorkshop(
        ctx.locals.db,
        input.workshopId,
      );
    } catch (e) {
      console.error("Error fetching workshop:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะดึงข้อมูลเวิร์กช็อป กรุณาลองใหม่อีกครั้ง",
      });
    }

    if (!workshop) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ไม่พบเวิร์กช็อปที่ระบุ กรุณาลองใหม่อีกครั้ง",
      });
    }

    let myRegistrations: Awaited<
      ReturnType<typeof workshopModel.getTimeSlotRegistrationForParticipant>
    >;

    try {
      myRegistrations =
        await workshopModel.getTimeSlotRegistrationForParticipant(
          ctx.locals.db,
          participant.id,
        );
    } catch (e) {
      console.error("Error fetching my registrations:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "เกิดข้อผิดพลาดขณะดึงข้อมูลการลงทะเบียนของคุณ กรุณาลองใหม่อีกครั้ง",
      });
    }

    try {
      await workshopModel.deleteTimeSlotRegistrationByWorkshopId(
        ctx.locals.db,
        participant.id,
        workshop.id,
      );
    } catch (e) {
      console.error("Error deleting registration:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะยกเลิกการลงทะเบียน กรุณาลองใหม่อีกครั้ง",
      });
    }

    let updatedWorkshopCounts: Awaited<
      ReturnType<typeof workshopModel.getRegisteredParticipantCount>
    >;

    try {
      updatedWorkshopCounts = await workshopModel.getRegisteredParticipantCount(
        ctx.locals.db,
        workshop.id,
      );
    } catch (e) {
      console.error("Error counting updated registrations:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะดึงข้อมูลเวิร์กช็อป กรุณาลองใหม่อีกครั้ง",
      });
    }

    return {
      success: true,
      data: {
        updatedWorkshopCounts,
      },
    };
  },
});

export const getWorkshopRegistrationByWorkshop = defineAction({
  input: z.object({
    workshopId: z.string(),
    workshopRoundNumber: z.number(),
  }),
  handler: async (input, ctx) => {
    if (!ctx.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถดูข้อมูลการลงทะเบียนได้",
      });
    }

    if (!hasOneOfRoleIn(ctx.locals.user, ["admin", "workshopStaff"])) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้",
      });
    }

    let workshopSlot: Awaited<
      ReturnType<(typeof workshopModel)["getWorkshopTimeSlotByRoundNumber"]>
    >;

    try {
      workshopSlot = await workshopModel.getWorkshopTimeSlotByRoundNumber(
        ctx.locals.db,
        input.workshopId,
        input.workshopRoundNumber,
      );
    } catch (e) {
      console.error("Error fetching workshop:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะดึงข้อมูลเวิร์กช็อป กรุณาลองใหม่อีกครั้ง",
      });
    }

    if (!workshopSlot) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ไม่พบรอบของเวิร์กช็อปที่ระบุ กรุณาลองใหม่อีกครั้ง",
      });
    }

    let registrations: Awaited<
      ReturnType<(typeof workshopModel)["getParticipantsForTimeSlot"]>
    >;

    try {
      registrations = await workshopModel.getParticipantsForTimeSlot(
        ctx.locals.db,
        workshopSlot.id,
      );
    } catch (e) {
      console.error("Error fetching registrations:", e);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดขณะดึงข้อมูลการลงทะเบียน กรุณาลองใหม่อีกครั้ง",
      });
    }

    return { registrations, workshopSlot };
  },
});
