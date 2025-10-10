import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { participants } from "./participant.schema";

export const workshops = sqliteTable("workshops", {
  ...id,
  title: t.text("title").notNull(),
  hostDepartment: t.text("host_department").notNull(),
  hostDepartmentAbbr: t.text("host_department_abbr").notNull(),
  description: t.text("description").notNull(),
  image: t.text("image").notNull(),
  capacity: t.int("capacity").notNull(),
  ...timestamps,
});

export const workshopRelations = relations(workshops, ({ many }) => ({
  timeSlots: many(workshopTimeSlots),
}));

export const workshopTimeSlots = sqliteTable("workshop_time_slots", {
  ...id,
  workshopId: t
    .text("workshop_id")
    .notNull()
    .references(() => workshops.id),
  roundNumber: t.int("round_number").notNull(),
  startTime: t.text("start_time").notNull(),
  endTime: t.text("end_time").notNull(),
  date: t.int("date", {
    mode: "timestamp",
  }),
});

export const workshopTimeSlotRelations = relations(
  workshopTimeSlots,
  ({ one, many }) => ({
    workshop: one(workshops, {
      fields: [workshopTimeSlots.workshopId],
      references: [workshops.id],
    }),
    registrations: many(workshopRegistrations),
  })
);

// Workshop Registration Table
export const workshopRegistrations = sqliteTable("workshop_registrations", {
  ...id,
  participantId: t
    .text("participant_id")
    .notNull()
    .references(() => participants.id),
  timeSlotId: t
    .text("time_slot_id")
    .notNull()
    .references(() => workshopTimeSlots.id),
  registrationType: t
    .text("registration_type", {
      enum: ["pre-registration", "on-site"],
    })
    .notNull(),
  participatedAt: t.integer("participated_at", { mode: "timestamp" }),
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
