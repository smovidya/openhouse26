export interface Department {
  thName: string;
  enShortName: string;
  id: number;
}

export const departments = [
  {
    enShortName: "MathCom",
    thName: "คณิตศาสตร์และวิทยาการคอมพิวเตอร์",
    id: 1,
  },
  {
    enShortName: "Chem",
    thName: "เคมี",
    id: 2,
  },
  {
    enShortName: "BioZoo",
    thName: "ชีววิทยา",
    id: 3,
  },
  {
    enShortName: "Physics",
    thName: "ฟิสิกส์",
    id: 4,
  },
  {
    enShortName: "Botany",
    thName: "พฤกษศาสตร์",
    id: 5,
  },
  {
    enShortName: "ChemTech",
    thName: "เคมีเทคนิค",
    id: 6,
  },
  {
    enShortName: "Geology",
    thName: "ธรณีวิทยา",
    id: 7,
  },
  {
    enShortName: "EnviSci",
    thName: "วิทยาศาสตร์สิ่งแวดล้อม",
    id: 8,
  },
  {
    enShortName: "MarineSci",
    thName: "วิทยาศาสตร์ทางทะเล",
    id: 9,
  },
  {
    enShortName: "BioChem",
    thName: "ชีวเคมี",
    id: 10,
  },
  {
    enShortName: "MatSci",
    thName: "วัสดุศาสตร์",
    id: 11,
  },
  {
    enShortName: "MicroBio",
    thName: "จุลชีววิทยา",
    id: 12,
  },
  {
    enShortName: "ImPrint",
    thName: "เทคโนโลยีทางภาพและการพิมพ์",
    id: 13,
  },
  {
    enShortName: "FoodTech",
    thName: "เทคโนโลยีทางอาหาร",
    id: 14,
  },
  {
    enShortName: "BSAC",
    thName: "เคมีประยุกต์ (นานาชาติ)",
    id: 15,
  },
  {
    enShortName: "BBTech",
    thName: "SIS (BBTech)",
    id: 16,
  },
  {
    enShortName: "BISTech",
    thName: "SIS (BISTech)",
    id: 17,
  },
] as const satisfies Department[];
