import type { Db } from "..";
import { surveys } from "../schema/survey.schema";
import { eq } from "drizzle-orm";

export const getSurveyByTicketId = async (db: Db, ticketId: string) => db.select().from(surveys).where(eq(surveys.participantTicketId, ticketId)).get()

export const createSurvey = async (
  db: Db,
  {
    ticketId,
    nameInCert,
    responses,
  }: {
    ticketId: string;
    nameInCert: string;
    responses?: unknown;
  },
) => db.insert(surveys).values({
  participantTicketId: ticketId,
  nameInCert,
  responses: responses || {},
});
