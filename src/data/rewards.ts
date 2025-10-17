import type { checkinModel, schema } from "@src/db";
import { isDepartmentBooth } from "./checkpoints";

const tierLevels = {
  0: "Tier 0",
  1: "Tier 3 เสือฮอตเนิร์ด",
  2: "Tier 2 เสือผจญภัย",
  3: "Tier 1 เสือซีเคร็ท",
};

const tierProgressKeys = {
  departmentBooths: "บูธภาควิชา",
  tcasBooth: "บูธ TCAS",
  addYour: 'ภารกิจ "Add Your"',
  workshops: "ทำกิจกรรม Workshop",
  sciPlayground: " Sci Playground",
  stage: "กิจกรรมบนเวที",
};

const tierConditions = {
  1: {
    departmentBooths: 5,
    tcasBooth: 1,
    addYour: 1,
  },
  2: {
    departmentBooths: 10,
    tcasBooth: 1,
    addYour: 1,
    workshops: 1,
    sciPlayground: 1,
  },
  3: {
    departmentBooths: 17,
    tcasBooth: 1,
    addYour: 1,
    workshops: 1,
    sciPlayground: 1,
    stage: 1,
  },
};

const rewardsInfo = [
  {
    id: 3,
    name: "เสือซีเคร็ท",
    description: "ลุ้นรับของรางวัลใหญ่สุดพิเศษ",
    requiredTier: 3,
  },
  {
    id: 2,
    name: "เสือผจญภัย",
    description: "รับของรางวัลสุดพิเศษ",
    requiredTier: 2,
  },
  {
    id: 1,
    name: "เสือฮอตเนิร์ด",
    description: "รับของรางวัลน่ารักๆ",
    requiredTier: 1,
  },
  {
    id: 0,
    name: "Tier 0",
    description: "รับทันที!! เมื่อเช็คอินเข้าหน้างาน",
    requiredTier: 0,
  }
];

export class Rewards {
  checkins: Awaited<ReturnType<typeof checkinModel.getCheckinByParticipant>>;
  participantId: string;

  constructor(
    participantId: string,
    checkins: Awaited<ReturnType<typeof checkinModel.getCheckinByParticipant>>,
  ) {
    this.participantId = "";
    this.checkins = [];
  }

  getCheckedInEntry() {
    return this.checkins.filter((c) => c.checkpoints?.type === "entry");
  }

  getCheckedInDepartmentBooth() {
    return this.checkins.filter(
      (c) =>
        c.checkpoints?.type === "booth" && isDepartmentBooth(c.checkpoints.id),
    );
  }

  getCheckedinTcasBooth() {
    return this.checkins.filter((c) => c.checkpoints?.id === "tcas");
  }

  getCheckpointName(checkpointId: string) {
    const checkpoint = this.checkins.find(
      (c) => c.checkpoints?.id === checkpointId,
    );
    return checkpoint?.checkpoints?.name || "";
  }

  getCheckpointType(checkpointId: string) {
    const checkpoint = this.checkins.find(
      (c) => c.checkpoints?.id === checkpointId,
    );
    return checkpoint?.checkpoints?.type || "";
  }

  getRewardRedeemed(rewardId: string) {
    return this.checkins.filter((c) => c.checkpoints?.type === "reward");
  }

  getCheckedinAddYours() {
    return this.checkins.filter((c) => c.checkpoints?.id === "add-your");
  }

  getCheckeninHashtag() {
    return this.checkins.filter((c) => c.checkpoints?.id === "hashtag");
  }

  getCheckedinWorkshop() {
    return this.checkins.filter((c) => c.checkpoints?.type === "workshop");
  }

  getCheckedinStage() {
    return this.checkins.filter((c) => c.checkpoints?.id === "stage");
  }

  getCheckedinSciPlayground() {
    return this.checkins.filter((c) => c.checkpoints?.id === "sci-playground");
  }

  getCurrentProgress() {
    const tier = this.getCurrentTier();
    return tier.progress;
  }

  getCurrentTier() {
    const departmentBoothCount = this.getCheckedInDepartmentBooth().length;
    const tcasBoothCheckedIn = this.getCheckedinTcasBooth().length > 0;
    const addYourCheckedIn = this.getCheckedinAddYours().length > 0;

    const hashtagCheckedIn = this.getCheckeninHashtag().length > 0;
    const workshopCount = this.getCheckedinWorkshop().length;
    const sciPlaygroundCount = this.getCheckedinSciPlayground().length;

    const stageCount = this.getCheckedinStage().length;

    if (
      departmentBoothCount >= 17 &&
      tcasBoothCheckedIn &&
      addYourCheckedIn &&
      hashtagCheckedIn &&
      workshopCount >= 1 &&
      sciPlaygroundCount >= 1 &&
      stageCount >= 1
    ) {
      return {
        level: 3,
        tier: "เสือซีเคร็ท",
        progress: {
          departmentBooths: departmentBoothCount,
          tcasBooth: tcasBoothCheckedIn ? 1 : 0,
          addYour: addYourCheckedIn ? 1 : 0,
          workshops: workshopCount,
          sciPlayground: sciPlaygroundCount,
          stage: stageCount,
        },
      };
    } else if (
      departmentBoothCount >= 10 &&
      tcasBoothCheckedIn &&
      addYourCheckedIn &&
      workshopCount >= 1 &&
      sciPlaygroundCount >= 1 &&
      hashtagCheckedIn
    ) {
      return {
        level: 2,
        tier: "เสือผจญภัย",
        progress: {
          departmentBooths: departmentBoothCount,
          tcasBooth: tcasBoothCheckedIn ? 1 : 0,
          addYour: addYourCheckedIn ? 1 : 0,
          workshops: workshopCount,
          sciPlayground: sciPlaygroundCount,
        },
      };
    } else if (
      departmentBoothCount >= 5 &&
      tcasBoothCheckedIn &&
      addYourCheckedIn
    ) {
      return {
        level: 1,
        tier: "เสือฮอตเนิร์ด",
        progress: {
          departmentBooths: departmentBoothCount,
          tcasBooth: tcasBoothCheckedIn ? 1 : 0,
          addYour: addYourCheckedIn ? 1 : 0,
        },
      };
    } else if (this.getCheckedInEntry().length > 0) {
      return {
        level: 0,
        tier: "Tier 0",
      };
    } else {
      return {
        level: -1,
        tier: "ยังไม่ได้เช็คอินเข้าร่วมกิจกรรมที่ทะเบียน",
      };
    }
  }
}
