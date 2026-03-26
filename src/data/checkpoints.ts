import { workshops } from "./workshops";

interface Checkpoint {
  id: string;
  name: string;
  type:
    | "booth"
    | "reward-redeem"
    | "challenge"
    | "workshop"
    | "central-exhibition";
}

const workshopCheckpoints = workshops.map((workshop) => ({
  id: `workshop-${workshop.id}`,
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
    id: "checkpoint-chemistry",
    name: "เคมี",
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
    name: "หลักสูตรเทคโนโลยีชีวภาพ",
    type: "booth",
  },
  {
    id: "checkpoint-bistech",
    name: "หลักสูตรวิทยาศาสตร์และเทคโนโลยีอุตสาหการ",
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
    id: "central-exhibitions",
    name: "นิทรรศการกลาง",
    type: "central-exhibition",
  },
  {
    id: "tcas",
    name: "TCAS",
    type: "booth",
  },
  {
    id: "redeem-reward",
    name: "รับของรางวัล",
    type: "reward-redeem",
  },
  ...workshopCheckpoints,
];

export const boothCheckpoints = checkpoints;

export const isDepartmentStaffSelectable = (checkpointId: string) => {
  return (
    ![
      "entry-register",
      "add-your",
      "recive-reward",
      "tcas",
      "sci-playground",
      "stage",
      "hashtag",
      "graduated",
    ].includes(checkpointId) && !checkpointId.startsWith("workshop-")
  );
};

export const isDepartmentBooth = isDepartmentStaffSelectable;

export const departmentBooths = checkpoints.filter((c) =>
  isDepartmentBooth(c?.id || ""),
);
