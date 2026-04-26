import React from "react";
import { cn } from "../../utils/cn";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function Panel({ children, className, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] border border-border/90 bg-surface",
        "shadow-panel",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface PanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}
export function PanelHeader({ title, description, action, className, ...props }: PanelHeaderProps) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4 px-6 py-4 border-b border-border", className)}
      {...props}
    >
      <div className="min-w-0">
        <h2 className="text-[15px] font-[620] tracking-[-0.02em] text-text truncate">{title}</h2>
        {description && (
          <p className="text-xs text-text-muted mt-0.5 font-[420]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function PanelBody({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function PanelFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 py-3.5 border-t border-border/80",
        "bg-surface-subtle rounded-b-[var(--radius-xl)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
