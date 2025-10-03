export interface Department {
  thName: string;
  enShortName: string;
  id: number; // our id
  // TODO: more later
}

export const departments = [
  {
    enShortName: "testtt",
    thName: "คณะรักษาความสงบแห่งชาติ",
    id: 12
  },
  {
    enShortName: "testtt2",
    thName: "คณะรัฐมนตรี",
    id: 1223
  }

] as const satisfies Department[];
