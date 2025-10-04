import { schema, type Db } from "@src/db";
import { eq } from "drizzle-orm";

export async function linkParticipantToUser(
  db: Db,
  participantId: string,
  userId: string
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
