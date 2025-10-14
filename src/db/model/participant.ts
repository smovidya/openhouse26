import { schema, type Db } from "@src/db";
import { eq, or } from "drizzle-orm";

export async function getParticipantByUserId(db: Db, userId: string) {
  return await db
    .select()
    .from(schema.participants)
    .where(eq(schema.participants.userId, userId))
    .get();
}

export async function getParticipantByIdOrQrCodeId(
  db: Db,
  participantIdOrQrCodeId: string,
) {
  const participant = await db.query.participants.findFirst({
    where: or(
      eq(schema.participants.id, participantIdOrQrCodeId),
      eq(schema.participants.qrCodeId, participantIdOrQrCodeId),
    ),
  });

  return participant;
}

export async function insertParticipant(
  db: Db,
  data: typeof schema.participants.$inferInsert,
) {
  return await db
    .insert(schema.participants)
    .values(data)
    .returning({
      id: schema.participants.id,
    })
    .get();
}
