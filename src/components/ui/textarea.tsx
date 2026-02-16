import type React from "react";
import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-24 w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-primary-ink outline-none ring-primary/30 transition focus:ring-2",
        props.className
      )}
    />
  );
}
