"use client";

import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { intakeSchema, type IntakeSchemaType } from "@/lib/validation";
import { aiTypeOptions } from "@/lib/types";
import { computeSubmissionOutputs } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const steps = ["Govern", "Map", "Measure", "Manage"];
const draftKey = "neoxfortress-intake-draft";

function Field({
  label,
  helper,
  required,
  error,
  children
}: {
  label: string;
  helper?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-primary-ink">{label}</span>
        {required && <span className="text-xs text-destructive">*</span>}
      </div>
      {children}
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </label>
  );
}

export function IntakeWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const raw = window.localStorage.getItem(draftKey);
    return raw ? (JSON.parse(raw) as IntakeSchemaType) : undefined;
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<IntakeSchemaType>({
    resolver: zodResolver(intakeSchema),
    mode: "onBlur",
    defaultValues: defaultValues ?? {
      requestDate: new Date().toISOString().slice(0, 10),
      priority: "Medium",
      aiAutomationType: [],
      deploymentModel: "Cloud SaaS (vendor-hosted)",
      dataSensitivity: "Internal / business confidential",
      impactIfFails: "Operational disruption (delayed deliverables)",
      humanOversight: "Human-on-the-loop (human monitors, can intervene)",
      legalComplianceReviewRequired: "No — standard intake, no legal triggers identified"
    }
  });

  const values = watch();

  useEffect(() => {
    window.localStorage.setItem(draftKey, JSON.stringify(values));
  }, [values]);

  const riskPreview = useMemo(() => {
    if (step === 0 || !values.dataSensitivity || !values.impactIfFails) return null;
    try {
      return computeSubmissionOutputs(values as IntakeSchemaType);
    } catch {
      return null;
    }
  }, [values, step]);

  const onSubmit = (data: IntakeSchemaType) => {
    startTransition(async () => {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        window.localStorage.removeItem(draftKey);
        const payload = await res.json();
        router.push(`/submissions/${payload.id}`);
      }
    });
  };

  const progress = Math.round(((step + 1) / steps.length) * 100);

  return (
    <Card className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <div className="flex items-center gap-2">
            {riskPreview && (
              <Badge
                className={cn(
                  riskPreview.riskLevel === "High" && "bg-red-100 text-red-700",
                  riskPreview.riskLevel === "Medium" && "bg-amber-100 text-amber-800",
                  riskPreview.riskLevel === "Low" && "bg-teal-100 text-teal-800"
                )}
              >
                Risk Preview: {riskPreview.riskLevel}
              </Badge>
            )}
            <span>{progress}%</span>
          </div>
        </div>
        <div className="h-2 w-full rounded bg-slate-200">
          <div className="h-2 animate-grow rounded bg-primary" style={{ ["--progress-width" as string]: `${progress}%`, width: `${progress}%` }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <span
              key={s}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                i <= step ? "bg-primary text-primary-ink" : "bg-slate-100 text-slate-600"
              )}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-ink">Request Identification (Govern)</h2>
            <Field label="Request Date" required error={errors.requestDate?.message}><Input type="date" {...register("requestDate")} /></Field>
            <Field label="Responsible Party" required helper="Primary owner accountable for this intake request." error={errors.requestorName?.message}><Input placeholder="Full name" {...register("requestorName")} /></Field>
            <Field label="Business Unit" required helper="Team or function sponsoring implementation." error={errors.requestorRoleTeam?.message}><Input placeholder="e.g., Operations, Customer Support" {...register("requestorRoleTeam")} /></Field>
            <Field label="Sponsor / Approver" required error={errors.sponsorApprover?.message}><Input placeholder="Executive or manager approver" {...register("sponsorApprover")} /></Field>
            <Field label="System Name" required error={errors.projectName?.message}><Input placeholder="Program or initiative name" {...register("projectName")} /></Field>
            <Field label="Priority" required error={errors.priority?.message}><Select {...register("priority")}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></Select></Field>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-ink">System Description (Map)</h2>
            <Field label="System Responsibility" required helper="Describe intended capability and business outcomes." error={errors.systemWhatDoesItDo?.message}><Textarea placeholder="Describe what the system does and who it supports." {...register("systemWhatDoesItDo")} /></Field>
            <Field label="AI / Automation Type" required helper="Select all categories that apply." error={errors.aiAutomationType?.message as string | undefined}>
              <div className="grid gap-2 rounded-md border border-border p-3">
                {aiTypeOptions.map((opt) => (
                  <label className="flex items-center gap-2 text-sm" key={opt}>
                    <input
                      type="checkbox"
                      checked={values.aiAutomationType?.includes(opt)}
                      onChange={(e) => {
                        const prev = values.aiAutomationType || [];
                        setValue("aiAutomationType", e.target.checked ? [...prev, opt] : prev.filter((p) => p !== opt));
                      }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </Field>
            {values.aiAutomationType?.includes("Other") && (
              <Field label="Other AI Type" helper="Required only when 'Other' is selected."><Input placeholder="Specify AI type" {...register("aiAutomationTypeOther")} /></Field>
            )}
            <Field label="Vendor / Model / Platform" required helper="List internal model or external provider."><Input placeholder="Vendor/platform" {...register("vendorModelPlatform")} /></Field>
            <Field label="Deployment Model" required><Select {...register("deploymentModel")}><option>Cloud SaaS (vendor-hosted)</option><option>Cloud IaaS/PaaS (org-hosted)</option><option>On-premises</option><option>Hybrid</option><option>Edge / embedded</option></Select></Field>
            <Field label="End Users" required><Input placeholder="Who uses the outputs?" {...register("endUsers")} /></Field>
            <Field label="Data Ingested" required helper="Note key data sources and sensitivity."><Textarea placeholder="Input data sources" {...register("dataIngested")} /></Field>
            <Field label="Outputs Produced" required helper="Describe generated outputs and downstream usage."><Textarea placeholder="Output artifacts" {...register("outputsProduced")} /></Field>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-ink">Risk Assessment (Measure)</h2>
            <Field label="Data Sensitivity" required><Select {...register("dataSensitivity")}><option>Public / non-sensitive</option><option>Internal / business confidential</option><option>PII / PHI / PCI</option><option>Classified / controlled (CUI, ITAR, etc.)</option></Select></Field>
            <Field label="Impact if Fails" required><Select {...register("impactIfFails")}><option>Minor inconvenience (workaround available)</option><option>Operational disruption (delayed deliverables)</option><option>Financial / contractual exposure</option><option>Safety / mission-critical impact</option><option>Reputational / regulatory exposure</option></Select></Field>
            <Field label="Human Oversight" required helper="Define expected level of human supervision."><Select {...register("humanOversight")}><option>Human-in-the-loop (human approves every action)</option><option>Human-on-the-loop (human monitors, can intervene)</option><option>Human-out-of-the-loop (fully automated)</option></Select></Field>
            <Field label="Bias / Fairness Risks" required><Textarea placeholder="Known or anticipated fairness concerns" {...register("biasFairnessRisks")} /></Field>
            <Field label="Third-Party Vendor Risk" required helper="Include vendor data access and operational dependencies."><Textarea placeholder="Third-party risk notes" {...register("thirdPartyVendorRisk")} /></Field>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-ink">Controls & Rollback (Manage)</h2>
            <Field label="Access Controls" required><Textarea placeholder="Identity, RBAC, least privilege" {...register("accessControls")} /></Field>
            <Field label="Logging & Monitoring" required><Textarea placeholder="Telemetry, alerting, audit logs" {...register("loggingMonitoring")} /></Field>
            <Field label="Incident Response Plan" required><Textarea placeholder="Escalation and response workflow" {...register("incidentResponsePlan")} /></Field>
            <Field label="Rollback Plan" required><Textarea placeholder="Fallback path and recovery timing" {...register("rollbackPlan")} /></Field>
            <Field label="Data Retention / Disposal" required><Textarea placeholder="Retention periods and disposal controls" {...register("dataRetentionDisposal")} /></Field>
            <Field label="Testing / Validation Completed" required><Textarea placeholder="What tests and validations were performed?" {...register("testingValidationDone")} /></Field>
            <Field label="Legal Compliance Review Required" required><Select {...register("legalComplianceReviewRequired")}><option>Yes — route to Legal Compliance</option><option>No — standard intake, no legal triggers identified</option><option>Unsure — flag for Data & AI guidance</option></Select></Field>
          </section>
        )}

        <div className="flex justify-between border-t border-border pt-4">
          <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Intake"}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
