import { schema, type Db } from "@src/db";
import { and, eq, isNull, or } from "drizzle-orm";
import type { CheckinWorkshopData } from "@src/type";

export const getCheckinByParticipant = async (
  db: Db,
  participantIdOrQrCodeId: string,
  checkpointId?: string | null,
) => {
  return db
    .select()
    .from(schema.checkins)
    .leftJoin(
      schema.participants,
      eq(schema.participants.id, schema.checkins.participantId),
    )
    .leftJoin(
      schema.checkpoints,
      eq(schema.checkpoints.id, schema.checkins.checkpointId),
    )
    .leftJoin(
      schema.staffs,
      eq(schema.staffs.id, schema.checkins.checkedByStaffId),
    )
    .where(
      and(
        isNull(schema.checkins.deletedAt),
        or(
          eq(schema.participants.id, participantIdOrQrCodeId),
          eq(schema.participants.qrCodeId, participantIdOrQrCodeId),
        ),
        ...(checkpointId ? [eq(schema.checkpoints.id, checkpointId)] : []),
      ),
    );
};

export const getCheckinByCheckpoint = async (db: Db, checkpointId: string) => {
  return db
    .select()
    .from(schema.checkins)
    .leftJoin(
      schema.participants,
      eq(schema.participants.id, schema.checkins.participantId),
    )
    .leftJoin(
      schema.checkpoints,
      eq(schema.checkpoints.id, schema.checkins.checkpointId),
    )
    .where(
      and(
        isNull(schema.checkins.deletedAt),
        eq(schema.checkpoints.id, checkpointId),
      ),
    );
};

export const getCheckinByParticipantAndCheckpoint = async (
  db: Db,
  participantIdOrQrCodeId: string,
  checkpointId: string,
) =>
  db
    .select()
    .from(schema.checkins)
    .leftJoin(
      schema.participants,
      eq(schema.participants.id, schema.checkins.participantId),
    )
    .leftJoin(
      schema.checkpoints,
      eq(schema.checkpoints.id, schema.checkins.checkpointId),
    )
    .where(
      and(
        isNull(schema.checkins.deletedAt),
        or(
          eq(schema.participants.id, participantIdOrQrCodeId),
          eq(schema.participants.qrCodeId, participantIdOrQrCodeId),
        ),
        eq(schema.checkpoints.id, checkpointId),
      ),
    );

export const getCheckinByStaff = async (
  db: Db,
  staffId: string,
  {
    limit = 10,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  },
) =>
  db
    .select()
    .from(schema.checkins)
    .leftJoin(
      schema.participants,
      eq(schema.participants.id, schema.checkins.participantId),
    )
    .leftJoin(
      schema.checkpoints,
      eq(schema.checkpoints.id, schema.checkins.checkpointId),
    )
    .where(
      and(
        isNull(schema.checkins.deletedAt),
        eq(schema.checkins.checkedByStaffId, staffId),
      ),
    )
    .limit(limit)
    .offset(offset);

export const getParticipantCheckinByType = async (
  db: Db,
  participantIdOrQrCodeId: string,
  type: NonNullable<(typeof schema.checkpoints.$inferSelect)["type"]>,
) => {
  return db
    .select()
    .from(schema.checkins)
    .leftJoin(
      schema.checkpoints,
      eq(schema.checkpoints.id, schema.checkins.checkpointId),
    )
    .leftJoin(
      schema.participants,
      eq(schema.participants.id, schema.checkins.participantId),
    )
    .where(
      and(
        isNull(schema.checkins.deletedAt),
        eq(schema.checkpoints.type, type),
        or(
          eq(schema.checkins.participantId, participantIdOrQrCodeId),
          eq(schema.participants.qrCodeId, participantIdOrQrCodeId),
        ),
      ),
    );
};

export const addCheckinForParticipant = async (
  db: Db,
  {
    participantId,
    staffId,
    checkpointId,
  }: {
    participantId: string;
    staffId: string;
    checkpointId: string;
  },
) => {
  const checkin = await db
    .insert(schema.checkins)
    .values([
      {
        checkedByStaffId: staffId,
        participantId,
        checkpointId,
      },
    ])
    .returning()
    .get();

  return checkin;
};

