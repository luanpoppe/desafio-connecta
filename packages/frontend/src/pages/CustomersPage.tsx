import { useEffect, useMemo, useState } from "react";
import {
  CUSTOMERS_PAGE_SIZE,
  CustomerDetailSection,
  CustomersListPanel,
} from "../components/customers";
import { Header } from "../components/Header";
import { useCartsByUserQuery } from "../queries/useCartsByUserQuery";
import { useUsersQuery } from "../queries/useUsersQuery";
import { useCustomersUiStore } from "../stores/customers-ui.store";

export function CustomersPage() {
  const [page, setPage] = useState(1);
  const selectedUserId = useCustomersUiStore((s) => s.selectedUserId);
  const selectUser = useCustomersUiStore((s) => s.selectUser);
  const clearSelection = useCustomersUiStore((s) => s.clearSelection);

  const usersQuery = useUsersQuery(page, CUSTOMERS_PAGE_SIZE);
  const cartsQuery = useCartsByUserQuery(selectedUserId);

  const itemIds = useMemo(() => {
    const list = usersQuery.data?.items ?? [];
    return new Set(list.map((u) => u.id));
  }, [usersQuery.data]);

  useEffect(() => {
    if (selectedUserId == null) return;
    if (!itemIds.has(selectedUserId)) clearSelection();
  }, [selectedUserId, itemIds, clearSelection]);

  const items = usersQuery.data?.items ?? [];
  const selectedUser = items.find((u) => u.id === selectedUserId);
  const pagination = usersQuery.data
    ? {
        page: usersQuery.data.page,
        pageSize: usersQuery.data.pageSize,
        totalItems: usersQuery.data.totalItems,
      }
    : null;

  return (
    <div className="min-h-dvh bg-bg">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6">
          <CustomersListPanel
            isPending={usersQuery.isPending}
            isError={usersQuery.isError}
            items={items}
            pagination={pagination}
            onPageChange={setPage}
            selectedUserId={selectedUserId}
            onSelectUser={selectUser}
          />

          <CustomerDetailSection
            selectedUserId={selectedUserId}
            selectedUser={selectedUser}
            cartsQuery={cartsQuery}
          />
        </div>
      </main>
    </div>
  );
}
