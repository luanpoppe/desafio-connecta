import React from "react";
import { cn } from "../../utils/cn";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={cn("flex items-center justify-between text-sm text-text-secondary", className)}>
      <span className="text-xs text-text-muted">
        {total === 0 ? "Nenhum resultado" : `${from}–${to} de ${total}`}
      </span>
      <div className="flex items-center gap-1">
        <NavButton onClick={() => onPageChange(page - 1)} disabled={!canPrev} label="Anterior">
          <ChevronLeft />
        </NavButton>
        <span className="px-2 tabular-nums text-xs font-medium text-text">
          {page} / {totalPages || 1}
        </span>
        <NavButton onClick={() => onPageChange(page + 1)} disabled={!canNext} label="Próximo">
          <ChevronRight />
        </NavButton>
      </div>
    </div>
  );
}

function NavButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "size-7 flex cursor-pointer items-center justify-center rounded-[var(--radius-sm)]",
        "text-text-secondary transition-colors duration-150 outline-none",
        "hover:bg-surface-subtle hover:text-text",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        "disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
