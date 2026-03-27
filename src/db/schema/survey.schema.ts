import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { id, timestamps } from "./helper";

export const surveys = sqliteTable("surveys", {
  ...id,
  participantTicketId: t.text("participant_ticket_id").notNull(),
  nameInCert: t.text("name_in_cert"),
  responses: t.text("responses", {
    mode: "json",
  }),
  certIndex: t.integer("cert_index"),
  ...timestamps,
});