export const addCheckinWorkshopForPreregisteredParticipant = async (
  db: Db,
  {
    participantId,
    staffId,
    workshopId,
    roundNumber,
    data,
  }: {
    participantId: string;
    staffId: string;
    workshopId: string;
    roundNumber: number;
    data: CheckinWorkshopData;
  },
) => {
  const timeSlot = await db
    .select()
    .from(schema.workshopTimeSlots)
    .where(
      and(
        eq(schema.workshopTimeSlots.roundNumber, roundNumber),
        eq(schema.workshopTimeSlots.workshopId, workshopId),
      ),
    )
    .get();

  if (!timeSlot) {
    throw new Error("ไม่พบรอบกิจกรรม");
  }

  const currentDateTime = new Date();

  await db.insert(schema.checkins).values([
    {
      checkedByStaffId: staffId,
      participantId,
      checkpointId: `workshop-${workshopId}`,
      data: JSON.stringify(data),
      updatedAt: currentDateTime,
    },
  ]);

  await db
    .update(schema.workshopRegistrations)
    .set({
      participatedAt: currentDateTime,
    })
    .where(
      and(
        eq(schema.workshopRegistrations.participantId, participantId),
        eq(schema.workshopRegistrations.timeSlotId, timeSlot.id),
      ),
    );
};

export const removeCheckinWorkshopForPreregisteredParticipant = async (
  db: Db,
  {
    participantId,
    workshopId,
    roundNumber,
  }: {
    participantId: string;
    workshopId: string;
    roundNumber: number;
  },
) => {
  const timeSlot = await db
    .select()
    .from(schema.workshopTimeSlots)
    .where(
      and(
        eq(schema.workshopTimeSlots.roundNumber, roundNumber),
        eq(schema.workshopTimeSlots.workshopId, workshopId),
      ),
    )
    .get();

  if (!timeSlot) {
    throw new Error("ไม่พบรอบกิจกรรม");
  }

  const currentDateTime = new Date();

  await db
    .update(schema.checkins)
    .set({
      deletedAt: currentDateTime,
      updatedAt: currentDateTime,
    })
    .where(
      and(
        eq(schema.checkins.participantId, participantId),
        eq(schema.checkins.checkpointId, `workshop-${workshopId}`),
        isNull(schema.checkins.deletedAt),
      ),
    );

  await db
    .update(schema.workshopRegistrations)
    .set({
      participatedAt: null,
    })
    .where(
      and(
        eq(schema.workshopRegistrations.participantId, participantId),
        eq(schema.workshopRegistrations.timeSlotId, timeSlot.id),
      ),
    );
};

export const removeCheckinForParticipant = async (
  db: Db,
  {
    participantId,
    checkpointId,
  }: {
    participantId: string;
    checkpointId: string;
  },
) => {
  const currentDateTime = new Date();

  const checkin = await db
    .update(schema.checkins)
    .set({
      deletedAt: currentDateTime,
      updatedAt: currentDateTime,
    })
    .where(
      and(
        eq(schema.checkins.participantId, participantId),
        eq(schema.checkins.checkpointId, checkpointId),
        isNull(schema.checkins.deletedAt),
      ),
    )
    .returning()
    .get();

  if (!checkin) {
    throw new Error("ไม่พบข้อมูลการเข้าร่วมกิจกรรม");
  }

  return checkin;
};

export const addCheckinWorkshopForOnsiteParticipant = async (
  db: Db,
  participantId: string,
  workshopId: string,
  roundNumber: number,
  data: CheckinWorkshopData,
) => {
  const currentDateTime = new Date();

  const checkin = await db
    .insert(schema.checkins)
    .values([
      {
        checkedByStaffId: null,
        participantId,
        checkpointId: `workshop-${workshopId}`,
        data: JSON.stringify(data),
        updatedAt: currentDateTime,
      },
    ])
    .returning()
    .get();

  return checkin;
};

export const removeCheckinWorkshopForOnsiteParticipant = async (
  db: Db,
  {
    participantId,
    workshopId,
  }: {
    participantId: string;
    workshopId: string;
  },
) => {
  const currentDateTime = new Date();

  const checkin = await db
    .update(schema.checkins)
    .set({
      deletedAt: currentDateTime,
      updatedAt: currentDateTime,
    })
    .where(
      and(
        eq(schema.checkins.participantId, participantId),
        eq(schema.checkins.checkpointId, `workshop-${workshopId}`),
        isNull(schema.checkins.deletedAt),
      ),
    )
    .returning()
    .get();

  if (!checkin) {
    throw new Error("ไม่พบข้อมูลการเข้าร่วมกิจกรรม");
  }

  return checkin;
};
