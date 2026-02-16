import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/print-button";

export default async function SubmissionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) notFound();

  const generatedAt = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-ink">Triage Summary</h1>
        <PrintButton />
      </div>

      <Card className="print-memo space-y-5">
        <div className="print-header hidden">
          <div>
            <p className="text-sm font-semibold text-primary-ink">NeoXFortress</p>
            <p className="text-lg font-bold text-primary-ink">AI Intake & Triage Summary</p>
          </div>
          <p className="text-xs text-slate-500">Generated {generatedAt.toLocaleString()}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-600">Submission ID</p>
            <p className="font-mono text-sm">{submission.id}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Request Date</p>
            <p className="text-sm font-semibold">{new Date(submission.requestDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{submission.priority}</Badge>
          <Badge className={submission.riskLevel === "High" ? "bg-red-100 text-red-700" : submission.riskLevel === "Medium" ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-800"}>{submission.riskLevel}</Badge>
          <Badge className="bg-slate-100 text-slate-700">{submission.triageOutcome.replaceAll("_", " ")}</Badge>
        </div>

        <div>
          <p className="text-sm text-slate-600">System Name</p>
          <p className="text-lg font-semibold text-primary-ink">{submission.projectName}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-600">Risk Score</p>
            <div className="mt-1 h-3 w-full rounded bg-slate-200"><div className="h-3 rounded bg-primary-ink" style={{ width: `${submission.riskScore}%` }} /></div>
            <p className="mt-1 text-sm font-bold text-primary-ink">{submission.riskScore} / 100</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Routing Recommendation</p>
            <ul className="list-inside list-disc text-sm">
              {(submission.routingRecommendation as string[]).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-600">Conditions Requiring Additional Information</p>
          <ul className="list-inside list-disc text-sm">
            {(submission.conditionsInfoNeeded as string[]).length === 0 ? <li>None</li> : (submission.conditionsInfoNeeded as string[]).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-600">Required Controls Checklist</p>
          <ul className="grid list-inside list-disc gap-1 text-sm md:grid-cols-2">{(submission.requiredControlsChecklist as string[]).map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </Card>
    </div>
  );
}
