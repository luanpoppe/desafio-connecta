import { useState } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Panel, PanelBody, PanelHeader, SummaryStrip } from "@connecta/design-system";
import type { CartsByUserWithSummaryResponse } from "../../../api/@types/cart.types";
import type { UserDto } from "../../../api/@types/user.types";
import { money } from "../customers.constants";
import { CartProductsModal } from "../cart-products";
import {
  TransactionsError,
  TransactionsLoading,
  TransactionsTable,
} from "./CustomerTransactionsViews";

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
      <CartProductsModal
        open={detailCartId != null}
        cartId={detailCartId}
        onOpenChange={(next) => {
          if (!next) setDetailCartId(null);
        }}
      />
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
