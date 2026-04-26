import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const skeletonVariants = cva("ds-skeleton block", {
  variants: {
    shape: {
      line: "rounded-[var(--radius-sm)]",
      circle: "rounded-full",
      rect: "rounded-[var(--radius-md)]",
    },
  },
  defaultVariants: {
    shape: "line",
  },
});

interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
  className?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ className, width, height, shape, style }: SkeletonProps) {
  return (
    <span
      className={cn(skeletonVariants({ shape }), className)}
      style={{ width, height, ...style }}
      aria-hidden
    />
  );
}

interface SkeletonRowProps {
  lines?: number;
  className?: string;
}

export function SkeletonRow({ lines = 2, className }: SkeletonRowProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 && lines > 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
}

export function SkeletonTable({ rows = 5, cols = 4 }: SkeletonTableProps) {
  return (
    <div className="w-full">
      <div className="flex gap-4 px-4 py-3 border-b border-border">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 items-center px-4 py-3.5 border-b border-border">
          <Skeleton shape="circle" width={32} height={32} className="shrink-0" />
          {Array.from({ length: cols - 1 }).map((_, c) => (
            <Skeleton
              key={c}
              className="h-3.5 flex-1"
              style={{ width: c === cols - 2 ? "40%" : undefined }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export { skeletonVariants };
