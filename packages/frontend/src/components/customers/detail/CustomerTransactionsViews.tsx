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
import { money } from "../customers.constants";

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
}: {
  carts: CartsByUserWithSummaryResponse["carts"];
}) {
  if (carts.length === 0) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableTd colSpan={5} muted className="text-center py-10">
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
          <TableTh>ID</TableTh>
          <TableTh align="right">Total</TableTh>
          <TableTh align="right">Produtos</TableTh>
          <TableTh align="right">Qtd.</TableTh>
          <TableTh align="right">Total c/ desc.</TableTh>
        </TableRow>
      </TableHead>
      <TableBody>
        {carts.map((c) => (
          <TableRow key={c.id}>
            <TableTd>{c.id}</TableTd>
            <TableTd align="right">{money.format(c.total)}</TableTd>
            <TableTd align="right">{c.totalProducts}</TableTd>
            <TableTd align="right">{c.totalQuantity}</TableTd>
            <TableTd align="right">{money.format(c.discountedTotal)}</TableTd>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
