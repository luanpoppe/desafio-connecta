import React, { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Código ou mensagem a mostrar debaixo do título (ex.: nº de transação) */
  kicker?: string;
  /**
   * `md`: largura adequada a formulários e textos.
   * `lg`: tabelas ou conteúdo largo (p.ex. muitas colunas).
   */
  size?: "md" | "lg";
  className?: string;
}

/**
 * Janela modal com overlay, tecla Esc e três focos mínimos de acessibilidade
 * (role=dialog, aria-modal, título com id).
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  kicker,
  children,
  size = "md",
  className,
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const hasDescription = description != null && description.length > 0;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (typeof document === "undefined" || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-text/20 backdrop-blur-[2px] [pointer-events:auto]"
        aria-label="Fechar janela"
        onClick={() => onOpenChange(false)}
      />
      <div className="pointer-events-none fixed inset-0 flex max-h-dvh items-end justify-center p-0 sm:items-center sm:p-4">
        <div
          role="dialog"
          aria-modal
          aria-labelledby={titleId}
          aria-describedby={hasDescription ? descId : undefined}
          className={cn(
            "pointer-events-auto flex w-full flex-col overflow-hidden rounded-t-[var(--radius-xl)] border border-border/90 bg-surface shadow-lg sm:rounded-[var(--radius-xl)]",
            size === "lg"
              ? "max-h-[min(95dvh,960px)] max-w-[min(96vw,72rem)]"
              : "max-h-[min(92dvh,880px)] max-w-2xl",
            className,
          )}
        >
          <header className="flex items-start justify-between gap-3 border-b border-border/80 px-5 py-4 sm:px-6 sm:py-4">
            <div className="min-w-0">
              {kicker != null && kicker.length > 0 && (
                <p className="text-[11px] font-[580] uppercase tracking-[0.08em] text-text-muted">
                  {kicker}
                </p>
              )}
              <h2
                id={titleId}
                className="text-base font-[620] tracking-[-0.02em] text-text pr-2"
              >
                {title}
              </h2>
              {hasDescription && (
                <p id={descId} className="text-xs text-text-muted mt-1 font-[420] pr-2">
                  {description}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="shrink-0"
              aria-label="Fechar"
            >
              Fechar
            </Button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:px-6 sm:py-4">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
