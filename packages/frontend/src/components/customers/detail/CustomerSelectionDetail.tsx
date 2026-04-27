import { lazy, Suspense, useState } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Panel, PanelBody, PanelHeader, Spinner, SummaryStrip } from "@connecta/design-system";
import type { CartsByUserWithSummaryResponse } from "../../../api/@types/cart.types";
import type { UserDto } from "../../../api/@types/user.types";
import { money } from "../customers.constants";
import {
  TransactionsError,
  TransactionsLoading,
  TransactionsTable,
} from "./CustomerTransactionsViews";

const CartProductsModal = lazy(() =>
  import("../cart-products/CartProductsModal").then((m) => ({ default: m.CartProductsModal })),
);

interface CustomerSelectionDetailProps {
  selectedUser: UserDto | undefined;
  cartsQuery: UseQueryResult<CartsByUserWithSummaryResponse, Error>;
}

export function CustomerSelectionDetail({
  selectedUser,
  cartsQuery,
}: CustomerSelectionDetailProps) {
  const [detailCartId, setDetailCartId] = useState<number | null>(null);

  const customerName =
    selectedUser != null
      ? `${selectedUser.firstName} ${selectedUser.lastName}`.trim()
      : undefined;

  const quantityDisplay = cartsQuery.data?.summary.transactionCount ?? "—";
  const totalDisplay = cartsQuery.data
    ? money.format(cartsQuery.data.summary.totalSum)
    : "—";

  return (
    <div className="flex flex-col gap-4 min-w-0">
      {detailCartId != null && (
        <Suspense
          fallback={
            <div className="flex items-center justify-center gap-2 rounded-panel border border-border-muted bg-surface-muted/40 py-12 text-sm text-text-muted">
              <Spinner />
              <span>A carregar…</span>
            </div>
          }
        >
          <CartProductsModal
            open
            cartId={detailCartId}
            onOpenChange={(next) => {
              if (!next) setDetailCartId(null);
            }}
          />
        </Suspense>
      )}
      <SummaryStrip
        items={[
          {
            label: "Quantidade",
            value: quantityDisplay,
            subValue: customerName,
          },
          {
            label: "Total",
            value: totalDisplay,
            valueEmphasis: "accent",
          },
        ]}
      />

      <Panel className="min-w-0 flex-1">
        <PanelHeader
          title="Transações"
          description="Carrinhos do cliente. Clique numa linha para ver os produtos no detalhe."
        />
        <PanelBody className="p-0">
          {cartsQuery.isPending ? (
            <TransactionsLoading />
          ) : cartsQuery.isError ? (
            <TransactionsError />
          ) : (
            <TransactionsTable
              carts={cartsQuery.data?.carts ?? []}
              onSelectTransaction={setDetailCartId}
            />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}
