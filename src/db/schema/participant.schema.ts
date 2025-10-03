import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { users } from "./auth.schema";
import { relations } from "drizzle-orm";

export const participants = sqliteTable("participant", {
  ...id,
  userId: t.text().notNull(),
  givenName: t.text().notNull(),
  familyName: t.text().notNull(),
  ags: t.int().notNull(),
  specialNeed: t.text().notNull(),
  residentProvince: t.text().notNull(),
  attendeeType: t.text().notNull(),
  school: t.text(),
  questions: t.text(), // Serialized JSON string for analytical questions
  emergencyContactName: t.text(),
  emergencyContactPhone: t.text(),
  emergencyContactRelation: t.text(),
  ...timestamps,
});

export const participantToUserRelations = relations(
  participants,
  ({ one }) => ({
    user: one(users, {
      fields: [participants.id],
      references: [users.id],
    }),
  })
);
