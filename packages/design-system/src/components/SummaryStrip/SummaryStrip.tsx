import React from "react";
import { cn } from "../../utils/cn";

interface SummaryItem {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down";
}

interface SummaryStripProps {
  items: SummaryItem[];
  className?: string;
}

export function SummaryStrip({ items, className }: SummaryStripProps) {
  return (
    <div
      className={cn(
        "flex items-stretch divide-x divide-border",
        "rounded-[var(--radius-xl)] border border-border bg-surface",
        "shadow-[0_2px_16px_oklch(0%_0_0/0.06),0_1px_3px_oklch(0%_0_0/0.04)]",
        className,
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-1 px-6 py-4 min-w-0">
          <span className="text-[11px] font-[580] uppercase tracking-[0.07em] text-text-muted">
            {item.label}
          </span>
          <span className="text-2xl font-[660] tracking-[-0.03em] text-text tabular-nums">
            {item.value}
          </span>
          {item.subValue && (
            <span className="text-xs text-text-muted font-[420]">{item.subValue}</span>
          )}
        </div>
      ))}
    </div>
  );
}
