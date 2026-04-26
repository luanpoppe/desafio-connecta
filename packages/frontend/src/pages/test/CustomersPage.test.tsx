import { QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { createTestQueryClient } from "../../queries/test/test-query-client";
import { useCartsByUserQuery } from "../../queries/useCartsByUserQuery";
import { useUsersQuery } from "../../queries/useUsersQuery";
import { useCustomersUiStore } from "../../stores/customers-ui.store";
import { mockUser } from "../../test/fixtures/users";
import { CustomersPage } from "../CustomersPage";

jest.mock("../../queries/useUsersQuery");
jest.mock("../../queries/useCartsByUserQuery");

const mockedUsers = useUsersQuery as jest.MockedFunction<typeof useUsersQuery>;
const mockedCarts = useCartsByUserQuery as jest.MockedFunction<typeof useCartsByUserQuery>;

function cartsQueryResult() {
  return {
    data: undefined,
    isPending: false,
    isError: false,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    status: "pending" as const,
  };
}

function renderWithClient(ui: ReactElement) {
  const client = createTestQueryClient();
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("CustomersPage", () => {
  beforeEach(() => {
    useCustomersUiStore.setState({ selectedUserId: null });
    mockedUsers.mockReset();
    mockedCarts.mockReset();
    mockedCarts.mockReturnValue(cartsQueryResult() as ReturnType<typeof useCartsByUserQuery>);
  });

  it("clears selection when selected user is not on the current page", async () => {
    useCustomersUiStore.getState().selectUser(99);
    mockedUsers.mockReturnValue({
      data: {
        items: [mockUser({ id: 1 })],
        page: 1,
        pageSize: 5,
        totalItems: 1,
      },
      isPending: false,
      isError: false,
    } as ReturnType<typeof useUsersQuery>);

    renderWithClient(<CustomersPage />);

    await waitFor(() => expect(useCustomersUiStore.getState().selectedUserId).toBeNull());
  });

  it("keeps selection when selected user is in the current list", async () => {
    useCustomersUiStore.getState().selectUser(1);
    mockedUsers.mockReturnValue({
      data: {
        items: [mockUser({ id: 1 })],
        page: 1,
        pageSize: 5,
        totalItems: 1,
      },
      isPending: false,
      isError: false,
    } as ReturnType<typeof useUsersQuery>);

    renderWithClient(<CustomersPage />);

    await waitFor(() => expect(useCustomersUiStore.getState().selectedUserId).toBe(1));
  });
});
