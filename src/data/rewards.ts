import {
  checkpoints,
  isDepartmentBooth,
  type CheckpointType,
} from "./checkpoints";
import { schema } from "@src/db/schema";
import { type Checkpoint } from "@src/data/checkpoints";

type Checkin = Required<typeof schema.checkins.$inferSelect>;
type CheckpointWithCheckin = Checkpoint & {
  checkin: Checkin;
};

const minimumConditionsForTiers = {
  tier1: {
    booth: 5,
    tcas: 1,
    "central-exhibition": 1,
  },
  tier2: {
    booth: 8,
    workshop: 1,
    tcas: 1,
    "central-exhibition": 1,
  },
  tier3: {
    booth: 12,
    workshop: 1,
    tcas: 1,
    "central-exhibition": 1,
    challenge: 1,
  },
};

export class Rewards {
  checkins: CheckpointWithCheckin[];

  constructor(checkins: Checkin[]) {
    this.checkins = checkins.map((checkin) => {
      const checkpoint = checkpoints.find((c) => c.id === checkin.checkpointId);
      if (!checkpoint) {
        throw new Error(`Checkpoint with id ${checkin.checkpointId} not found`);
      }
      return {
        ...checkpoint,
        checkin,
      };
    });
  }

  groupByTypeCount(checkins: CheckpointWithCheckin[]) {
    return checkins.reduce(
      (acc, checkin) => {
        acc[checkin.type] = (acc[checkin.type] || 0) + 1;
        return acc;
      },
      {} as Record<CheckpointType, number>,
    );
  }

  isPassTier1() {
    const typeCount = this.groupByTypeCount(this.checkins);
    const conditions = minimumConditionsForTiers.tier1;
    return Object.entries(conditions).every(
      ([type, count]) => (typeCount[type as CheckpointType] || 0) >= count,
    );
  }

  isPassTier2() {
    const typeCount = this.groupByTypeCount(this.checkins);
    const conditions = minimumConditionsForTiers.tier2;
    return Object.entries(conditions).every(
      ([type, count]) => (typeCount[type as CheckpointType] || 0) >= count,
    );
  }

  isPassTier3() {
    const typeCount = this.groupByTypeCount(this.checkins);
    const conditions = minimumConditionsForTiers.tier3;
    return Object.entries(conditions).every(
      ([type, count]) => (typeCount[type as CheckpointType] || 0) >= count,
    );
  }

  isRewardRedeemable() {
    return !this.checkins.some((checkin) => checkin.type === "reward-redeem");
  }
}
