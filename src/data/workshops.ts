class Time {
  #hour: number;
  #minute: number;

  constructor(hour: number, minute: number) {
    this.#hour = hour;
    this.#minute = minute;
  }

  toString() {
    const h = this.#hour.toString().padStart(2, "0");
    const m = this.#minute.toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  static fromString(timeStr: string) {
    const [h, m] = timeStr.split(":").map(Number);
    return new Time(h, m);
  }
}

interface TimeSlot {
  round: number;
  date: Date;
  start: Time;
  end: Time;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  hostDepartment: string;
  // hostDepartmentIds: number[];
  hostDepartmentAbbr: string;
  image: string;
  capacity: number;
  slots: TimeSlot[];

}

export const workshops: Workshop[] = [
  {
    id: "kimchi",
    title: "Kimchi Fermentation & 3D printing",
    description:
      "BBtech: Explore the origins of biotechnology through an everyday activity: making kimchi! Discover how microorganisms transform ingredients through fermentation, and learn how fermentation time affects flavor, texture, and nutritional value. Bistech: Discover how 3D printing is revolutionizing modern manufacturing and design. Learn about this innovative technology's real-world industrial applications and get hands-on experience assembling an actual 3D-printed project.",
    hostDepartment:
      "เทคโนโลยีชีวภาพ (นานาชาติ) ร่วมกับ หลักสูตรวิทยาศาสตร์และเทคโนโลยีอุตสาหการ (นานาชาติ)",
    hostDepartmentAbbr: "BBTech & BISTech",
    capacity: 15,
    image: "/logo.png",
    slots: [
      {
        round: 1,
        date: new Date("2025-10-18"),
        start: new Time(10, 10),
        end: new Time(10, 50),
      },
      {
        round: 2,
        date: new Date("2025-10-18"),
        start: new Time(11, 5),
        end: new Time(11, 40),
      },
      {
        round: 3,
        date: new Date("2025-10-18"),
        start: new Time(13, 30),
        end: new Time(14, 10),
      },
      {
        round: 4,
        date: new Date("2025-10-18"),
        start: new Time(14, 30),
        end: new Time(15, 10),
      },
    ],
  },
  {
    id: "banana-dna",
    title: "A minion mission: Banana DNA",
    description:
      "กิจกรรมนี้ถูกออกแบบมาเพื่อเป็นประตูบานแรกสู่โลกแห่งชีวเคมีและการค้นพบทางวิทยาศาสตร์ ด้วยการใช้เพียงอุปกรณ์ง่ายๆ ที่หาได้ในครัวเรือน เราจะชวนผู้ร่วมกิจกรรมทุกคนมาเป็นนักวิทยาศาสตร์ เพื่อเจาะลึกและสัมผัสกับดีเอ็นเออย่างใกล้ชิด",
    hostDepartment: "ชีวเคมี",
    hostDepartmentAbbr: "BioChem",
    capacity: 20,
    image: "/logo.png",
    slots: [
      {
        round: 1,
        date: new Date("2025-10-18"),
        start: new Time(11, 15),
        end: new Time(12, 15),
      },
      {
        round: 2,
        date: new Date("2025-10-18"),
        start: new Time(13, 30),
        end: new Time(14, 30),
      },
    ],
  },
];
