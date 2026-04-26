import React from "react";
import { cn } from "../../utils/cn";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
}

export function Tag({ children, className, onRemove }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-xs)] bg-neutral-100 px-1.5 py-0.5",
        "text-xs text-text-secondary font-medium",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 text-text-muted hover:text-text transition-colors outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
          aria-label="Remover"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
