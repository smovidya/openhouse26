import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";

export const staffs = sqliteTable("staffs", {
  ...id,
  studentId: t.text("student_id"),
  name: t.text("name").notNull(),
  email: t.text("email").notNull(),
  major: t.text("major").notNull(),
  phone: t.text("phone").notNull(),
  requestedRole: t.text("requested_role").notNull(),
  ...timestamps,
});

export const staffRelations = relations(staffs, ({ many }) => ({
  users: many(users),
}));
