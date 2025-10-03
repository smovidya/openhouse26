export const project = {
  name: "SCI Chula Openhouse 2026",
  logo: "/logo.png",
};

export const featureFlags = {
  signup: true,
  login: true,
  workshopRegistration: new Date() < new Date("2025-10-06T09:00:00+07:00"),
};


export const participantStatus = [
  "ก่อนประถมศึกษา",
  "ประถนศึกษา",
  "มัธยมศึกษาตอนต้น",
  "มัธยมศึกษาตอนปลาย",
  "ผู้ปกครอง",
  "ปวช./ปวส.",
  "ปริญญาตรี",
  "ปริญญาโท",
  "ปริญญาเอก",
] as const;

export type ParticipantStatus = typeof participantStatus[number];