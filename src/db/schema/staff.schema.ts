import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";

export const staffs = sqliteTable("staffs", {
  ...id,
  userId: t.text("user_id").references(() => users.id),
  studentId: t.text("student_id").notNull().unique(),
  name: t.text("name").notNull(),
  email: t.text("email").notNull(),
  major: t.text("major").notNull(),
  phone: t.text("phone").notNull(),
  lineId: t.text("line_id").notNull(),
  requestedRole: t.text("requested_role").notNull(),
  ...timestamps,
});

export const staffRelations = relations(staffs, ({ one }) => ({
  user: one(users),
}));
