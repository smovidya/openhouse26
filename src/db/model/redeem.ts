import { Rewards } from "@src/data/rewards";
import { schema, type Db } from "@src/db";
import { getCheckinByParticipant } from "@src/db/model/checkin";
import { getParticipantByIdOrQrCodeId } from "@src/db/model/participant";
import { eq } from "drizzle-orm";

// export async function isRedeemed(db: Db, id: string) {
//     const participant = await getParticipantByIdOrQrCodeId(db, id)
//     if (!participant) {
//         return "user-not-exist";
//     }

//     const redeemed = await db.query.redeemedRewards.findFirst({
//         where: eq(schema.redeemedRewards.participantId, participant!.id)
//     })

//     return !!redeemed;
// }

export async function getRewardInfo(db: Db, qrId: string) {
    const participant = await getParticipantByIdOrQrCodeId(db, qrId)
    if (!participant) {
        return "user-not-exist";
    }

    const checkins = await getCheckinByParticipant(db, qrId)
    const reward = new Rewards(participant.id, checkins)
    return reward;
}

export async function markAsRedeemed(db: Db, qrId: string, staffId: string) {
    const participant = await getParticipantByIdOrQrCodeId(db, qrId)
    if (!participant) {
        return "user-not-exist";
    }

    const redeemed = await db.query.redeemedRewards.findFirst({
        where: eq(schema.redeemedRewards.participantId, participant!.id)
    })

    if (redeemed) {
        return "redeemed"
    }

    const checkins = await getCheckinByParticipant(db, qrId)
    const reward = new Rewards(participant.id, checkins)

    if (reward.getCurrentTier().level <= 0) {
        return "tier-too-low";
    };

    await db.insert(schema.redeemedRewards).values({
        participantId: participant.id,
        staffId: staffId,
        rewardData: JSON.stringify(reward)
    })
}
