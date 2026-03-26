
export interface Workshop {
  id: string;
  title: string;
  department: string;
}

export const workshops: Workshop[] = [
  {
    id: "workshop-secret-code",
    title: "Secret Code",
    department: "MathCom",
  },
  {
    id: "workshop-perfume",
    title: "Perfume",
    department: "Chem & BSAC",
  },
  {
    id: "workshop-unit-operations",
    title: "Unit Operations LAB",
    department: "ChemTech",
  },
  {
    id: "workshop-checkin-geology",
    title: "Check-in สู่โลกธรณี",
    department: "Geology",
  },
  {
    id: "workshop-carbon-credits",
    title: "วัดคาร์บอนเครดิต",
    department: "Environmental Science",
  },
  {
    id: "workshop-banana-dna",
    title: "A Minion Mission: Banana DNA",
    department: "BioChem",
  },
  {
    id: "workshop-magnetic",
    title: "The Magnetic Masquerade",
    department: "Micro",
  },
  {
    id: "workshop-foodtech",
    title: "Foodtech Discovery Lounge",
    department: "FoodTech",
  },
  {
    id: "workshop-munsell",
    title: "Munsell 100 HUE Test",
    department: "ImPrint",
  },
  {
    id: "workshop-str",
    title: "ไขปริศนาด้วย STR",
    department: "BBTech",
  },
  {
    id: "workshop-f1",
    title: "F1 Car Race",
    department: "BISTech",
  },
];

export function getWorkshopById(id: string) {
  return workshops.find((it) => it.id === id);
}
