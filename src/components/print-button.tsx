"use client";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button variant="secondary" className="no-print" onClick={() => window.print()}>
      Print / Export PDF
    </Button>
  );
}
