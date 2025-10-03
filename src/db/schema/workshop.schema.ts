import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { participants } from "./participant.schema";

export const workshops = sqliteTable("workshop", {
  ...id,
  title: t.text().notNull(),
  hostDepartment: t.text().notNull(),
  hostDepartmentAbbr: t.text().notNull(),
  description: t.text().notNull(),
  image: t.text().notNull(),
  capacity: t.int().notNull(),
  ...timestamps,
});

export const workshopTimeSlots = sqliteTable("workshop_time_slot", {
  ...id,
  startTime: t.text().notNull(),
  endTime: t.text().notNull(),
  date: t.int({
    mode: "timestamp",
  }),
});

export const workshopRelations = relations(workshops, ({ many }) => ({
  timeSlots: many(workshopTimeSlots),
}));

export const workshopTimeSlotRelations = relations(
  workshopTimeSlots,
  ({ one, many }) => ({
    workshop: one(workshops, {
      fields: [workshopTimeSlots.id],
      references: [workshops.id],
    }),
    participants: many(participants),
  })
);

// Workshop Registration Table
export const workshopRegistrations = sqliteTable("workshop_registration", {
  ...id,
  participantId: t.text().notNull(),
  timeSlotId: t.text().notNull(),
  registrationType: t.text().notNull(), // e.g., "pre-registration", "on-site"
  ...timestamps,
});

export const workshopRegistrationsRelations = relations(
  workshopRegistrations,
  ({ one }) => ({
    participant: one(participants, {
      fields: [workshopRegistrations.participantId],
      references: [participants.id],
    }),
    timeSlot: one(workshopTimeSlots, {
      fields: [workshopRegistrations.timeSlotId],
      references: [workshopTimeSlots.id],
    }),
  })
);
