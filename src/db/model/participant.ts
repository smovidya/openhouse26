import { schema, type Db } from "@src/db";
import { eq } from "drizzle-orm";

export async function getParticipantByUserId(db: Db, userId: string) {
  return await db
    .select()
    .from(schema.participants)
    .where(eq(schema.participants.userId, userId))
    .get();
}

export async function insertParticipant(
  db: Db,
  data: typeof schema.participants.$inferInsert
) {
  return await db
    .insert(schema.participants)
    .values(data)
    .returning({
      id: schema.participants.id,
    })
    .get();
}
