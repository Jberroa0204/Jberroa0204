import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { IntakeWizard } from "@/components/intake/intake-wizard";

export default async function NewPage() {
  if (!(await isAuthenticated())) redirect("/login");

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-primary-ink">NeoXFortress AI Intake + Risk Triage</h1>
        <p className="text-sm text-slate-600">
          Governance intake aligned with NIST AI RMF domains: Govern, Map, Measure, and Manage.
        </p>
      </header>
      <IntakeWizard />
    </div>
  );
}
