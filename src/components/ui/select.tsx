import type React from "react";
import { cn } from "@/lib/utils";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-primary-ink outline-none ring-primary/30 transition focus:ring-2",
        props.className
      )}
    />
  );
}
