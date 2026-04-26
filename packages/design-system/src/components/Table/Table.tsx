import React from "react";
import { cn } from "../../utils/cn";

export function Table({ children, className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("border-b border-border bg-neutral-50/70", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-border", className)} {...props}>
      {children}
    </tbody>
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  interactive?: boolean;
}
export function TableRow({ children, className, selected, interactive, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors duration-100",
        interactive && "cursor-pointer hover:bg-neutral-50/80",
        selected && "bg-accent-subtle hover:bg-accent-subtle",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

interface TableThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
}
export function TableTh({ children, className, align = "left", ...props }: TableThProps) {
  return (
    <th
      className={cn(
        "px-6 py-3 text-[11px] font-[620] text-text-muted uppercase tracking-[0.06em] whitespace-nowrap",
        align === "center" && "text-center",
        align === "right"  && "text-right",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

interface TableTdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  muted?: boolean;
}
export function TableTd({ children, className, align = "left", muted = false, ...props }: TableTdProps) {
  return (
    <td
      className={cn(
        "px-6 py-3.5 text-sm whitespace-nowrap",
        muted ? "text-text-muted font-[420]" : "text-text font-[450]",
        align === "center" && "text-center",
        align === "right"  && "text-right",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}
