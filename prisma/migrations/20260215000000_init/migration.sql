-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('Critical', 'High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "TriageOutcome" AS ENUM ('NOT_AI_NO_SCREENING_NEEDED', 'REQUIRES_MORE_INFORMATION', 'READY_FOR_SCREENING');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "requestorName" TEXT NOT NULL,
    "requestorRoleTeam" TEXT NOT NULL,
    "sponsorApprover" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "systemWhatDoesItDo" TEXT NOT NULL,
    "aiAutomationType" JSONB NOT NULL,
    "aiAutomationTypeOther" TEXT,
    "vendorModelPlatform" TEXT,
    "deploymentModel" TEXT NOT NULL,
    "endUsers" TEXT NOT NULL,
    "dataIngested" TEXT,
    "outputsProduced" TEXT,
    "dataSensitivity" TEXT NOT NULL,
    "impactIfFails" TEXT NOT NULL,
    "humanOversight" TEXT,
    "biasFairnessRisks" TEXT NOT NULL,
    "thirdPartyVendorRisk" TEXT NOT NULL,
    "accessControls" TEXT NOT NULL,
    "loggingMonitoring" TEXT,
    "incidentResponsePlan" TEXT NOT NULL,
    "rollbackPlan" TEXT,
    "dataRetentionDisposal" TEXT NOT NULL,
    "testingValidationDone" TEXT NOT NULL,
    "legalComplianceReviewRequired" TEXT NOT NULL,
    "isAIConfirmed" BOOLEAN NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "triageOutcome" "TriageOutcome" NOT NULL,
    "routingRecommendation" JSONB NOT NULL,
    "conditionsInfoNeeded" JSONB NOT NULL,
    "requiredControlsChecklist" JSONB NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
