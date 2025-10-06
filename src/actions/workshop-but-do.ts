import { participantModel, workshopModel } from "@src/db";
import type { WorkshopRegistrationHandler } from "@src/workers";
import { z } from "astro/zod";
import { ActionError, defineAction, type ActionAPIContext } from "astro:actions";

export const getHandler = (context: ActionAPIContext) => context.locals.runtime.env.WORKSHOP_REGISTRATION_HANDLER.getByName("default") as DurableObjectStub<WorkshopRegistrationHandler>;

export async function getParticipant(ctx: ActionAPIContext) {
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
      ctx.locals.user.id
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

  return participant;
}

async function getWorkshop(ctx: ActionAPIContext, workshopId: string) {
  let workshop: Awaited<ReturnType<typeof workshopModel.getWorkshop>>;

  try {
    workshop = await workshopModel.getWorkshop(
      ctx.locals.db,
      workshopId
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

  return workshop;
}

export const registerMeToSlot2 = defineAction({
  input: z.object({
    workshopId: z.string(),
    roundNumber: z.number(),
  }),
  async handler(input, context) {
    const handler = getHandler(context);
    const participant = await getParticipant(context);
    const workshop = await getWorkshop(context, input.workshopId);

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


    const status = await handler.setRegistration(participant.id, input.workshopId, input.roundNumber);

    if (status === "maximum-workshop-reached") {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "คุณลงทะเบียนเวิร์กช็อปครบจำนวนสูงสุดแล้ว (2 รอบ) ลองยกเลิกบางรอบเพื่อเปลี่ยนแปลง",
      });
    }

    if (status === "workshop-full") {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: `ขออภัย รอบที่คุณเลือกเต็มแล้ว (จำนวนสูงสุด ${workshop.capacity} คนต่อรอบ) กรุณาเลือกเวิร์กช็อปรอบอื่น`,
      });
    }

    if (status === "collided") {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: `เวลาของเวิร์กช็อปนี้ทับซ้อนกับเวิร์กช็อปอื่นที่คุณลงทะเบียนไว้ กรุณาเลือกเวลาที่ไม่ทับซ้อนกันและห่างกันอย่างน้อย 60 นาที`,
      });
    }

    if (status === "not-exist") {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "ไม่พบรอบที่ระบุ กรุณาลองใหม่อีกครั้ง",
      });
    }

    return {
      success: true,
      data: {
        updatedWorkshopCounts: status,
      },
    };
  },
});


export const removeMeFromSlot2 = defineAction({
  input: z.object({
    workshopId: z.string(),
  }),
  async handler(input, context) {
    const handler = getHandler(context);
    const participant = await getParticipant(context);
    const workshop = await getWorkshop(context, input.workshopId);

    const status = await handler.removeRegistration(participant.id, workshop.id);

    return {
      success: true,
      data: {
        updatedWorkshopCounts: status,
      },
    };
  },
});
