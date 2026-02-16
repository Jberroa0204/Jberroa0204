import test from 'node:test';
import assert from 'node:assert/strict';
import { computeSubmissionOutputs } from '../src/lib/scoring.ts';

const base = {
  requestDate: '2026-02-01', requestorName: 'A', requestorRoleTeam: 'Team', sponsorApprover: 'Boss', projectName: 'Proj', priority: 'High',
  systemWhatDoesItDo: 'Does a useful thing with data workflows', aiAutomationType: ['Predictive / analytical model'], aiAutomationTypeOther: '',
  vendorModelPlatform: 'Internal Model', deploymentModel: 'On-premises', endUsers: 'Ops', dataIngested: 'internal logs', outputsProduced: 'scores',
  dataSensitivity: 'Internal / business confidential', impactIfFails: 'Operational disruption (delayed deliverables)',
  humanOversight: 'Human-on-the-loop (human monitors, can intervene)', biasFairnessRisks: 'Low', thirdPartyVendorRisk: 'None', accessControls: 'RBAC',
  loggingMonitoring: 'SIEM', incidentResponsePlan: 'Playbook', rollbackPlan: 'Revert version', dataRetentionDisposal: '90 days', testingValidationDone: 'done',
  legalComplianceReviewRequired: 'No — standard intake, no legal triggers identified'
};

test('identifies non-AI for RPA only', () => {
  const out = computeSubmissionOutputs({ ...base, aiAutomationType: ['Robotic Process Automation (RPA)'] });
  assert.equal(out.isAIConfirmed, false);
  assert.equal(out.triageOutcome, 'NOT_AI_NO_SCREENING_NEEDED');
});

test('identifies AI when Other has text', () => {
  const out = computeSubmissionOutputs({ ...base, aiAutomationType: ['Other'], aiAutomationTypeOther: 'custom model' });
  assert.equal(out.isAIConfirmed, true);
});

test('requires info when required fields missing', () => {
  const out = computeSubmissionOutputs({ ...base, rollbackPlan: '' });
  assert.equal(out.triageOutcome, 'REQUIRES_MORE_INFORMATION');
  assert.ok(out.conditionsInfoNeeded.includes('Rollback plan'));
});

test('ready for screening when complete and AI', () => {
  const out = computeSubmissionOutputs(base);
  assert.equal(out.triageOutcome, 'READY_FOR_SCREENING');
});

test('score maps and caps at 100', () => {
  const out = computeSubmissionOutputs({ ...base, dataSensitivity: 'Classified / controlled (CUI, ITAR, etc.)', impactIfFails: 'Safety / mission-critical impact', humanOversight: 'Human-out-of-the-loop (fully automated)', aiAutomationType: ['Generative AI (LLM, chatbot, content generation)', 'Decision support / recommendation engine'], deploymentModel: 'Cloud SaaS (vendor-hosted)', thirdPartyVendorRisk: 'x'.repeat(41)});
  assert.equal(out.riskScore, 100);
  assert.equal(out.riskLevel, 'High');
});

test('adds legal compliance routing for yes', () => {
  const out = computeSubmissionOutputs({ ...base, legalComplianceReviewRequired: 'Yes — route to Legal Compliance' });
  assert.ok(out.routingRecommendation.includes('Route to Legal Compliance'));
});

test('adds data coe flag for unsure', () => {
  const out = computeSubmissionOutputs({ ...base, legalComplianceReviewRequired: 'Unsure — flag for Data & AI guidance' });
  assert.ok(out.routingRecommendation.includes('Flag Data & AI CoE guidance'));
});

test('adds vendor controls when vendor access to data appears', () => {
  const out = computeSubmissionOutputs({ ...base, thirdPartyVendorRisk: 'There is vendor access to data during retraining operations and support.' });
  assert.ok(out.requiredControlsChecklist.some((x) => x.includes('Vendor security review')));
});

test('adds generative AI controls', () => {
  const out = computeSubmissionOutputs({ ...base, aiAutomationType: ['Generative AI (LLM, chatbot, content generation)'] });
  assert.ok(out.requiredControlsChecklist.includes('Jailbreak testing'));
});
