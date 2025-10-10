import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { deletedAt, id, timestamps } from "./helper";
import { participants } from "./participant.schema";
import { staffs } from "./staff.schema";
import { relations } from "drizzle-orm";

export const redeemRewards = sqliteTable("redeem_rewards", {
  ...id,
  participantId: t.text("participant_id").references(() => participants.id),
  redeemedByStaffId: t.text("redeemed_by_staff_id").references(() => staffs.id),
  rewardData: t
    .text("reward_data", {
      mode: "json",
    })
    .notNull(),
  ...timestamps,
  ...deletedAt,
});

export const redeemRewardRelations = relations(redeemRewards, ({ one }) => ({
  participant: one(participants, {
    fields: [redeemRewards.participantId],
    references: [participants.id],
  }),
  staff: one(staffs, {
    fields: [redeemRewards.redeemedByStaffId],
    references: [staffs.id],
  }),
}));
