import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-[550] tracking-[-0.01em] ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-700 ring-neutral-200",
        accent:  "bg-accent-subtle text-accent ring-[oklch(85%_0.10_270)]",
        success: "bg-success-subtle text-success ring-[oklch(85%_0.10_155)]",
        warning: "bg-warning-subtle text-warning ring-[oklch(88%_0.10_72)]",
        error:   "bg-error-subtle text-error ring-[oklch(88%_0.10_22)]",
        info:    "bg-info-subtle text-info ring-[oklch(85%_0.10_240)]",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const dotVariants = cva("size-1.5 rounded-full shrink-0", {
  variants: {
    variant: {
      default: "bg-neutral-500",
      accent:  "bg-accent",
      success: "bg-success",
      warning: "bg-warning",
      error:   "bg-error",
      info:    "bg-info",
    },
  },
  defaultVariants: { variant: "default" },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant, size, children, className, dot = false }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {dot && <span className={dotVariants({ variant })} aria-hidden />}
      {children}
    </span>
  );
}

export { badgeVariants };
export type { BadgeProps };
