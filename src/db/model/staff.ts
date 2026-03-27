import type { Db } from "..";
import { users } from "../schema/auth.schema";
import { staffs } from "../schema/staff.schema";
import { eq } from "drizzle-orm";

export const addStaff = async (
  db: Db,
  {
    name,
    studentId,
    emails,
    phone,
    booth,
    roles,
  }: {
    name: string;
    studentId: string;
    emails: string;
    phone: string;
    booth: string;
    roles: string;
  },
) => {
  const trimmedEmails = emails
    .split("\n")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  const normalizedRoles = roles
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean)
    .join(",");

  return await db
    .insert(staffs)
    .values(
      trimmedEmails.map((email) => ({
        boothName: booth,
        emails: email,
        name,
        studentId,
        phone,
        requestedRole: normalizedRoles,
      })),
    )
    .returning()
    .get();
};

export const getStaffByEmail = (db: Db, email: string) =>
  db.select().from(staffs).where(eq(staffs.emails, email)).get();

export const listStaffs = (db: Db) => db.select().from(staffs).all();

export const linkStaffToUser = async (
  db: Db,
  userId: string,
  staffId: string,
) => db.update(users).set({ staffId }).where(eq(users.id, userId)).run();
