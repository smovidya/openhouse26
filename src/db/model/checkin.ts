import { checkinModel, schema, type Db } from "@src/db";
import { and, eq, isNull, or } from "drizzle-orm";
import { getParticipantByIdOrQrCodeId } from "./participant";

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

export const getCheckinByParticipantAndWorkshop = async (
  db: Db,
  participantIdOrQrCodeId: string,
  workshopId: string,
  roundId: string
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
    // MARKER(ptsgrn): fix here
    .where(
      and(
        isNull(schema.checkins.deletedAt),
        or(
          eq(schema.participants.id, participantIdOrQrCodeId),
          eq(schema.participants.qrCodeId, participantIdOrQrCodeId),
        ),
        eq(schema.checkpoints., workshopId),
        eq(schema.checkpoints.roundId, roundId)
      ),
    );
}