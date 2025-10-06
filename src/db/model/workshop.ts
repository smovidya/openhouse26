import type { SelectedWorkshop } from "@src/client/shared-state.svelte";
import { participantModel, schema, type Db } from "@src/db";
import { and, asc, count, eq, inArray } from "drizzle-orm";
import { workshops } from "@src/data/workshops";

export async function insertNewTimeSlotRegistration(
  db: Db,
  participantId: string,
  workshopId: string,
  roundNumber: number,
  registrationType: "pre-registration" | "onsite"
) {
  return await db.transaction(async (tx) => {
    const timeSlot = await tx.query.workshopTimeSlots.findFirst({
      where: and(
        eq(schema.workshopTimeSlots.workshopId, workshopId),
        eq(schema.workshopTimeSlots.roundNumber, roundNumber)
      ),
      columns: {
        id: true,
      },
      with: {
        workshop: true,
      },
    });

    if (!timeSlot) {
      tx.rollback();
      throw new Error("ไม่พบช่วงเวลาที่ระบุ กรุณาลองใหม่อีกครั้ง");
    }

    const currentRegistered = await tx
      .select({
        count: count(),
      })
      .from(schema.workshopRegistrations)
      .where(eq(schema.workshopRegistrations.timeSlotId, timeSlot.id))
      .groupBy(schema.workshopRegistrations.timeSlotId)
      .get();

    if (
      !currentRegistered ||
      currentRegistered.count >= timeSlot.workshop.capacity
    ) {
      tx.rollback();
      throw new Error("ช่วงเวลานี้เต็มแล้ว กรุณาเลือกช่วงเวลาอื่น");
    }

    await tx.insert(schema.workshopRegistrations).values({
      participantId: participantId,
      timeSlotId: timeSlot.id,
      registrationType: registrationType,
    });
  });
}

export async function deleteTimeSlotRegistration(
  db: Db,
  registrationId: string
) {
  return await db
    .delete(schema.workshopRegistrations)
    .where(eq(schema.workshopRegistrations.id, registrationId))
    .run();
}

export async function deleteTimeSlotRegistrationByWorkshopId(
  db: Db,
  participantId: string,
  workshopId: string
) {
  const registeredTimeSlot = await db.query.workshopTimeSlots.findMany({
    where: eq(schema.workshopTimeSlots.workshopId, workshopId),
  });

  return await db.delete(schema.workshopRegistrations).where(
    and(
      eq(schema.workshopRegistrations.participantId, participantId),
      inArray(
        schema.workshopRegistrations.timeSlotId,
        registeredTimeSlot.map((t) => t.id)
      )
    )
  );
}

export async function getWorkshop(db: Db, workshopId: string) {
  return await db.query.workshops.findFirst({
    where: eq(schema.workshops.id, workshopId),
    with: {
      timeSlots: true,
    },
  });
}

export async function getUserRegisteredSlots(
  db: Db,
  userId: string
): Promise<SelectedWorkshop[]> {
  const participant = await participantModel.getParticipantByUserId(db, userId);
  if (!participant) {
    return [];
  }
  const registrations = await db.query.workshopRegistrations.findMany({
    where: eq(schema.workshopRegistrations.participantId, participant.id),
    columns: {
      id: true,
    },
    with: {
      timeSlot: {
        columns: {
          id: true,
          roundNumber: true,
          workshopId: true,
        },
      },
    },
  });

  return registrations.map((reg) => {
    const workshop = workshops.find((w) => w.id === reg.timeSlot.workshopId);
    if (!workshop) {
      throw new Error("Invalid workshop id in registration");
    }

    const slotIndex = workshop?.slots.findIndex(
      (t) => t.round === reg.timeSlot.roundNumber
    );

    if (slotIndex === -1) {
      throw new Error("Invalid time slot in registration");
    }

    return {
      workshopId: reg.timeSlot.workshopId,
      timeSlotIndex: slotIndex,
    };
  });
}

export async function getRegisteredParticipantCount(
  db: Db,
  workshopId: string
) {
  const timeSlots = await db.query.workshopTimeSlots.findMany({
    where: eq(schema.workshopTimeSlots.workshopId, workshopId),
    columns: {
      id: true,
      roundNumber: true,
      date: true,
      startTime: true,
      endTime: true,
    },
    with: {
      registrations: {
        columns: {
          id: true,
        },
      },
    },
    orderBy: (ws) => [asc(ws.roundNumber)],
  });

  return timeSlots.map((slot) => slot.registrations.length);
}

export async function getRegisteredParticipantCountForTimeSlot(
  db: Db,
  timeSlotId: string
) {
  const result = await db
    .select({
      count: count(),
    })
    .from(schema.workshopRegistrations)
    .where(eq(schema.workshopRegistrations.timeSlotId, timeSlotId))
    .groupBy(schema.workshopRegistrations.timeSlotId)
    .get();

  return result ? result.count : 0;
}

export async function getTimeSlotRegistrationForParticipant(
  db: Db,
  participantId: string
) {
  return await db.query.workshopRegistrations.findMany({
    where: eq(schema.workshopRegistrations.participantId, participantId),
    with: {
      timeSlot: {
        columns: {
          roundNumber: true,
          date: true,
          startTime: true,
          endTime: true,
          workshopId: true,
        },
        with: {
          workshop: {
            columns: {
              title: true,
            },
          },
        },
      },
    },
  });
}

export async function setSelectedWorkshopTimeSlots(
  workshopId: string,
  timeSlotIndex: number | undefined
) {
  // ถ้ามีเคยเลือกของ workshopId เดียวกัน ให้ลบของเก่า แล้วเปลี่ยนเป็น timeSlotIndex ที่ pass มา
  // ถ้า pass undefined มาให้ลบอย่างเดียว
  // อย่าเช็ค if (timeSlotIndex) pls do  if (timeSlotIndex === undefined)
}
