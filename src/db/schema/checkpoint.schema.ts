import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { deletedAt, id, timestamps } from "./helper";
import { relations } from "drizzle-orm";
import { participants } from "./participant.schema";
import { staffs } from "./staff.schema";

export const checkpoints = sqliteTable("checkpoints", {
  ...id,
  name: t.text(),
  note: t.text(),
  type: t.text({
    enum: ["entry", "booth", "reward", "stage", "workshop"],
  }),
  ...timestamps,
  ...deletedAt,
});

export const checkpointRelations = relations(checkpoints, ({ many }) => ({
  checkins: many(checkins),
}));

export const checkins = sqliteTable("checkins", {
  ...id,
  participantId: t.text("participant_id").references(() => participants.id),
  checkedByStaffId: t.text("checked_by_staff_id").references(() => staffs.id),
  checkpointId: t.text("checkpoint_id").references(() => checkpoints.id),
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
    fields: [checkins.participantId],
    references: [participants.id],
  }),
  staff: one(staffs, {
    fields: [checkins.checkedByStaffId],
    references: [staffs.id],
  }),
  checkpoint: one(checkpoints, {
    fields: [checkins.checkpointId],
    references: [checkpoints.id],
  }),
}));

export const redeemedRewards = sqliteTable("redeemed_rewards", {
  ...id,
  participantId: t.text("participant_id").references(() => participants.id),
  staffId: t.text("staff_id").references(() => staffs.id),
  rewardData: t.text("reward_data", { mode: "json" }),
  ...timestamps,
  ...deletedAt,
});

export const redeemedRewardRelations = relations(
  redeemedRewards,
  ({ one }) => ({
    participant: one(participants, {
      fields: [redeemedRewards.participantId],
      references: [participants.id],
    }),
    staff: one(staffs, {
      fields: [redeemedRewards.staffId],
      references: [staffs.id],
    }),
  }),
);
