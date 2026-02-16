import { PrismaClient, Prisma, Priority } from "@prisma/client";
import { computeSubmissionOutputs, type SubmissionInput } from "../src/lib/scoring";

const prisma = new PrismaClient();

const baseRecords: SubmissionInput[] = [
  {
    requestDate: "2026-02-01",
    requestorName: "Alex Morgan",
    requestorRoleTeam: "Product, CX",
    sponsorApprover: "Dana Reeves",
    projectName: "Support Copilot",
    priority: Priority.High,
    systemWhatDoesItDo: "Assists agents with draft responses and ticket summaries.",
    aiAutomationType: [
      "Generative AI (LLM, chatbot, content generation)",
      "Decision support / recommendation engine",
    ],
    aiAutomationTypeOther: "",
    vendorModelPlatform: "OpenAI Azure",
    deploymentModel: "Cloud SaaS (vendor-hosted)",
    endUsers: "Tier 1 and Tier 2 support agents",
    dataIngested: "Customer support tickets containing PII",
    outputsProduced: "Draft responses and intent tags",
    dataSensitivity: "PII / PHI / PCI",
    impactIfFails: "Reputational / regulatory exposure",
    humanOversight: "Human-on-the-loop (human monitors, can intervene)",
    biasFairnessRisks: "Potential language bias toward non-native speakers",
    thirdPartyVendorRisk: "vendor access to data through hosted API",
    accessControls: "SSO, RBAC scoped by support role",
    loggingMonitoring: "Centralized logs with SIEM alerts",
    incidentResponsePlan: "Playbook in ServiceNow",
    rollbackPlan: "Feature flag rollback in <5 minutes",
    dataRetentionDisposal: "30 day retention then automated purge",
    testingValidationDone: "Red-team prompts + QA benchmarks",
    legalComplianceReviewRequired: "Yes — route to Legal Compliance",
  },
  {
    requestDate: "2026-02-10",
    requestorName: "Jamie Chen",
    requestorRoleTeam: "Operations",
    sponsorApprover: "Leslie Park",
    projectName: "Invoice Routing Bot",
    priority: Priority.Medium,
    systemWhatDoesItDo: "Routes invoices to approvers based on thresholds.",
    aiAutomationType: ["Robotic Process Automation (RPA)"],
    aiAutomationTypeOther: "",
    vendorModelPlatform: "UiPath",
    deploymentModel: "On-premises",
    endUsers: "Finance AP team",
    dataIngested: "Invoice metadata",
    outputsProduced: "Approval queue routing",
    dataSensitivity: "Internal / business confidential",
    impactIfFails: "Operational disruption (delayed deliverables)",
    humanOversight: "Human-in-the-loop (human approves every action)",
    biasFairnessRisks: "N/A",
    thirdPartyVendorRisk: "Minimal risk documented",
    accessControls: "Role-based approvals",
    loggingMonitoring: "Workflow audit logs",
    incidentResponsePlan: "Ops on-call escalation",
    rollbackPlan: "Disable bot and revert to manual routing",
    dataRetentionDisposal: "One fiscal year",
    testingValidationDone: "UAT completed with AP team",
    legalComplianceReviewRequired:
      "No — standard intake, no legal triggers identified",
  },
];

// Map computed string outputs into Prisma enum types (required for TS build on Vercel).
const riskMap: Record<string, Prisma.RiskLevel> = {
  Low: Prisma.RiskLevel.Low,
  Medium: Prisma.RiskLevel.Medium,
  High: Prisma.RiskLevel.High,
};

const triageMap: Record<string, Prisma.TriageOutcome> = {
  NOT_AI_NO_SCREENING_NEEDED: Prisma.TriageOutcome.NOT_AI_NO_SCREENING_NEEDED,
  REQUIRES_MORE_INFORMATION: Prisma.TriageOutcome.REQUIRES_MORE_INFORMATION,
  READY_FOR_SCREENING: Prisma.TriageOutcome.READY_FOR_SCREENING,
};

function toDate(d: string | Date): Date {
  return d instanceof Date ? d : new Date(d);
}

async function main() {
  await prisma.submission.deleteMany();

  for (const record of baseRecords) {
    const computed = computeSubmissionOutputs(record);

    const mappedRisk =
      riskMap[String((computed as unknown as { riskLevel: string }).riskLevel)] ??
      Prisma.RiskLevel.Medium;

    const mappedTriage =
      triageMap[
        String((computed as unknown as { triageOutcome: string }).triageOutcome)
      ] ?? Prisma.TriageOutcome.REQUIRES_MORE_INFORMATION;

    // Build the payload explicitly so TS cannot infer riskLevel/triageOutcome as strings
    // and so requestDate always matches Prisma DateTime type.
    const data: Prisma.SubmissionCreateInput = {
      ...(record as unknown as Prisma.SubmissionCreateInput),
      ...(computed as unknown as Prisma.SubmissionCreateInput),

      // hard overrides AFTER spreads (order matters)
      requestDate: toDate(record.requestDate),
      riskLevel: mappedRisk,
      triageOutcome: mappedTriage,
      priority: record.priority,
    };

    await prisma.submission.create({ data });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
