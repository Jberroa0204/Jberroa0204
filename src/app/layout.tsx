import type { ReactNode } from "react";
import "./globals.css";
import { AppNav } from "@/components/app-nav";

export const metadata = {
  title: "NeoXFortress AI Intake + Risk Triage",
  description: "NIST AI RMF aligned intake and triage workflow"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppNav />
        <main className="mx-auto mt-20 max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
