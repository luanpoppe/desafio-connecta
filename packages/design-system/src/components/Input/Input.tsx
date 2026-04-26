import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const inputVariants = cva(
  [
    "w-full rounded-full border border-border/90 bg-surface text-sm text-text font-[450]",
    "placeholder:text-text-muted placeholder:font-normal",
    "transition-all duration-150 outline-none",
    "shadow-[0_1px_2px_oklch(0%_0_0/0.05),inset_0_1px_2px_oklch(0%_0_0/0.03)]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50",
  ],
  {
    variants: {
      state: {
        default: [
          "border-border-strong",
          "hover:border-neutral-400",
          "focus:border-accent focus:shadow-[0_0_0_3px_oklch(53%_0.22_270/0.15),0_1px_2px_oklch(0%_0_0/0.05)]",
        ],
        error: [
          "border-error",
          "focus:border-error focus:shadow-[0_0_0_3px_oklch(53%_0.18_22/0.15),0_1px_2px_oklch(0%_0_0/0.05)]",
        ],
      },
      size: {
        sm: "h-8  text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
      hasLeading:  { true: "pl-10", false: "pl-4" },
      hasTrailing: { true: "pr-10", false: "pr-4" },
    },
    defaultVariants: {
      state: "default",
      size: "md",
      hasLeading: false,
      hasTrailing: false,
    },
  },
);

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    Pick<VariantProps<typeof inputVariants>, "state" | "size"> {
  label?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  leadingIcon,
  trailingIcon,
  error,
  hint,
  state,
  size,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const resolvedState = error ? "error" : state;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-[560] text-text-secondary tracking-[-0.01em]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute left-3.5 flex items-center text-text-muted pointer-events-none">
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            inputVariants({ state: resolvedState, size, hasLeading: !!leadingIcon, hasTrailing: !!trailingIcon }),
            className,
          )}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {trailingIcon && (
          <span className="absolute right-3.5 flex items-center text-text-muted pointer-events-none">
            {trailingIcon}
          </span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-[450] text-error flex items-center gap-1 pl-1">
          <ErrorIcon />
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-text-muted pl-1">{hint}</p>
      )}
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
      <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M6 4v2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="6" cy="8.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

export { inputVariants };
export type { InputProps };
