import { Card } from "@/components/ui/card";

export default function RulesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Scoring Rubric (Read-only)</h1>
      <Card>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>Data Sensitivity: Public 5, Internal 15, PII/PHI/PCI 30, Classified 40.</li>
          <li>Impact: Minor 5, Operational 15, Financial 25, Safety 35, Regulatory 30.</li>
          <li>Oversight: In-loop 5, On-loop 15, Out-loop 30.</li>
          <li>Vendor risk: external vendor or Cloud SaaS +10, extended vendor-risk narrative +5.</li>
          <li>AI type: Generative +10, Decision support +10.</li>
          <li>Score capped at 100; Low 0-33, Medium 34-66, High 67-100.</li>
        </ul>
      </Card>
    </div>
  );
}
