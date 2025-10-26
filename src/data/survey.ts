import { departments } from "./departments";

export enum QuestionType {
  BASE_QUESTION = "base_question",
  FREE_TEXT = "free_text",
  NUMBER = "number",
  SINGLE_CHOICE = "single_choice",
  MULTIPLE_CHOICE = "multiple_choice",
  RATING_SCALE_1_TO_5 = "rating_scale_1_to_5",
}

export class QuestionOption {
  id: string;
  text: string;

  constructor({ id, text }: { id?: string; text: string }) {
    this.id = id || text;
    this.text = text;
  }
}

export class DynamicQuestionGenerator<Input = {}> {}

export class Question<Value> {
  id: string;
  title: string;
  order: number;
  type: QuestionType = QuestionType.BASE_QUESTION;
  value: Value | null = null;

  constructor({
    id,
    title,
    order,
    type,
  }: {
    id: string;
    title: string;
    order: number;
    type: QuestionType;
  }) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.type = type;
  }

  getValue(): Value | null {
    return this.value;
  }

  setValue(value: Value) {
    this.value = value;
  }
}

export class MultipleChoiceQuestion<Value = string[]> extends Question<Value> {
  options: QuestionOption[];
  maxSelections?: number;
  minSelections?: number;
  value: Value | null = null;

  constructor({
    id,
    title,
    order,
    options,
    maxSelections,
    minSelections,
  }: {
    id: string;
    title: string;
    order: number;
    options: (
      | string
      | {
          id: string;
          text: string;
        }
    )[];
    maxSelections?: number;
    minSelections?: number;
  }) {
    super({ id, title, order, type: QuestionType.MULTIPLE_CHOICE });
    this.options = options.map((option) => {
      if (typeof option === "string") {
        return new QuestionOption({ text: option });
      } else {
        return new QuestionOption({ id: option.id, text: option.text });
      }
    });
    this.maxSelections = maxSelections || options.length;
    this.minSelections = minSelections || 1;
  }

  override getValue(): Value | null {
    return this.value;
  }

  override setValue(value: Value) {
    this.value = value;
  }
}

export class SingleChoiceQuestion<Value = string> extends Question<Value> {
  options: QuestionOption[];

  constructor({
    id,
    title,
    order,
    options,
  }: {
    id: string;
    title: string;
    order: number;
    options: (
      | string
      | {
          id: string;
          text: string;
        }
    )[];
  }) {
    super({ id, title, order, type: QuestionType.SINGLE_CHOICE });
    this.options = options.map((option) => {
      if (typeof option === "string") {
        return new QuestionOption({ text: option });
      } else {
        return new QuestionOption({ id: option.id, text: option.text });
      }
    });
  }

  override getValue(): Value | null {
    return this.value;
  }

  override setValue(value: Value) {
    this.value = value;
  }
}

export class RatingScale1To5Question extends Question<number> {
  minLabel: string;
  maxLabel: string;

  constructor({
    id,
    title,
    order,
    minLabel,
    maxLabel,
  }: {
    id: string;
    title: string;
    order: number;
    minLabel: string;
    maxLabel: string;
  }) {
    super({ id, title, order, type: QuestionType.RATING_SCALE_1_TO_5 });
    this.minLabel = minLabel;
    this.maxLabel = maxLabel;
  }
}

export class QuestionBuilder {
  #questions: (
    | MultipleChoiceQuestion
    | SingleChoiceQuestion
    | RatingScale1To5Question
  )[] = [];

  multipleChoice(params: {
    id: string;
    title: string;
    order: number;
    options: (
      | string
      | {
          id: string;
          text: string;
        }
    )[];
    maxSelections?: number;
    minSelections?: number;
  }) {
    this.#questions.push(new MultipleChoiceQuestion<string[]>(params));
    return this;
  }

  singleChoice(params: {
    id: string;
    title: string;
    order: number;
    options: (
      | string
      | {
          id: string;
          text: string;
        }
    )[];
  }) {
    this.#questions.push(new SingleChoiceQuestion<string>(params));
    return this;
  }

  ratingScale1To5({
    minLabel = "ไม่เห็นด้วย",
    maxLabel = "ใช่แล้ว",
    ...rest
  }: {
    id: string;
    title: string;
    order: number;
    minLabel?: string;
    maxLabel?: string;
  }) {
    this.#questions.push(
      new RatingScale1To5Question({
        minLabel,
        maxLabel,
        ...rest,
      }),
    );
    return this;
  }
  build() {
    return this.#questions;
  }
}

