"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/new", label: "New" },
  { href: "/submissions", label: "Submissions" },
  { href: "/admin/rules", label: "Rules" }
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/new" aria-label="NeoXFortress Home">
          <LogoMark />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-[#0A2540] transition-colors",
                  active ? "bg-[#E8FCF9] text-primary-ink" : "hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <span className="hidden rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-slate-600 sm:inline-flex">
            Internal Demo
          </span>
        </div>
      </div>
    </nav>
  );
}
