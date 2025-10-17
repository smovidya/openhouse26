import { schema, type Db } from "@src/db";
import { eq } from "drizzle-orm";

export async function linkParticipantToUser(
  db: Db,
  participantId: string,
  userId: string,
) {
  return await db
    .update(schema.users)
    .set({
      participantAccountId: participantId,
    })
    .where(eq(schema.users.id, userId))
    .returning()
    .get();
}

export async function getUserByEmail(db: Db, email: string) {
  return await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .get();
}

export async function linkStaffToUser(db: Db, staffId: string, userId: string) {
  return await db
    .update(schema.users)
    .set({
      staffAccountId: staffId,
    })
    .where(eq(schema.users.id, userId))
    .returning()
    .get();
}
