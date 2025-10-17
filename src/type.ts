import { schema } from "@src/db";

// this interface should be in the api file
export interface SelectedWorkshop {
  workshopId: string;
  roundNumber: number;
}

export interface SSEWorkerRpc {
  sendEvent(participantId: string, data: string): Promise<string>;
  fetch(request: Request): Promise<Response>;
  double(n: number): number;
}

export interface CheckinWorkshopData {
  type: "workshop";
  workshopId: string;
  /** ISO string */
  startTime: string;
  /** ISO string */
  endTime: string;
}

export interface RewardProgressSnapshot {
  lastUpdate: Date;
  checkins: (typeof schema.checkins.$inferSelect)[];
}

export interface RedeemedRewardData {
  type: "redeemed-reward";
  participantData: Record<string, string | number | Date>;
  progressSnapshot: RewardProgressSnapshot;
}
