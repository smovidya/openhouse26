import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { deletedAt, id, timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { participants } from "./participant.schema";
import { staffs } from "./staff.schema";

export const checkins = sqliteTable("checkins", {
  ...id,
  participantTicketId: t
    .text("participant_id")
    .references(() => participants.ticketId),
  checkedByStaffId: t.text("checked_by_staff_id").references(() => staffs.id),
  checkpointId: t.text("checkpoint_id"),
  data: t
    .text("data", {
      mode: "json",
    })
    .default("{}"),
  ...timestamps,
  ...deletedAt,
});

export const checkinRelations = relations(checkins, ({ one }) => ({
  participant: one(participants, {
    fields: [checkins.participantTicketId],
    references: [participants.ticketId],
  }),
  staff: one(staffs, {
    fields: [checkins.checkedByStaffId],
    references: [staffs.id],
  }),
}));
