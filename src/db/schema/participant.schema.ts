import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { surveys } from "./survey.schema";

export const participants = sqliteTable("participants", {
  ticketId: t.text("ticket_id").notNull().primaryKey().unique(),
  ...timestamps,
});

export const participantsRelations = relations(participants, ({ one }) => ({
  surveys: one(surveys, {
    fields: [participants.ticketId],
    references: [surveys.participantTicketId],
  }),
}));
