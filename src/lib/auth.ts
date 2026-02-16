import { cookies } from "next/headers";
import { createHash } from "crypto";

const SESSION_COOKIE = "neoxfortress_session";

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function secret() {
  return process.env.SESSION_SECRET ?? "dev-secret-change-me";
}

export async function setSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, digest(`ok:${secret()}`), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === digest(`ok:${secret()}`);
}

export function validatePassword(input: string) {
  const configured = process.env.DEMO_PASSWORD;
  if (!configured) return false;
  return input === configured;
}
