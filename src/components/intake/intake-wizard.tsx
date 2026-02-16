"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { intakeSchema, type IntakeSchemaType } from "@/lib/validation";
import { aiTypeOptions } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const steps = ["Govern", "Map", "Measure", "Manage"];
const draftKey = "neoxfortress-intake-draft";

export function IntakeWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const raw = window.localStorage.getItem(draftKey);
    return raw ? (JSON.parse(raw) as IntakeSchemaType) : undefined;
  }, []);

  const { register, handleSubmit, watch, setValue } = useForm<IntakeSchemaType>({
    resolver: zodResolver(intakeSchema),
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

  watch((value) => {
    window.localStorage.setItem(draftKey, JSON.stringify(value));
  });

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
    <Card>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>Step {step + 1} of {steps.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full rounded bg-slate-200"><div className="h-2 rounded bg-primary" style={{ width: `${progress}%` }} /></div>
        <div className="mt-3 flex flex-wrap gap-2">{steps.map((s, i) => <span key={s} className={`rounded-full px-3 py-1 text-xs ${i === step ? "bg-primary text-white" : "bg-slate-100"}`}>{s}</span>)}</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 0 && <>
          <h2 className="font-semibold">Request Identification (Govern)</h2>
          <Input type="date" {...register("requestDate")} />
          <Input placeholder="Requestor name" {...register("requestorName")} />
          <Input placeholder="Requestor role/team" {...register("requestorRoleTeam")} />
          <Input placeholder="Sponsor/Approver" {...register("sponsorApprover")} />
          <Input placeholder="Project name" {...register("projectName")} />
          <Select {...register("priority")}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></Select>
        </>}
        {step === 1 && <>
          <h2 className="font-semibold">System Description (Map)</h2>
          <Textarea placeholder="What does the system do?" {...register("systemWhatDoesItDo")} />
          <div>
            <p className="mb-2 text-sm">AI / automation type</p>
            <div className="grid gap-2">
              {aiTypeOptions.map((opt) => (
                <label className="flex items-center gap-2 text-sm" key={opt}>
                  <input type="checkbox" checked={watch("aiAutomationType")?.includes(opt)} onChange={(e) => {
                    const prev = watch("aiAutomationType") || [];
                    setValue("aiAutomationType", e.target.checked ? [...prev, opt] : prev.filter((p) => p !== opt));
                  }} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          {watch("aiAutomationType")?.includes("Other") && <Input placeholder="Other AI type" {...register("aiAutomationTypeOther")} />}
          <Input placeholder="Vendor/model/platform" {...register("vendorModelPlatform")} />
          <Select {...register("deploymentModel")}>
            <option>Cloud SaaS (vendor-hosted)</option><option>Cloud IaaS/PaaS (org-hosted)</option><option>On-premises</option><option>Hybrid</option><option>Edge / embedded</option>
          </Select>
          <Input placeholder="End users" {...register("endUsers")} />
          <Textarea placeholder="Data ingested" {...register("dataIngested")} />
          <Textarea placeholder="Outputs produced" {...register("outputsProduced")} />
        </>}
        {step === 2 && <>
          <h2 className="font-semibold">Risk Assessment (Measure)</h2>
          <Select {...register("dataSensitivity")}>
            <option>Public / non-sensitive</option><option>Internal / business confidential</option><option>PII / PHI / PCI</option><option>Classified / controlled (CUI, ITAR, etc.)</option>
          </Select>
          <Select {...register("impactIfFails")}>
            <option>Minor inconvenience (workaround available)</option><option>Operational disruption (delayed deliverables)</option><option>Financial / contractual exposure</option><option>Safety / mission-critical impact</option><option>Reputational / regulatory exposure</option>
          </Select>
          <Select {...register("humanOversight")}>
            <option>Human-in-the-loop (human approves every action)</option><option>Human-on-the-loop (human monitors, can intervene)</option><option>Human-out-of-the-loop (fully automated)</option>
          </Select>
          <Textarea placeholder="Bias/fairness risks" {...register("biasFairnessRisks")} />
          <Textarea placeholder="Third-party/vendor risk" {...register("thirdPartyVendorRisk")} />
        </>}
        {step === 3 && <>
          <h2 className="font-semibold">Controls & Rollback (Manage)</h2>
          <Textarea placeholder="Access controls" {...register("accessControls")} />
          <Textarea placeholder="Logging/monitoring" {...register("loggingMonitoring")} />
          <Textarea placeholder="Incident response plan" {...register("incidentResponsePlan")} />
          <Textarea placeholder="Rollback plan" {...register("rollbackPlan")} />
          <Textarea placeholder="Data retention/disposal" {...register("dataRetentionDisposal")} />
          <Textarea placeholder="Testing/validation done" {...register("testingValidationDone")} />
          <Select {...register("legalComplianceReviewRequired")}>
            <option>Yes — route to Legal Compliance</option><option>No — standard intake, no legal triggers identified</option><option>Unsure — flag for Data & AI guidance</option>
          </Select>
        </>}

        <div className="flex justify-between">
          <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={() => setStep((s) => s + 1)}>Continue</Button>
          ) : (
            <Button type="submit" disabled={isPending}>{isPending ? "Submitting..." : "Submit Intake"}</Button>
          )}
        </div>
      </form>
    </Card>
  );
}
