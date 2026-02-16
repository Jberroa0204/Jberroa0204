export const aiTypeOptions = [
  "Generative AI (LLM, chatbot, content generation)",
  "Predictive / analytical model",
  "Robotic Process Automation (RPA)",
  "Decision support / recommendation engine",
  "Monitoring / anomaly detection",
  "Other"
] as const;

export type IntakeFormValues = {
  requestDate: string;
  requestorName: string;
  requestorRoleTeam: string;
  sponsorApprover: string;
  projectName: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  systemWhatDoesItDo: string;
  aiAutomationType: string[];
  aiAutomationTypeOther?: string;
  vendorModelPlatform?: string;
  deploymentModel: string;
  endUsers: string;
  dataIngested?: string;
  outputsProduced?: string;
  dataSensitivity: string;
  impactIfFails: string;
  humanOversight?: string;
  biasFairnessRisks: string;
  thirdPartyVendorRisk: string;
  accessControls: string;
  loggingMonitoring?: string;
  incidentResponsePlan: string;
  rollbackPlan?: string;
  dataRetentionDisposal: string;
  testingValidationDone: string;
  legalComplianceReviewRequired: string;
};
