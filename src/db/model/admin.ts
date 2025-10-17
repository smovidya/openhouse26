import { schema, type Db } from "@src/db";
import { like } from "drizzle-orm";

export const getStaffByEmail = async (db: Db, email: string) => {
  return db.query.staffs.findFirst({
    // search in substrings, we store as array-ish of emails :P
    where: like(schema.staffs.emails, `%"${email}"%`),
  });
};

export const addStaff = async (
  db: Db,
  data: typeof schema.staffs.$inferInsert,
) => {
  const emails = JSON.parse(data.emails) as string[];

  for (const email of emails) {
    const existingStaff = await getStaffByEmail(db, email);
    console.log("existingStaff", existingStaff);
    if (existingStaff) {
      throw new Error(`Staff with email ${email} already exists`);
    }
  }

  return await db
    .insert(schema.staffs)
    .values([
      {
        emails: JSON.stringify(emails),
        name: data.name,
        requestedRole: data.requestedRole,
        phone: data.phone,
        boothName: data.boothName,
        studentId: data.studentId,
      },
    ])
    .returning({
      id: schema.staffs.id,
    })
    .get();
};
