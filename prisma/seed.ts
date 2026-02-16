import { PrismaClient, Priority } from "@prisma/client";
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
    aiAutomationType: ["Generative AI (LLM, chatbot, content generation)", "Decision support / recommendation engine"],
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
    legalComplianceReviewRequired: "Yes — route to Legal Compliance"
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
    legalComplianceReviewRequired: "No — standard intake, no legal triggers identified"
  }
];

async function main() {
  await prisma.submission.deleteMany();

  for (const record of baseRecords) {
    const computed = computeSubmissionOutputs(record);
    await prisma.submission.create({ data: { ...record, ...computed, requestDate: new Date(record.requestDate) } });
  }
}

main().finally(async () => prisma.$disconnect());
