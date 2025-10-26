import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { participants } from "./participant.schema";

export const surveys = sqliteTable("surveys", {
  ...id,
  participantId: t.text("participant_id").notNull(),
  responses: t
    .text("responses", {
      mode: "json",
    })
    .notNull(),
  ...timestamps,
});

export const surveyRelations = relations(surveys, ({ one }) => ({
  participant: one(participants, {
    fields: [surveys.participantId],
    references: [participants.id],
  }),
}));
