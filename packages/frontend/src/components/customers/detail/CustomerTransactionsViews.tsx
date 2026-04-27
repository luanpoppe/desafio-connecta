import {
  ResponsiveDataTable,
  Spinner,
  type ResponsiveDataColumn,
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

const TRANSACTION_COLUMNS: ResponsiveDataColumn<
  CartsByUserWithSummaryResponse["carts"][number]
>[] = CUSTOMER_TRANSACTION_TABLE_COLUMNS.map((c) => ({
  id: c.id,
  header: c.header,
  cell: c.cell,
  align: c.align === "right" ? "right" : "left",
  muted: c.muted,
  className: c.className,
}));

export function TransactionsTable({
  carts,
  onSelectTransaction,
}: {
  carts: CartsByUserWithSummaryResponse["carts"];
  onSelectTransaction: (cartId: number) => void;
}) {
  if (carts.length === 0) {
    return (
      <p className="px-6 py-10 text-center text-sm text-text-muted border-b border-border">
        Sem transações para este cliente.
      </p>
    );
  }

  return (
    <ResponsiveDataTable
      rows={carts}
      columns={TRANSACTION_COLUMNS}
      getRowKey={(c) => c.id}
      mobileStackOnly
      rowInteraction={{
        type: "action",
        onActivate: (c) => onSelectTransaction(c.id),
        getRowAriaLabel: (c) =>
          `Ver produtos desta transação, identificador ${c.id}.`,
      }}
    />
  );
}
