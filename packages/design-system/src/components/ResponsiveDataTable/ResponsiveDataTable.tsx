import React, { type KeyboardEvent } from "react";
import { cn } from "../../utils/cn";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableTd,
  TableTh,
} from "../Table/Table";

export type ResponsiveDataColumnAlign = "left" | "right";

export interface ResponsiveDataColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  align?: ResponsiveDataColumnAlign;
  muted?: boolean;
  className?: string;
}

export type ResponsiveDataRowInteraction<T> =
  | { type: "none" }
  | {
      type: "action";
      onActivate: (row: T) => void;
      getRowAriaLabel: (row: T) => string;
    }
  | {
      type: "select";
      selectedKey: string | number | null;
      onSelect: (row: T) => void;
      listboxAriaLabel: string;
    };

export interface ResponsiveDataTableProps<T> {
  rows: T[];
  columns: ResponsiveDataColumn<T>[];
  getRowKey: (row: T) => string | number;
  /** Default `{ type: "none" }`. */
  rowInteraction?: ResponsiveDataRowInteraction<T>;
  /**
   * When true, mobile shows only label/value rows for every column (no enlarged first column).
   */
  mobileStackOnly?: boolean;
  /** Rendered when `rows` is empty (table body is not shown). */
  empty?: React.ReactNode;
  /** Classes on the narrow-viewport list container. */
  mobileListClassName?: string;
  /** Classes on each static mobile card (`rowInteraction.type === "none"`). */
  mobileCardClassName?: string;
  /** Classes on the desktop table wrapper. */
  desktopTableWrapClassName?: string;
}

function isSelectedKey(
  selectedKey: string | number | null,
  rowKey: string | number,
): boolean {
  if (selectedKey === null) return false;
  return String(selectedKey) === String(rowKey);
}

function stackedFieldRow<T>(
  col: ResponsiveDataColumn<T>,
  row: T,
  opts: { tabularNums?: boolean } = {},
) {
  return (
    <div
      key={col.id}
      className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 min-w-0"
    >
      <span className="text-[11px] font-[620] uppercase tracking-[0.06em] text-text-muted shrink-0">
        {col.header}
      </span>
      <span
        className={cn(
          "min-w-0",
          opts.tabularNums && "tabular-nums",
          col.muted ? "text-text-muted font-[420]" : "text-text font-[450]",
          col.align === "right" && "text-right ml-auto",
          col.className,
        )}
      >
        {col.cell(row)}
      </span>
    </div>
  );
}

function activationHandlers(onActivate: () => void) {
  return {
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent<HTMLTableRowElement | HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    },
  };
}

