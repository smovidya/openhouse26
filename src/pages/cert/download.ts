import type { APIRoute } from "astro";
import { actions } from "astro:actions";

export const GET: APIRoute = async ({ callAction }) => {
  let checkEligibilityResult = await callAction(
    actions.checkSurveyEligibility,
    {},
  );

  if (checkEligibilityResult.error) {
    return new Response(checkEligibilityResult.error.message, { status: 500 });
  }

  if (checkEligibilityResult.data.status !== "name_confirmed") {
    // redirect to /cert to further redirect properly
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/cert",
      },
    });
  }

  let getCertificatePDFResult = await callAction(actions.getCertificatePDF, {});

  if (getCertificatePDFResult.error) {
    return new Response(getCertificatePDFResult.error.message, { status: 500 });
  }

  return new Response(new Uint8Array(getCertificatePDFResult.data.pdfUint8), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="sci-chula-openhouse-2026.pdf"`,
    },
  });
};
