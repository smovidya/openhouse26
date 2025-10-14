export const project = {
  name: "SCI Chula Openhouse 2026",
  logo: "/logo.png",
};

export const workshopRegistrationDate = new Date("2025-10-06T18:00:00+07:00");
export const featureFlags = {
  signup: new Date() > new Date("2025-10-04T17:59:59+07:00"),
  login: true,
  get workshopRegistration() {
    return new Date() > workshopRegistrationDate;
  },
  get workshopRegistrationClosed() {
    return new Date() > new Date("2025-10-10T23:59:59+07:00");
  },
  showMission: true,
};

export const howDidYouKnowUsOptions = [
  {
    value: "friend",
    label: "เพื่อน/ผู้ปกครอง/คนรู้จัก",
  },
  {
    value: "social-media-other",
    label: "สื่อสังคมออนไลน์ (ที่ไม่ใช่ของงาน) เฟซบุ๊ก อินสตาแกรม ฯลฯ",
  },

  {
    value: "social-media-official",
    label: "สื่อสังคมออนไลน์ของงาน (IG: smovidya)",
  },

  {
    value: "dekd",
    label: "DekD",
  },

  {
    value: "camphub",
    label: "CampHub",
  },

  {
    value: "ads",
    label: "ป้ายโฆษณา (ที่ต่าง ๆ)",
  },
];

export const participantStatus = [
  "ก่อนประถมศึกษา",
  "ประถมศึกษา",
  "มัธยมศึกษาตอนต้น",
  "มัธยมศึกษาตอนปลาย",
  "ปวช./ปวส.",
  "ปริญญาตรี",
  "ปริญญาโท",
  "ปริญญาเอก",
  "ผู้ปกครอง",
  "อื่นๆ",
] as const;

export type ParticipantStatus = (typeof participantStatus)[number];

export const whyJoinThisOptions = [
  {
    value: "come-with-student",
    label: "มากับนักเรียน/นักศึกษา",
  },
  {
    value: "look-around-university",
    label: "ดูสถานที่และบรรยากาศในมหาวิทยาลัย",
  },
  {
    value: "learn-about-curriculum",
    label: "ศึกษาข้อมูลหลักสูตร",
  },
  {
    value: "interested-in-further-study",
    label: "สนใจศึกษาต่อ",
  },
];
