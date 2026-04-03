export const competitorTiers = [
  "ชนะเลิศ",
  "รองชนะเลิศอันดับ 1",
  "รองชนะเลิศอันดับ 2",
  "รองชนะเลิศอันดับ 3",
  "เข้ารอบ 24 ทีม",
  "เข้ารอบ 60 ทีม",
  "เข้าร่วมสอบ",
  "ไม่เข้าสอบ",
] as const;

export type CompetitorTier = (typeof competitorTiers)[number];