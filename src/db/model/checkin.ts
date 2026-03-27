import type { Db } from "..";
import { checkins } from "../schema/checkin.schema";
import { eq } from "drizzle-orm";

export const getCheckinByTicketId = async (db: Db, ticketId: string) =>
  db.select().from(checkins).where(eq(checkins.participantTicketId, ticketId));

export const createCheckin = async (
  db: Db,
  {
    checkpointId,
    ticketId,
    staffId,
    data,
  }: {
    checkpointId: string;
    ticketId: string;
    staffId: string;
    data: string | null;
  },
) => {
  await db.insert(checkins).values({
    checkedByStaffId: staffId,
    checkpointId,
    participantTicketId: ticketId,
    data,
  });
};

export const getCheckinByCheckpointId = async (db: Db, checkpointId: string) =>
  db.select().from(checkins).where(eq(checkins.checkpointId, checkpointId));

export const getCheckinByTicketIdWithStaff = async (db: Db, ticketId: string) =>
  db.query.checkins.findMany({
    where: eq(checkins.participantTicketId, ticketId),
    with: {
      staff: true,
    },
  });
