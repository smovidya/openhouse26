import { schema, type Db } from "@src/db";
import { eq } from "drizzle-orm";

export const getStaffIdByUserId = async (db: Db, userId: string) => {
  const staffId = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    with: {
      staffAccount: true,
    },
  });

  return staffId?.staffAccount?.id;
};
