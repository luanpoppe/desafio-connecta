import { type KeyboardEvent } from "react";
import {
  Spinner,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableTd,
  TableTh,
} from "@connecta/design-system";
import type { CartsByUserWithSummaryResponse } from "../../../api/@types/cart.types";
import { CUSTOMER_TRANSACTION_TABLE_COLUMNS } from "./customerTransactionTableColumns";

export function TransactionsLoading() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-text-muted text-sm">
      <Spinner />
      <span>A carregar…</span>
    </div>
  );
}

export function TransactionsError() {
  return (
    <div className="px-6 py-8 text-sm text-text-muted">
      Não foi possível carregar as transações deste cliente.
    </div>
  );
}

export function TransactionsTable({
  carts,
  onSelectTransaction,
}: {
  carts: CartsByUserWithSummaryResponse["carts"];
  onSelectTransaction: (cartId: number) => void;
}) {
  const colCount = CUSTOMER_TRANSACTION_TABLE_COLUMNS.length;

  if (carts.length === 0) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableTd colSpan={colCount} muted className="text-center py-10">
              Sem transações para este cliente.
            </TableTd>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          {CUSTOMER_TRANSACTION_TABLE_COLUMNS.map((col) => (
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
        {carts.map((c) => (
          <TableRow
            key={c.id}
            interactive
            onClick={() => onSelectTransaction(c.id)}
            onKeyDown={(e: KeyboardEvent<HTMLTableRowElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectTransaction(c.id);
              }
            }}
            tabIndex={0}
            aria-label={`Ver produtos desta transação, identificador ${c.id}.`}
          >
            {CUSTOMER_TRANSACTION_TABLE_COLUMNS.map((col) => (
              <TableTd
                key={col.id}
                align={col.align === "right" ? "right" : "left"}
                muted={col.muted}
                className={col.className}
              >
                {col.cell(c)}
              </TableTd>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
