import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "NeoXFortress AI Intake + Risk Triage",
  description: "NIST AI RMF aligned intake and triage workflow"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b border-border bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/new" className="font-semibold">NeoXFortress AI Intake</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/new">New</Link>
              <Link href="/submissions">Submissions</Link>
              <Link href="/admin/rules">Rules</Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
