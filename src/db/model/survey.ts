import { schema, type Db } from "@src/db";
import { eq } from "drizzle-orm";

export const getSurveyByParticipantId = async (db: Db, participantId: string) =>
  db.query.surveys.findFirst({
    where: eq(schema.surveys.participantId, participantId),
  });

export const insertSurvey = async (
  db: Db,
  participantId: string,
  data: unknown,
) =>
  db.insert(schema.surveys).values({
    participantId,
    responses: JSON.stringify(data),
  });
