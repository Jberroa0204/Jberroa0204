import { z } from "zod";

export const intakeSchema = z.object({
  requestDate: z.string().min(1),
  requestorName: z.string().min(2),
  requestorRoleTeam: z.string().min(2),
  sponsorApprover: z.string().min(2),
  projectName: z.string().min(2),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  systemWhatDoesItDo: z.string().min(10),
  aiAutomationType: z.array(z.string()).min(1),
  aiAutomationTypeOther: z.string().optional(),
  vendorModelPlatform: z.string().optional(),
  deploymentModel: z.string().min(2),
  endUsers: z.string().min(2),
  dataIngested: z.string().optional(),
  outputsProduced: z.string().optional(),
  dataSensitivity: z.string().min(2),
  impactIfFails: z.string().min(2),
  humanOversight: z.string().optional(),
  biasFairnessRisks: z.string().min(2),
  thirdPartyVendorRisk: z.string().min(2),
  accessControls: z.string().min(2),
  loggingMonitoring: z.string().optional(),
  incidentResponsePlan: z.string().min(2),
  rollbackPlan: z.string().optional(),
  dataRetentionDisposal: z.string().min(2),
  testingValidationDone: z.string().min(2),
  legalComplianceReviewRequired: z.string().min(2)
});

export type IntakeSchemaType = z.infer<typeof intakeSchema>;
