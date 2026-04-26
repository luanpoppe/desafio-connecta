import React from "react";
import { cn } from "../../utils/cn";

interface DividerProps {
  label?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Divider({ label, className, orientation = "horizontal" }: DividerProps) {
  if (orientation === "vertical") {
    return (
      <span className={cn("w-px self-stretch bg-border shrink-0", className)} aria-hidden />
    );
  }

  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)} role="separator">
        <span className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">{label}</span>
        <span className="flex-1 h-px bg-border" />
      </div>
    );
  }

  return <hr className={cn("border-0 h-px bg-border", className)} />;
}
