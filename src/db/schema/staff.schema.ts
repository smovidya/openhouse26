import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";
import { checkins } from "./checkpoint.schema";

export const staffs = sqliteTable("staffs", {
  ...id,
  studentId: t.text("student_id"),
  name: t.text("name").notNull(),
  emails: t.text("emails").notNull(),
  boothName: t.text("booth_name"),
  phone: t.text("phone").notNull(),
  requestedRole: t.text("requested_role").notNull(),
  ...timestamps,
});

export const staffRelations = relations(staffs, ({ many }) => ({
  users: many(users),
  checkins: many(checkins),
}));
