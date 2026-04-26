import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  [
    // Pill shape por padrão — rounded-full
    "inline-flex items-center justify-center rounded-full",
    "font-[560] tracking-[-0.01em] cursor-pointer",
    "transition-all duration-150 outline-none select-none shrink-0 whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        primary: [
          "text-on-accent",
          "bg-accent",
          "shadow-[0_1px_2px_color-mix(in_oklch,var(--color-text)_20%,transparent),0_0_0_1px_var(--color-accent-active),inset_0_1px_0_color-mix(in_oklch,var(--color-on-accent)_20%,transparent)]",
          "hover:bg-accent-hover",
          "hover:shadow-[0_2px_12px_color-mix(in_oklch,var(--color-accent)_45%,transparent),0_0_0_1px_var(--color-accent-active),inset_0_1px_0_color-mix(in_oklch,var(--color-on-accent)_22%,transparent)]",
          "active:bg-accent-active active:translate-y-px",
          "active:shadow-[0_1px_2px_color-mix(in_oklch,var(--color-text)_15%,transparent),0_0_0_1px_var(--color-accent-active)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none",
          "disabled:cursor-not-allowed disabled:translate-y-0",
        ],
        secondary: [
          "bg-surface text-text",
          "shadow-sm ring-1 ring-inset ring-border/70",
          "hover:bg-surface-subtle",
          "hover:shadow-md hover:ring-border/90",
          "active:bg-surface-inset active:translate-y-px",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0",
        ],
        ghost: [
          "bg-transparent text-text-secondary",
          "hover:bg-surface-subtle hover:text-text",
          "active:bg-surface-inset active:translate-y-px",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0",
        ],
        danger: [
          "text-on-accent",
          "bg-error",
          "shadow-[0_1px_2px_color-mix(in_oklch,var(--color-text)_20%,transparent),0_0_0_1px_color-mix(in_oklch,var(--color-error)_80%,oklch(20%_0.05_22)),inset_0_1px_0_color-mix(in_oklch,var(--color-on-accent)_18%,transparent)]",
          "hover:bg-[oklch(47%_0.18_22)]",
          "hover:shadow-[0_2px_12px_color-mix(in_oklch,var(--color-error)_40%,transparent),0_0_0_1px_color-mix(in_oklch,var(--color-error)_80%,oklch(20%_0.05_22)),inset_0_1px_0_color-mix(in_oklch,var(--color-on-accent)_20%,transparent)]",
          "active:bg-[oklch(42%_0.18_22)] active:translate-y-px",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0",
        ],
      },
      size: {
        sm: "h-7  px-3.5 text-xs  gap-1.5",
        md: "h-9  px-5   text-sm  gap-2",
        lg: "h-11 px-6   text-sm  gap-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({
  variant,
  size,
  loading = false,
  icon,
  iconPosition = "left",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden
        />
      ) : (
        icon && iconPosition === "left" && (
          <span className="shrink-0 flex items-center">{icon}</span>
        )
      )}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0 flex items-center">{icon}</span>
      )}
    </button>
  );
}

export { buttonVariants };
export type { ButtonProps };
