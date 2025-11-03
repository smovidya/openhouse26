import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { participants } from "./participant.schema";
import { customAlphabet } from "nanoid";

const createId = customAlphabet(
  "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  8,
);

export const surveys = sqliteTable("surveys", {
  ...id,
  participantId: t.text("participant_id").notNull(),
  responses: t
    .text("responses", {
      mode: "json",
    })
    .notNull(),
  isNameConfirmed: t
    .int("is_name_confirmed", {
      mode: "boolean",
    })
    .notNull()
    .default(false),
  nameInCert: t.text("name_in_cert"),
  certId: t
    .text("cert_id")
    .unique()
    .$defaultFn(() => createId())
    .notNull(),
  ...timestamps,
});

export const surveyRelations = relations(surveys, ({ one }) => ({
  participant: one(participants, {
    fields: [surveys.participantId],
    references: [participants.id],
  }),
}));
