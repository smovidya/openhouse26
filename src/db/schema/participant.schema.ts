import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { users } from "./auth.schema";
import { relations } from "drizzle-orm";
import { workshopRegistrations } from "./workshop.schema";
import { init } from "@paralleldrive/cuid2";

const createId = init({
  length: 5,
});

export const participants = sqliteTable(
  "participants",
  {
    ...id,
    userId: t
      .text("user_id")
      .notNull()
      .references(() => users.id),
    qrCodeId: t.text("qr_code_id").$defaultFn(() => createId()),
    givenName: t.text("given_name").notNull(),
    familyName: t.text("family_name").notNull(),
    age: t.int("age").notNull(),
    specialNeeds: t.text("special_needs").notNull(),
    residentProvince: t.text("resident_province").notNull(),
    attendeeType: t.text("attendee_type").notNull(),
    school: t.text("school"),
    questions: t.text("questions"), // Serialized JSON string for analytical questions
    // emergencyContactName: t.text("emergency_contact_name"),
    // emergencyContactPhone: t.text("emergency_contact_phone"),
    // emergencyContactRelation: t.text("emergency_contact_relation"),
    ...timestamps,
  },
  (table) => [
    t.index("qr_code_id_idx").on(table.qrCodeId),
    t.index("user_id_idx").on(table.userId),
  ],
);

export const participantsRelations = relations(
  participants,
  ({ one, many }) => ({
    user: one(users, {
      fields: [participants.userId],
      references: [users.id],
    }),
    workshopRegistrations: many(workshopRegistrations),
  }),
);
