import {
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  Pagination,
  SkeletonTable,
} from "@connecta/design-system";
import type { UserDto } from "../../../api/@types/user.types";
import { CUSTOMERS_PAGE_SIZE } from "../customers.constants";
import { CustomersListTable } from "./CustomersListViews";

interface CustomersListPanelProps {
  isPending: boolean;
  isError: boolean;
  items: UserDto[];
  pagination: { page: number; pageSize: number; totalItems: number } | null;
  onPageChange: (page: number) => void;
  selectedUserId: number | null;
  onSelectUser: (id: number) => void;
}

export function CustomersListPanel({
  isPending,
  isError,
  items,
  pagination,
  onPageChange,
  selectedUserId,
  onSelectUser,
}: CustomersListPanelProps) {
  return (
    <Panel className="min-w-0">
      <PanelHeader
        title="Clientes"
        description={`${CUSTOMERS_PAGE_SIZE} por página — utilizadores sincronizados`}
      />
      <PanelBody className="p-0">
        {isPending ? (
          <div className="px-6 py-4">
            <SkeletonTable rows={5} cols={4} />
          </div>
        ) : isError ? (
          <div className="px-6 py-8 text-sm text-text-muted">
            Não foi possível carregar os clientes. Confirme o backend e
            VITE_API_BASE_URL.
          </div>
        ) : (
          <CustomersListTable
            items={items}
            selectedUserId={selectedUserId}
            onSelectUser={onSelectUser}
          />
        )}
      </PanelBody>
      {pagination != null && (
        <PanelFooter>
          <Pagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.totalItems}
            onPageChange={onPageChange}
            className="w-full"
          />
        </PanelFooter>
      )}
    </Panel>
  );
}