export class QuestionFormGroup {
  public questions: (
    | MultipleChoiceQuestion
    | SingleChoiceQuestion
    | RatingScale1To5Question
  )[] = [];

  addQuestion(
    ...question: (
      | MultipleChoiceQuestion
      | SingleChoiceQuestion
      | RatingScale1To5Question
    )[]
  ) {
    this.questions.push(...question);
    return this;
  }

  constructor(
    public id: string,
    public name: string,
    questions?: (
      id: string,
      name: string,
      q: QuestionBuilder,
    ) => QuestionBuilder,
  ) {
    const qb = new QuestionBuilder();
    this.questions = questions ? questions(id, name, qb).build() : [];
  }
}

export class QuestionFormGroupBuilder {
  #questionFormGroup: QuestionFormGroup;

  constructor(id: string, name: string) {
    this.#questionFormGroup = new QuestionFormGroup(id, name);
  }

  group(
    id: string,
    name: string | ((q: QuestionFormGroup) => string),
    group: (q: QuestionBuilder) => QuestionBuilder,
  ) {
    name = typeof name === "string" ? name : name(this.#questionFormGroup);
    this.#questionFormGroup = new QuestionFormGroup(id, name, (id, name, q) =>
      group(q),
    );
    return this;
  }
}

export class QuestionForm {
  constructor(
    public id: string = "",
    public name: string = "",
    public groups: (f: QuestionFormGroupBuilder) => QuestionFormGroupBuilder,
  ) {
    this.groups = groups;
  }
}

