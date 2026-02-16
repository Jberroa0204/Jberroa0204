import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function SubmissionsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const riskLevel = typeof params.riskLevel === "string" ? params.riskLevel : "";
  const triageOutcome = typeof params.triageOutcome === "string" ? params.triageOutcome : "";
  const priority = typeof params.priority === "string" ? params.priority : "";

  const submissions = await prisma.submission.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { projectName: { contains: q } },
                { requestorName: { contains: q } }
              ]
            }
          : {},
        riskLevel ? { riskLevel: riskLevel as never } : {},
        triageOutcome ? { triageOutcome: triageOutcome as never } : {},
        priority ? { priority: priority as never } : {}
      ]
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Submissions</h1>
      <Card>
        <form className="grid gap-3 md:grid-cols-5">
          <input name="q" defaultValue={q} placeholder="Search project or requestor" className="rounded-md border border-border px-3 py-2 text-sm" />
          <select name="riskLevel" defaultValue={riskLevel} className="rounded-md border border-border px-3 py-2 text-sm"><option value="">All risk</option><option>Low</option><option>Medium</option><option>High</option></select>
          <select name="triageOutcome" defaultValue={triageOutcome} className="rounded-md border border-border px-3 py-2 text-sm"><option value="">All triage</option><option value="NOT_AI_NO_SCREENING_NEEDED">Not AI</option><option value="REQUIRES_MORE_INFORMATION">More Info</option><option value="READY_FOR_SCREENING">Ready</option></select>
          <select name="priority" defaultValue={priority} className="rounded-md border border-border px-3 py-2 text-sm"><option value="">All priority</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select>
          <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white">Apply</button>
        </form>
      </Card>
      <Card className="overflow-auto p-0">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left"><tr><th className="p-3">Project</th><th>Requestor</th><th>Priority</th><th>Risk</th><th>Triage</th><th>Updated</th></tr></thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3"><Link className="text-primary underline" href={`/submissions/${s.id}`}>{s.projectName}</Link></td>
                <td>{s.requestorName}</td>
                <td><Badge>{s.priority}</Badge></td>
                <td><Badge className={s.riskLevel === "High" ? "bg-red-100 text-red-700" : s.riskLevel === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}>{s.riskLevel} ({s.riskScore})</Badge></td>
                <td><Badge>{s.triageOutcome.replaceAll("_", " ")}</Badge></td>
                <td>{new Date(s.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
