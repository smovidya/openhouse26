import { schema, type Db } from "@src/db";
import { like } from "drizzle-orm";

export const getStaffByEmail = async (db: Db, email: string) => {
  return db.query.staffs.findFirst({
    // search in substrings, we store as array-ish of emails :P
    where: like(schema.staffs.email, `%${email}%`),
  });
};

export const addStaff = async (
  db: Db,
  data: typeof schema.staffs.$inferInsert,
) => {
  for (const email of data.email) {
    const existingStaff = await getStaffByEmail(db, email);
    if (existingStaff) {
      throw new Error(`Staff with email ${email} already exists`);
    }
  }

  return await db
    .insert(schema.staffs)
    .values([data])
    .returning({
      id: schema.staffs.id,
    })
    .get();
};
