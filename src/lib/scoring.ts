import type { IntakeFormValues } from "./types";

const AI_TYPES = [
  "Generative AI (LLM, chatbot, content generation)",
  "Predictive / analytical model",
  "Decision support / recommendation engine",
  "Monitoring / anomaly detection"
];

const EXTERNAL_VENDORS = ["openai", "anthropic", "google", "aws", "microsoft", "azure", "meta", "cohere", "ibm"];

export type SubmissionInput = IntakeFormValues;

export function computeSubmissionOutputs(values: SubmissionInput) {
  const isAIConfirmed =
    values.aiAutomationType.some((type) => AI_TYPES.includes(type)) ||
    (values.aiAutomationType.includes("Other") && Boolean(values.aiAutomationTypeOther?.trim()));

  const missingForInfo = [
    ["vendorModelPlatform", "Vendor / model platform"],
    ["dataIngested", "Data ingested"],
    ["outputsProduced", "Outputs produced"],
    ["rollbackPlan", "Rollback plan"],
    ["loggingMonitoring", "Logging & monitoring"],
    ["humanOversight", "Human oversight"]
  ].flatMap(([key, label]) => {
    const v = values[key as keyof SubmissionInput];
    return typeof v === "string" && v.trim().length > 0 ? [] : [label];
  });

  let riskScore = 0;
  const dataMap: Record<string, number> = {
    "Public / non-sensitive": 5,
    "Internal / business confidential": 15,
    "PII / PHI / PCI": 30,
    "Classified / controlled (CUI, ITAR, etc.)": 40
  };
  riskScore += dataMap[values.dataSensitivity] ?? 0;

  const impactMap: Record<string, number> = {
    "Minor inconvenience (workaround available)": 5,
    "Operational disruption (delayed deliverables)": 15,
    "Financial / contractual exposure": 25,
    "Safety / mission-critical impact": 35,
    "Reputational / regulatory exposure": 30
  };
  riskScore += impactMap[values.impactIfFails] ?? 0;

  const oversightMap: Record<string, number> = {
    "Human-in-the-loop (human approves every action)": 5,
    "Human-on-the-loop (human monitors, can intervene)": 15,
    "Human-out-of-the-loop (fully automated)": 30
  };
  riskScore += oversightMap[values.humanOversight ?? ""] ?? 0;

  const vendorText = (values.vendorModelPlatform ?? "").toLowerCase();
  if (values.deploymentModel === "Cloud SaaS (vendor-hosted)" || EXTERNAL_VENDORS.some((v) => vendorText.includes(v))) {
    riskScore += 10;
  }
  if ((values.thirdPartyVendorRisk ?? "").trim().length > 40) riskScore += 5;
  if (values.aiAutomationType.includes("Generative AI (LLM, chatbot, content generation)")) riskScore += 10;
  if (values.aiAutomationType.includes("Decision support / recommendation engine")) riskScore += 10;
  riskScore = Math.min(100, riskScore);

  const riskLevel = riskScore <= 33 ? "Low" : riskScore <= 66 ? "Medium" : "High";

  const triageOutcome = !isAIConfirmed
    ? "NOT_AI_NO_SCREENING_NEEDED"
    : missingForInfo.length > 0
      ? "REQUIRES_MORE_INFORMATION"
      : "READY_FOR_SCREENING";

  const routingRecommendation: string[] = [];
  if (triageOutcome === "READY_FOR_SCREENING" && isAIConfirmed) {
    routingRecommendation.push("Route to Responsible AI Screening");
  }
  if (values.legalComplianceReviewRequired === "Yes — route to Legal Compliance") {
    routingRecommendation.push("Route to Legal Compliance");
  }
  if (values.legalComplianceReviewRequired === "Unsure — flag for Data & AI guidance") {
    routingRecommendation.push("Flag Data & AI CoE guidance");
  }

  const requiredControlsChecklist = new Set<string>([
    "Access control",
    "Logging and monitoring",
    "Rollback capability",
    "Incident response plan",
    "Data retention and disposal plan"
  ]);

  if (["PII / PHI / PCI", "Classified / controlled (CUI, ITAR, etc.)"].includes(values.dataSensitivity)) {
    ["Encryption in transit/at rest", "Data minimization", "Retention limits", "Vendor DPA and attestations"].forEach((i) =>
      requiredControlsChecklist.add(i)
    );
  }
  if (values.humanOversight === "Human-out-of-the-loop (fully automated)") {
    ["Mandatory human override + kill switch", "Tighter monitoring thresholds", "Staged rollout gates"].forEach((i) =>
      requiredControlsChecklist.add(i)
    );
  }
  if (values.aiAutomationType.includes("Generative AI (LLM, chatbot, content generation)")) {
    [
      "Prompt logging and redaction",
      "Content filtering",
      "Jailbreak testing",
      "Model/vendor usage policy",
      "Output human review for high-risk decisions"
    ].forEach((i) => requiredControlsChecklist.add(i));
  }
  if ((values.thirdPartyVendorRisk ?? "").toLowerCase().includes("vendor access to data")) {
    requiredControlsChecklist.add("Vendor security review (SOC2, SLAs, breach notification)");
  }
  if (
    values.impactIfFails.includes("Safety / mission-critical") ||
    values.impactIfFails.includes("regulatory")
  ) {
    ["Formal validation protocol", "Audit readiness artifacts", "Ongoing monitoring cadence"].forEach((i) =>
      requiredControlsChecklist.add(i)
    );
  }

  return {
    isAIConfirmed,
    riskScore,
    riskLevel,
    triageOutcome,
    routingRecommendation,
    conditionsInfoNeeded: missingForInfo,
    requiredControlsChecklist: Array.from(requiredControlsChecklist)
  };
}
