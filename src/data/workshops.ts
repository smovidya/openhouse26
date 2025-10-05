class Time {
  hour: number;
  minute: number;

  constructor(hour: number, minute: number) {
    this.hour = hour;
    this.minute = minute;
  }

  toString() {
    const h = this.hour.toString().padStart(2, "0");
    const m = this.minute.toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  static fromString(timeStr: string) {
    const [h, m] = timeStr.split(":").map(Number);
    return new Time(h, m);
  }
}

export class TimeSlot {
  round: number;
  date: Date;
  start: Time;
  end: Time;

  constructor({
    date,
    end,
    round,
    start,
  }: {
    round: number;
    date: Date;
    start: Time;
    end: Time;
  }) {
    this.round = round;
    this.date = date;
    this.start = start;
    this.end = end;
  }

  isIn1Hour(other: TimeSlot) {
    // Check if dates are the same
    if (this.date.toDateString() !== other.date.toDateString()) {
      return false;
    }

    // Convert times to minutes for easier calculation
    const thisStartMinutes = this.start.hour * 60 + this.start.minute;
    const thisEndMinutes = this.end.hour * 60 + this.end.minute;
    const otherStartMinutes = other.start.hour * 60 + other.start.minute;
    const otherEndMinutes = other.end.hour * 60 + other.end.minute;

    // Check if slots overlap or are within 1 hour (60 minutes) of each other
    const gap = Math.min(
      Math.abs(thisStartMinutes - otherEndMinutes),
      Math.abs(otherStartMinutes - thisEndMinutes)
    );

    return gap <= 60;
  }
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
      new TimeSlot({
        round: 1,
        date: new Date("2025-10-18"),
        start: new Time(10, 10),
        end: new Time(10, 50),
      }),
      new TimeSlot({
        round: 2,
        date: new Date("2025-10-18"),
        start: new Time(11, 5),
        end: new Time(11, 40),
      }),
      new TimeSlot({
        round: 3,
        date: new Date("2025-10-18"),
        start: new Time(13, 30),
        end: new Time(14, 10),
      }),
      new TimeSlot({
        round: 4,
        date: new Date("2025-10-18"),
        start: new Time(14, 30),
        end: new Time(15, 10),
      }),
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
      new TimeSlot({
        round: 1,
        date: new Date("2025-10-18"),
        start: new Time(11, 15),
        end: new Time(12, 15),
      }),
      new TimeSlot({
        round: 2,
        date: new Date("2025-10-18"),
        start: new Time(13, 30),
        end: new Time(14, 30),
      }),
    ],
  },
  {
    id: "foodtech-playground",
    title: "FoodTech Playground",
    capacity: 20,
    hostDepartment: "เทคโนโลยีทางอาหาร",
    hostDepartmentAbbr: "FoodTech",
    description:
      "กิจกรรม workshop : Foodtech playground ให้ทุกคนได้รู้จักภาควิชาในมุมมองใหม่จากพี่ๆในภาควิชาและร่วมเล่นเกมที่ทำให้รู้จักกระบวนการผลิตอาหารตั้งแต่จุดเริ่มต้นจนได้เป็นผลิตภัณฑ์ เปิดมุมมองใหม่ที่ได้ทั้งความรู้และความสนุก",
    image: "/logo.png",
    slots: [
      new TimeSlot({
        round: 1,
        date: new Date("2025-10-18"),
        start: new Time(10, 0),
        end: new Time(10, 45),
      }),
      new TimeSlot({
        round: 2,
        date: new Date("2025-10-18"),
        start: new Time(11, 15),
        end: new Time(12, 0),
      }),
      new TimeSlot({
        round: 3,
        date: new Date("2025-10-18"),
        start: new Time(14, 15),
        end: new Time(15, 0),
      }),
      new TimeSlot({
        round: 4,
        date: new Date("2025-10-18"),
        start: new Time(15, 30),
        end: new Time(16, 15),
      }),
    ],
  },
  {
    id: "contour-landform-drawing",
    title: "ขีด Contour สร้าง Landform",
    capacity: 20,
    description:
      "แบ่งผู้ร่วมกิจกรรมออกเป็นกลุ่มเตรียม contour line ให้ผู้ร่วมกิจกรรมโดยแต่ละคนในกลุ่มจะได้รับรูปแบบที่ต่างกัน จากนั้นผู้ร่วมกิจกรรมจับคู่ภาพตัดขวางของตนกับภาพสถานที่ท่องเที่ยว จากนั้นให้ตอบคำถาม  โดยจะมีตัวอย่างหินให้ได้ศึกษาด้วย",
    hostDepartment: "ธรณีวิทยา",
    hostDepartmentAbbr: "Geo",
    image: "/logo.png",
    slots: [
      new TimeSlot({
        round: 1,
        date: new Date("2025-10-18"),
        start: new Time(10, 0),
        end: new Time(11, 0),
      }),
      new TimeSlot({
        round: 2,
        date: new Date("2025-10-18"),
        start: new Time(11, 15),
        end: new Time(12, 15),
      }),
      new TimeSlot({
        round: 3,
        date: new Date("2025-10-18"),
        start: new Time(13, 30),
        end: new Time(14, 30),
      }),
      new TimeSlot({
        round: 4,
        date: new Date("2025-10-18"),
        start: new Time(14, 45),
        end: new Time(15, 45),
      }),
    ],
  },
];

export function getWorkshopById(id: string) {
  return workshops.find((it) => it.id === id);
}
