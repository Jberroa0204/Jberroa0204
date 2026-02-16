import { NextResponse } from "next/server";
import { intakeSchema } from "@/lib/validation";
import { computeSubmissionOutputs } from "@/lib/scoring";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const raw = await req.json();
  const parsed = intakeSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const computed = computeSubmissionOutputs(parsed.data);
  const created = await prisma.submission.create({
    data: {
      ...parsed.data,
      requestDate: new Date(parsed.data.requestDate),
      ...computed
    }
  });

  return NextResponse.json({ id: created.id });
}
