import { departmentBooths, isDepartmentBooth } from "./checkpoints";

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

export const tierConditions = {
  1: {
    departmentBooths: 5,
    tcasBooth: 1,
    addYour: 1,
  },
  2: {
    departmentBooths: 8,
    tcasBooth: 1,
    addYour: 1,
    sciPlayground: 1,
  },
  3: {
    departmentBooths: 15,
    tcasBooth: 1,
    addYour: 1,
    workshops: 1,
    sciPlayground: 1,
    stage: 1,
  },
};

export const rewardsInfo = [
  {
    id: 3,
    level: 3,
    name: "เสือซีเคร็ท",
    description: "ลุ้นรับของรางวัลใหญ่สุดพิเศษ",
    requiredTier: 3,
  },
  {
    id: 2,
    level: 2,
    name: "เสือผจญภัย",
    description: "รับของรางวัลสุดพิเศษ",
    requiredTier: 2,
  },
  {
    id: 1,
    name: "เสือฮอตเนิร์ด",
    level: 1,
    description: "รับของรางวัลน่ารักๆ",
    requiredTier: 1,
  },
  {
    id: 0,
    level: 0,
    name: "Tier 0",
    description: "รับทันที!! เมื่อเช็คอินเข้าหน้างาน",
    requiredTier: 0,
  },
];

export class Rewards {}
