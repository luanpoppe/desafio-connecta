import React from "react";
import { cn } from "../../utils/cn";

interface SummaryItem {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down";
  /** "accent": valor principal, ex. totais (usa cor de ênfase da paleta) */
  valueEmphasis?: "default" | "accent";
}

interface SummaryStripProps {
  items: SummaryItem[];
  className?: string;
}

export function SummaryStrip({ items, className }: SummaryStripProps) {
  return (
    <div
      className={cn(
        "flex items-stretch divide-x divide-border/85",
        "rounded-[var(--radius-xl)] border border-border/90 bg-surface",
        "shadow-panel",
        className,
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-1 px-6 py-4 min-w-0">
          <span className="text-[11px] font-[580] uppercase tracking-[0.07em] text-text-muted">
            {item.label}
          </span>
          <span
            className={cn(
              "text-2xl font-[660] tracking-[-0.03em] tabular-nums",
              item.valueEmphasis === "accent"
                ? "text-accent-foreground"
                : "text-text",
            )}
          >
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
