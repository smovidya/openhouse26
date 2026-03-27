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
  tier3: {
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
  tier1: {
    booth: 12,
    workshop: 1,
    tcas: 1,
    "central-exhibition": 1,
    challenge: 1,
  },
};

export type MinimumConditionsForTiers = typeof minimumConditionsForTiers;

export class Rewards {
  checkins: CheckpointWithCheckin[] = [];

  constructor(checkins: Checkin[] = []) {
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

  isPassConditionForTier(tier: keyof MinimumConditionsForTiers) {
    const typeCount = this.groupByTypeCount(this.checkins);
    const conditions = minimumConditionsForTiers[tier];
    return Object.entries(conditions).every(
      ([type, count]) => (typeCount[type as CheckpointType] || 0) >= count,
    );
  }

  isRewardRedeemable() {
    return (
      !this.checkins.some((checkin) => checkin.type === "reward-redeem") &&
      (this.isPassConditionForTier("tier1") ||
        this.isPassConditionForTier("tier2") ||
        this.isPassConditionForTier("tier3"))
    );
  }

  serialize() {
    return {
      tier1: this.isPassConditionForTier("tier1"),
      tier2: this.isPassConditionForTier("tier2"),
      tier3: this.isPassConditionForTier("tier3"),
      redeemable: this.isRewardRedeemable(),
      groupedCheckins: this.checkins.reduce(
        (acc, checkin) => {
          const type = checkin.type;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(checkin);
          return acc;
        },
        {} as Record<CheckpointType, CheckpointWithCheckin[]>,
      ),
    };
  }

  getConditionForTier(tier: keyof MinimumConditionsForTiers) {
    return Object.entries(minimumConditionsForTiers[tier]);
  }

  departmentBoothCheckpointsSortedCheckinFirst() {
    const departmentBoothCheckpoints = checkpoints
      .filter((c) => c.type === "booth")
      .map((c) => {
        const checkin = this.checkins.find((checkin) => checkin.id === c.id);
        return {
          ...c,
          checkin,
        };
      });
    return departmentBoothCheckpoints.sort((a, b) => {
      const aCheckedIn = this.checkins.some((checkin) => checkin.id === a.id);
      const bCheckedIn = this.checkins.some((checkin) => checkin.id === b.id);
      if (aCheckedIn && !bCheckedIn) {
        return -1;
      } else if (!aCheckedIn && bCheckedIn) {
        return 1;
      } else {
        if (a.name.length < b.name.length) {
          return -1;
        } else if (a.name.length > b.name.length) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }

  countCheckinByType(type: CheckpointType) {
    return this.checkins.filter((checkin) => checkin.type === type).length;
  }

  isCheckinConditionPass(
    conditionKey: CheckpointType,
    count: number,
    tier: keyof MinimumConditionsForTiers,
  ) {
    const typeCount = this.groupByTypeCount(this.checkins);
    return (typeCount[conditionKey] || 0) >= count;
  }

  isEligibleForCertificate() {
    // At least 1 checkin in any checkpoint
    return this.checkins.length > 0;
  }

  currentRewardTier() {
    if (this.isPassConditionForTier("tier1")) {
      return "tier1";
    } else if (this.isPassConditionForTier("tier2")) {
      return "tier2";
    } else if (this.isPassConditionForTier("tier3")) {
      return "tier3";
    } else {
      return null;
    }
  }
}
