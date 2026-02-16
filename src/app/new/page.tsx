import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { IntakeWizard } from "@/components/intake/intake-wizard";

export default async function NewPage() {
  if (!(await isAuthenticated())) redirect("/login");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">NeoXFortress AI Intake + Risk Triage</h1>
        <p className="text-sm text-slate-600">Structured intake aligned to NIST AI RMF: Govern, Map, Measure, Manage.</p>
      </header>
      <IntakeWizard />
    </div>
  );
}
