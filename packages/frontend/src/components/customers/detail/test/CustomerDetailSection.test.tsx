import { QueryClientProvider } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import type { CartsByUserWithSummaryResponse } from "../../../../api/@types/cart.types";
import { createTestQueryClient } from "../../../../queries/test/test-query-client";
import { mockUser } from "../../../../test/fixtures/users";
import { CustomerDetailSection } from "../CustomerDetailSection";

function renderWithClient(ui: ReactElement) {
  const client = createTestQueryClient();
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

function cartsQueryStub(
  partial: Partial<UseQueryResult<CartsByUserWithSummaryResponse, Error>>,
): UseQueryResult<CartsByUserWithSummaryResponse, Error> {
  return {
    data: undefined,
    dataUpdatedAt: 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: "idle",
    isError: false,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    isPending: true,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: false,
    promise: Promise.resolve({} as CartsByUserWithSummaryResponse),
    refetch: jest.fn(),
    status: "pending",
    ...partial,
  } as UseQueryResult<CartsByUserWithSummaryResponse, Error>;
}

describe("CustomerDetailSection", () => {
  it("shows empty state when no user is selected", () => {
    renderWithClient(
      <CustomerDetailSection
        selectedUserId={null}
        selectedUser={undefined}
        cartsQuery={cartsQueryStub({})}
      />,
    );
    expect(screen.getByText("Selecione um cliente")).toBeInTheDocument();
  });

  it("shows transactions panel when a user is selected", () => {
    renderWithClient(
      <CustomerDetailSection
        selectedUserId={1}
        selectedUser={mockUser()}
        cartsQuery={cartsQueryStub({ isPending: true, isLoading: true, status: "pending" })}
      />,
    );
    expect(screen.getByText("Transações")).toBeInTheDocument();
  });
});
