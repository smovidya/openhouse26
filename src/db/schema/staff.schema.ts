import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { participants } from "./participant.schema";

export const staff = sqliteTable("staff", {
  ...id,
  studentId: t.text().notNull().unique(),
  name: t.text().notNull(),
  email: t.text().notNull(),
  major: t.text().notNull(),
  phone: t.text(),
  lineId: t.text(),
  requestedRole: t.text().notNull(),
  ...timestamps,
});
