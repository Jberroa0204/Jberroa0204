import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/print-button";

export default async function SubmissionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Triage Summary</h1>
        <PrintButton />
      </div>

      <Card className="print-full space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{submission.priority}</Badge>
          <Badge className={submission.riskLevel === "High" ? "bg-red-100 text-red-700" : submission.riskLevel === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}>{submission.riskLevel}</Badge>
          <Badge>{submission.triageOutcome.replaceAll("_", " ")}</Badge>
        </div>
        <div>
          <p className="text-sm text-slate-600">Project</p>
          <p className="text-lg font-semibold">{submission.projectName}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-600">Risk score</p>
            <div className="mt-1 h-3 w-full rounded bg-slate-200"><div className="h-3 rounded bg-primary" style={{ width: `${submission.riskScore}%` }} /></div>
            <p className="mt-1 text-sm font-medium">{submission.riskScore} / 100</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Routing recommendation</p>
            <ul className="list-inside list-disc text-sm">
              {(submission.routingRecommendation as string[]).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-600">Conditions requiring info</p>
          <ul className="list-inside list-disc text-sm">{(submission.conditionsInfoNeeded as string[]).map((item) => <li key={item}>{item}</li>)}</ul>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-600">Required controls checklist</p>
          <ul className="grid list-inside list-disc gap-1 text-sm md:grid-cols-2">{(submission.requiredControlsChecklist as string[]).map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </Card>
    </div>
  );
}