export const surveyForm: QuestionForm = new QuestionForm(
  "feedback_survey",
  "ประเมินความพึงพอใจของผู้เข้าร่วมงาน",
  (g) =>
    g
      .group("purpose_of_attendance", "ข้อมูลส่วนตัว", (q) =>
        q.multipleChoice({
          id: "purpose_of_attendance",
          title: "ท่านเข้าร่วมงานครั้งนี้ด้วยเหตุผลใดบ้าง?",
          order: 1,
          options: [
            "สนใจศึกษาต่อ",
            "ดูสถานที่และบรรยากาศ",
            "มาเป็นเพื่อนกับเพื่อน",
            "รับเกียรติบัตร",
            "เข้าร่วมเวิร์กช็อป",
            "ศึกษาข้อมูลหลักสูตร",
            "พบกับนิสิตที่กำลังศึกษาในภาควิชาที่สนใจ",
          ],
        }),
      )
      .group("department_satisfaction", "ความพึงพอใจต่อภาควิชา", (q) =>
        q
          .multipleChoice({
            id: "interested_department",
            title: "ท่านสนใจเยี่ยมชมบูธของภาควิชาใดบ้าง?",
            options: departments.map((dept) => ({
              id: dept.enShortName,
              text: dept.thName,
            })),
            order: 1,
          })
          .multipleChoice({
            id: "most_statisfied_department",
            title: "ภาควิชาใดที่ท่านรู้สึกพึงพอใจมากที่สุด?",
            options: departments.map((dept) => ({
              id: dept.enShortName,
              text: dept.thName,
            })),
            order: 2,
          })
          .ratingScale1To5({
            id: "overall_satisfaction",
            title: "กิจกรรมในบูธต่าง ๆ น่าสนใจและเป็นประโยชน์",
            order: 3,
          }),
      )
      .group("place_satisfaction", "ความพึงพอใจต่อสถานที่จัดงาน", (q) =>
        q
          .ratingScale1To5({
            id: "crowdedness_satisfaction",
            title: "สถานที่จัดงานมีความเหมาะสม ไม่แออัดจนเกินไป",
            order: 1,
          })
          .ratingScale1To5({
            id: "traveling_convenience_satisfaction",
            title: "สถานที่จัดงานเดินทางมาได้สะดวก",
            order: 2,
          })
          .ratingScale1To5({
            id: "toilet_satisfaction",
            title: "สถานที่จัดงานมีห้องน้ำเพียงพอ",
            order: 3,
          })
          .ratingScale1To5({
            id: "nursing_point_satisfaction",
            title: "จุดที่ตั้งของจุดพยาบาลมีความเหมาะสม",
            order: 4,
          })
          .ratingScale1To5({
            id: "cleanliness_satisfaction",
            title: "สถานที่จัดงานมีความสะอาดและจุดทิ้งขยะเหมาะสม",
            order: 5,
          }),
      )
      .group("registration_satisfaction", "ความพึงพอใจต่อการลงทะเบียน", (q) =>
        q
          .ratingScale1To5({
            id: "website_easy_to_find",
            title: "เว็บไซต์ง่ายต่อการเข้าถึง",
            order: 1,
          })
          .ratingScale1To5({
            id: "ease_of_usage",
            title: "เว็บไซต์ใช้งานง่าย",
            order: 2,
          })
          .ratingScale1To5({
            id: "beatifulness_of_website",
            title: "เว็บไซต์มีความสวยงามน่าใช้งาน",
            order: 3,
          }),
      )
      .group("activity_satisfaction", "ความพึงพอใจต่อกิจกรรมในงาน", (q) =>
        q
          .ratingScale1To5({
            id: "activity_information_sufficiency",
            title: "ท่านได้รับข้อมูลเกี่ยวกับงานครบถ้วน ไม่สับสน",
            order: 1,
          })
          .ratingScale1To5({
            id: "souvenir_satisfaction",
            title: "ของที่ระลึกที่ได้รับมีความน่าสนใจและเหมาะสม",
            order: 4,
          }),
      )
      .group("workshop_statisfaction", "ความพึงพอใจต่อเวิร์กช็อป", (q) =>
        q
          .ratingScale1To5({
            id: "workshop_registration_duration_satisfaction",
            title: "ระยะเวลาในการลงทะเบียนเวิร์กช็อปมีความเหมาะสม",
            order: 2,
          })
          .ratingScale1To5({
            id: "workshop_availability_satisfaction",
            title: "ท่านสามารถเข้าร่วมเวิร์กช็อปได้ตามที่ต้องการ",
            order: 3,
          }),
      )
      .group("department_booth_feedback", "ความคิดเห็นต่อบูธภาควิชา", (q) => q)
      .group("overall_feedback", "ความเห็นในภาพรวม", (q) =>
        q
          .ratingScale1To5({
            id: "overall_experience_satisfaction",
            title: "โดยรวมแล้ว ท่านรู้สึกพึงพอใจกับงานนี้เพียงใด",
            order: 1,
            minLabel: "ไม่พึงพอใจเลย",
            maxLabel: "พึงพอใจมาก",
          })
          .ratingScale1To5({
            id: "recommendation_likelihood",
            order: 2,
            minLabel: "ไม่แนะนำเลย",
            maxLabel: "แนะนำแน่นอน",
            title: "หากมีโอกาสหน้าท่านจะแนะนำ Sci Chula Openhouse แก่ผู้อื่น",
          })
          .singleChoice({
            id: "further_study_intention",
            title:
              "หลังจากเข้าร่วมงาน ท่านมีความคิดที่จะศึกษาต่อในคณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัยหรือไม่?",
            options: [
              {
                id: "yes",
                text: "สนใจศึกษาต่อ",
              },
              {
                id: "maybe",
                text: "ขอพิจารณาก่อน",
              },
              {
                id: "no",
                text: "ไม่สนใจศึกษาต่อ",
              },
            ],
            order: 3,
          }),
      ),
);
