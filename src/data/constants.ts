export const project = {
  name: "SCI Chula Openhouse 2026",
  logo: "/logo.png",
};

export const featureFlags = {
  signup: true,
  login: true,
  workshopRegistration: new Date() < new Date("2025-10-06T09:00:00+07:00"),
};
