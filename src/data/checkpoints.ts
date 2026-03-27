import { workshops } from "./workshops";

export type CheckpointType =
  | "booth"
  | "reward-redeem"
  | "challenge"
  | "workshop"
  | "tcas";

export interface Checkpoint {
  id: string;
  name: string;
  type: CheckpointType;
}

const workshopCheckpoints = workshops.map((workshop) => ({
  id: workshop.id,
  name: `กิจกรรม Workshop: ${workshop.title}`,
  type: "workshop" as const,
}));

export const checkpoints: Checkpoint[] = [
  {
    id: "checkpoint-botany",
    name: "พฤกษศาสตร์",
    type: "booth",
  },
  {
    id: "checkpoint-microbiology",
    name: "จุลชีววิทยา",
    type: "booth",
  },
  {
    id: "checkpoint-biology",
    name: "ชีววิทยา",
    type: "booth",
  },
  {
    id: "checkpoint-marine",
    name: "วิทยาศาสตร์ทางทะเล",
    type: "booth",
  },
  {
    id: "checkpoint-environmental",
    name: "วิทยาศาสตร์สิ่งแวดล้อม",
    type: "booth",
  },
  {
    id: "checkpoint-geology",
    name: "ธรณีวิทยา",
    type: "booth",
  },
  {
    id: "checkpoint-foodtech",
    name: "เทคโนโลยีทางอาหาร",
    type: "booth",
  },
  {
    id: "checkpoint-imprint",
    name: "เทคโนโลยีทางภาพและการพิมพ์",
    type: "booth",
  },
  {
    id: "checkpoint-materials",
    name: "วัสดุศาสตร์",
    type: "booth",
  },
  {
    id: "checkpoint-chemtech",
    name: "เคมีเทคนิค",
    type: "booth",
  },
  {
    id: "checkpoint-bsac",
    name: "หลักสูตรเคมีประยุกต์ (BSAC)",
    type: "booth",
  },
  {
    id: "checkpoint-bbtech",
    name: "หลักสูตรเทคโนโลยีชีวภาพ (BBTech)",
    type: "booth",
  },
  {
    id: "checkpoint-bistech",
    name: "หลักสูตรวิทยาศาสตร์และเทคโนโลยีอุตสาหการ (BISTech)",
    type: "booth",
  },
  {
    id: "checkpoint-mathcom",
    name: "คณิตศาสตร์และวิทยาการคอมพิวเตอร์",
    type: "booth",
  },
  {
    id: "checkpoint-physics",
    name: "ฟิสิกส์",
    type: "booth",
  },
  {
    id: "checkpoint-chemistry",
    name: "เคมี",
    type: "booth",
  },
  {
    id: "tcas",
    name: "TCAS",
    type: "tcas",
  },
  {
    id: "redeem-reward",
    name: "รับของรางวัล",
    type: "reward-redeem",
  },
  {
    id: "challenge",
    name: "ถ่ายรูปบรรยากาศงาน ลง IG ติด #Sciencechulaopenhouse2026",
    type: "challenge",
  },
  ...workshopCheckpoints,
];

export const boothCheckpoints = checkpoints.filter(
  (c) => c.type === "booth" || c.type === "tcas" || c.type === "challenge",
);

export const departmentBoothCheckpoints = checkpoints.filter(
  (c) => c.type === "booth",
);

export const isDepartmentBooth = (checkpointId: string) =>
  checkpoints.some((c) => c.id === checkpointId && c.type === "booth");
