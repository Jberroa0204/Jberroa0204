import { NextResponse } from "next/server";
import { setSession, validatePassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  if (!validatePassword(body.password ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await setSession();
  return NextResponse.json({ ok: true });
}
