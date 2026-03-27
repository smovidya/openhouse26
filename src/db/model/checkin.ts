import type { Db } from "..";
import { checkins } from "../schema/checkin.schema";
import { eq } from "drizzle-orm";

export const getCheckinByTicketId = async (db: Db, ticketId: string) =>
  db.select().from(checkins).where(eq(checkins.participantTicketId, ticketId));
