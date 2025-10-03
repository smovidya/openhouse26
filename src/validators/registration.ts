// import { type } from "arktype";

// export const CommonRegistrationFormPart = type({
//   firstname: "string > 0",
//   lastname: "string > 0",
//   age: "number",
//   specialNeeds: "string",
//   // TODO: think about this, do we have somekind of id for it, Get thai province list and ต่างประเทศ
//   province: "string",
//   howDidYouKnowUs: "string[]"
// });

// export const StudentRegistrationForm = type({
//   status: `"lower-matthayom" | "higher-matthayom" | "prathom" | "ปวช" | "ปวศ" | "bachelor" | "master"`,
//   // if the user use ourform then there is noway they gonna send more than 3 entry
//   // so we can just not provide error message 
//   interestedDepertments: "number[] <= 3", // department ids
// });

// export const OtherRegistrationForm = type({
//   status: `"parent" | "other"`
// });

// export const RegistrationForm = StudentRegistrationForm.or(OtherRegistrationForm);
// export type RegistrationForm = typeof RegistrationForm.infer;
// export type ParticipantStatus = RegistrationForm["status"]
