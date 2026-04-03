import { competitors } from "@src/db/schema/competitor.schema";
import { actions, type ActionReturnType } from "astro:actions";

type Step = "input" | "view-score-and-certificate";

export class ClaimState {
  currentStep: Step = $state("input");
  formValues = $state({
    teamNumberPart: "",
    contactInfo: "",
    printingName: "",
  });

  data = $state({
    team: undefined as typeof competitors.$inferSelect | undefined,
    score: null as number | null,
    certUrl: null as string | null,
  });

  errorMap = $state({
    inputStep: null as string | null,
  });

  startOver() {
    this.currentStep = "input";
    this.formValues.teamNumberPart = "";
    this.formValues.contactInfo = "";
    this.formValues.printingName = "";
    this.data.team = undefined;
    this.data.score = null;
    this.data.certUrl = null;
    this.errorMap.inputStep = null;
  }

  resetError() {
    this.errorMap.inputStep = null;
  }

  async verifyTeam() {
    this.resetError();

    const { data, error } = await actions.competition.getCertificate({
      contactInfo: this.formValues.contactInfo,
      printingName: this.formValues.printingName,
      teamId: this.formValues.teamNumberPart,
    });

    if (error) {
      this.errorMap.inputStep = error.message;
      return;
    }

    this.currentStep = "view-score-and-certificate";
    this.data.team = data.team ?? undefined;
    this.data.certUrl = data.certUrl ?? null;
  }
}
