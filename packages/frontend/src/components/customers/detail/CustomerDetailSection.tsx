import type { UseQueryResult } from "@tanstack/react-query";
import { EmptyState, Panel, PanelBody } from "@connecta/design-system";
import type { CartsByUserWithSummaryResponse } from "../../../api/@types/cart.types";
import type { UserDto } from "../../../api/@types/user.types";
import { CustomerSelectionDetail } from "./CustomerSelectionDetail";

interface CustomerDetailSectionProps {
  selectedUserId: number | null;
  selectedUser: UserDto | undefined;
  cartsQuery: UseQueryResult<CartsByUserWithSummaryResponse, Error>;
}

function DetailEmpty() {
  return (
    <Panel>
      <PanelBody>
        <EmptyState
          title="Selecione um cliente"
          description="Clique numa linha da tabela acima para ver o resumo e as transações aqui em baixo."
        />
      </PanelBody>
    </Panel>
  );
}

export function CustomerDetailSection({
  selectedUserId,
  selectedUser,
  cartsQuery,
}: CustomerDetailSectionProps) {
  if (selectedUserId == null) {
    return <DetailEmpty />;
  }

  return (
    <CustomerSelectionDetail
      key={selectedUserId}
      selectedUser={selectedUser}
      cartsQuery={cartsQuery}
    />
  );
}