export function ResponsiveDataTable<T>({
  rows,
  columns,
  getRowKey,
  rowInteraction = { type: "none" },
  mobileStackOnly = false,
  empty,
  mobileListClassName,
  mobileCardClassName,
  desktopTableWrapClassName,
}: ResponsiveDataTableProps<T>) {
  if (rows.length === 0) {
    if (empty != null) return <>{empty}</>;
    return null;
  }

  const leadColumn = mobileStackOnly || columns.length === 0 ? null : columns[0];
  const stackColumns = mobileStackOnly ? columns : columns.slice(1);

  const defaultMobileList =
    rowInteraction.type === "none"
      ? "md:hidden flex flex-col gap-3 px-4 py-4"
      : "md:hidden divide-y divide-border";

  const defaultMobileCard =
    "rounded-[var(--radius-md)] border border-border/80 bg-surface-subtle/50 p-4 shadow-sm";

  const narrowListClass = cn(defaultMobileList, mobileListClassName);

  const renderMobileStack = (row: T, opts?: { tabularNums?: boolean }) => (
    <div className="flex flex-col gap-2.5 text-sm">
      {(mobileStackOnly ? columns : stackColumns).map((col) =>
        stackedFieldRow(col, row, opts),
      )}
    </div>
  );

  const mobileRoot =
    rowInteraction.type === "select" ? (
      <div
        role="listbox"
        aria-label={rowInteraction.listboxAriaLabel}
        className={narrowListClass}
      >
        {rows.map((row) => {
          const key = getRowKey(row);
          const reactKey = String(key);
          const { onSelect, selectedKey } = rowInteraction;
          const selected = isSelectedKey(selectedKey, key);
          const className = cn(
            "w-full text-left px-4 py-4 transition-colors duration-100",
            "hover:bg-surface-subtle/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            selected && "bg-accent-subtle/95 hover:bg-accent-subtle/95",
          );
          const inner = (
            <>
              {leadColumn != null && (
                <div className="mb-3 min-w-0">{leadColumn.cell(row)}</div>
              )}
              <div className="grid gap-2 text-sm">{renderMobileStack(row)}</div>
            </>
          );
          return selected ? (
            <button
              key={reactKey}
              type="button"
              role="option"
              aria-selected="true"
              onClick={() => onSelect(row)}
              className={className}
            >
              {inner}
            </button>
          ) : (
            <button
              key={reactKey}
              type="button"
              role="option"
              aria-selected="false"
              onClick={() => onSelect(row)}
              className={className}
            >
              {inner}
            </button>
          );
        })}
      </div>
    ) : (
      <div className={narrowListClass}>
        {rows.map((row) => {
          const key = getRowKey(row);
          const reactKey = String(key);

          if (rowInteraction.type === "none") {
            return (
              <article
                key={reactKey}
                className={cn(defaultMobileCard, mobileCardClassName)}
              >
                {leadColumn != null && (
                  <div className="mb-3 min-w-0">{leadColumn.cell(row)}</div>
                )}
                {renderMobileStack(row)}
              </article>
            );
          }

          const { onActivate, getRowAriaLabel } = rowInteraction;
          return (
            <button
              key={reactKey}
              type="button"
              className={cn(
                "w-full text-left px-4 py-4 transition-colors duration-100 cursor-pointer",
                "hover:bg-surface-subtle/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
              aria-label={getRowAriaLabel(row)}
              {...activationHandlers(() => onActivate(row))}
            >
              {renderMobileStack(row, { tabularNums: true })}
            </button>
          );
        })}
      </div>
    );

  const desktopTable = (
    <div className={cn("hidden md:block w-full max-w-full", desktopTableWrapClassName)}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableTh
                key={col.id}
                align={col.align === "right" ? "right" : "left"}
              >
                {col.header}
              </TableTh>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const key = getRowKey(row);
            const reactKey = String(key);

            if (rowInteraction.type === "none") {
              return (
                <TableRow key={reactKey}>
                  {columns.map((col) => (
                    <TableTd
                      key={col.id}
                      align={col.align === "right" ? "right" : "left"}
                      muted={col.muted}
                      className={col.className}
                    >
                      {col.cell(row)}
                    </TableTd>
                  ))}
                </TableRow>
              );
            }

            if (rowInteraction.type === "action") {
              const { onActivate, getRowAriaLabel } = rowInteraction;
              return (
                <TableRow
                  key={reactKey}
                  interactive
                  tabIndex={0}
                  aria-label={getRowAriaLabel(row)}
                  {...activationHandlers(() => onActivate(row))}
                >
                  {columns.map((col) => (
                    <TableTd
                      key={col.id}
                      align={col.align === "right" ? "right" : "left"}
                      muted={col.muted}
                      className={col.className}
                    >
                      {col.cell(row)}
                    </TableTd>
                  ))}
                </TableRow>
              );
            }

            const { onSelect, selectedKey } = rowInteraction;
            const selected = isSelectedKey(selectedKey, key);
            return (
              <TableRow
                key={reactKey}
                interactive
                selected={selected}
                tabIndex={0}
                aria-selected={selected}
                {...activationHandlers(() => onSelect(row))}
              >
                {columns.map((col) => (
                  <TableTd
                    key={col.id}
                    align={col.align === "right" ? "right" : "left"}
                    muted={col.muted}
                    className={col.className}
                  >
                    {col.cell(row)}
                  </TableTd>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {mobileRoot}
      {desktopTable}
    </>
  );
}
