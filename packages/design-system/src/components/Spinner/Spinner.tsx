import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const spinnerVariants = cva(
  "rounded-full border-neutral-200 border-t-accent animate-spin",
  {
    variants: {
      size: {
        xs: "size-3 border",
        sm: "size-4 border-2",
        md: "size-5 border-2",
        lg: "size-7 border-[3px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
}

export function Spinner({ size, className, label = "Carregando" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size }), className)}
    />
  );
}

export { spinnerVariants };
export type { SpinnerProps };
