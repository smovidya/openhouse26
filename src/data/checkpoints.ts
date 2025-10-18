import { checkpoints as checkpointSchema } from "@src/db/schema/checkpoint.schema";
import { workshops } from "./workshops";

type Checkpoint = typeof checkpointSchema.$inferInsert;

const workshopCheckpoints = workshops.map((workshop) => ({
  id: `workshop-${workshop.id}`,
  name: `กิจกรรม Workshop: ${workshop.title}`,
  type: "workshop" as const,
}));

export const checkpoints: Checkpoint[] = [
  {
    id: "entry-register",
    name: "จุดลงทะเบียนเข้างาน",
    type: "entry",
  },
  {
    id: "add-your",
    name: 'ภารกิจ "Add Your"',
    type: "booth",
  },
  {
    id: "hashtag",
    name: "ภารกิจ ติดแท็ก #ScienceChulaOpenhouse2026",
    type: "booth",
  },
  {
    id: "stage",
    name: "ภารกิจกิจกรรมบนเวที",
    type: "stage",
  },
  {
    id: "bsac",
    name: "บูธ BSAC",
    type: "booth",
  },เวท
  {
    id: "bbtech",
    name: "บูธ BBTech",
    type: "booth",
  },
  {
    id: "bistech",
    name: "บูธ BISTech",
    type: "booth",
  },
  {
    id: "imprint",
    name: "บูธ Imaging & Printing",
    type: "booth",
  },
  {
    id: "foodtech",
    name: "บูธ Food Technology",
    type: "booth",
  },
  {
    id: "chemtech",
    name: "บูธ ChemTech",
    type: "booth",
  },
  {
    id: "matsci",
    name: "บูธ Materials Science",
    type: "booth",
  },
  {
    id: "chem",
    name: "บูธ Chemistry",
    type: "booth",
  },
  {
    id: "mathcom",
    name: "บูธ Mathematics & Computer Science",
    type: "booth",
  },
  {
    id: "physics",
    name: "บูธ Physics",
    type: "booth",
  },
  {
    id: "geo",
    name: "บูธ Geology",
    type: "booth",
  },
  {
    id: "envi",
    name: "บูธ Environmental Science",
    type: "booth",
  },
  {
    id: "marine",
    name: "บูธ Marine Science",
    type: "booth",
  },
  {
    id: "biochem",
    name: "บูธ Biochemistry",
    type: "booth",
  },
  {
    id: "microbio",
    name: "บูธ Microbiology",
    type: "booth",
  },
  {
    id: "botany",
    name: "บูธ Botany",
    type: "booth",
  },
  {
    id: "biology",
    name: "บูธ Biology",
    type: "booth",
  },
  {
    id: "sci-playground",
    name: 'นิทรรศการกลาง "Sci Playground"',
    type: "booth",
  },
  {
    id: "tcas",
    name: 'บูธ "TCAS & Admission"',
    type: "booth",
  },
  {
    id: "recive-reward",
    name: "จุดรับของรางวัล",
    type: "reward",
  },
  ...workshopCheckpoints,
];

export const boothCheckpoints = checkpoints

export const isDepartmentStaffSelectable = (checkpointId: string) => {
  return ![
    "entry-register",
    "add-your",
    "recive-reward",
    "tcas",
    "sci-playground",
    "stage",
    "hashtag",
  ].includes(checkpointId);
};

export const isDepartmentBooth = isDepartmentStaffSelectable;
