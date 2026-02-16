import type React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary-ink",
        className
      )}
      {...props}
    />
  );
}
