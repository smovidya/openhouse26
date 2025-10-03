import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  // จุดเก็บแต้ม
  point: [
    "regist", // จุดลงทะเบียน
    "booth", // บูธภาควิชา
  ],
  // เวิร์กช็อป
  workshops: [
    "checkInParticipant", // เช็คอินคนที่ลงทะเบียนแล้ว
    "addParicipant", // เพิ่มคนที่ไม่ได้ลงทะเบียนล่วงหน้า และเช็คอิน
    "listParticipant", // ดูรายการผู้เข้าร่วม
    "viewParticipantWorkshop", // ดูรายการเวิร์กช็อปผู้เข้าร่วม
  ],
  // ของรางวัล
  rewards: [
    "redeemParticipantReward", // แลกแต้มผู้อื่น ทำเครื่องหมายว่าแลกแล้ว
    "redeemMyReward", // แลกแต้มของตัวเอง
    "editInventory", // แก้ไขจำนวนของในคลัง
    "viewParticipantReward", // ดูแต้มและรางวัลของผู้เข้าร่วม
  ],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  point: ["booth", "regist"],
  workshops: ["addParicipant", "checkInParticipant", "listParticipant"],
  rewards: ["redeemParticipantReward", "redeemMyReward", "editInventory"],
  ...adminAc.statements,
});

export const user = ac.newRole({
  rewards: ["redeemMyReward"],
  ...userAc.statements,
});

export const registarStaff = ac.newRole({
  point: ["regist"],
  workshops: ["viewParticipantWorkshop"],
  rewards: ["viewParticipantReward"],
});

export const majorBoothStaff = ac.newRole({
  point: ["booth"],
  workshops: ["viewParticipantWorkshop"],
  rewards: ["viewParticipantReward"],
});

export const workshopStaff = ac.newRole({
  workshops: [
    "addParicipant",
    "checkInParticipant",
    "listParticipant",
    "viewParticipantWorkshop",
  ],
  rewards: ["viewParticipantReward"],
});

export const rewardStaff = ac.newRole({
  rewards: [
    "viewParticipantReward",
    "editInventory",
    "redeemParticipantReward",
  ],
});

export const roles = {
  admin,
  user,
  registarStaff,
  majorBoothStaff,
  workshopStaff,
  rewardStaff,
};
