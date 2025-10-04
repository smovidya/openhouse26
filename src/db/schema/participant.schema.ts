import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { users } from "./auth.schema";
import { relations } from "drizzle-orm";
import { workshopRegistrations } from "./workshop.schema";

export const participants = sqliteTable("participants", {
  ...id,
  userId: t
    .text("user_id")
    .notNull()
    .references(() => users.id),
  givenName: t.text("given_name").notNull(),
  familyName: t.text("family_name").notNull(),
  age: t.int("age").notNull(),
  specialNeeds: t.text("special_needs").notNull(),
  residentProvince: t.text("resident_province").notNull(),
  attendeeType: t.text("attendee_type").notNull(),
  school: t.text("school"),
  questions: t.text("questions"), // Serialized JSON string for analytical questions
  emergencyContactName: t.text("emergency_contact_name"),
  emergencyContactPhone: t.text("emergency_contact_phone"),
  emergencyContactRelation: t.text("emergency_contact_relation"),
  qrId: t.text("qr_id"),
  ...timestamps,
});

export const participantsRelations = relations(
  participants,
  ({ one, many }) => ({
    user: one(users, {
      fields: [participants.userId],
      references: [users.id],
    }),
    workshopRegistrations: many(workshopRegistrations, {
      relationName: "participant_workshop_registrations",
    }),
  })
);
