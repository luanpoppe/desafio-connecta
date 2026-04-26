import { QueryClientProvider } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import type { CartsByUserWithSummaryResponse } from "../../../../api/@types/cart.types";
import { createTestQueryClient } from "../../../../queries/test/test-query-client";
import { mockUser } from "../../../../test/fixtures/users";
import { CustomerSelectionDetail } from "../CustomerSelectionDetail";

jest.mock("../../../../api/carts", () => {
  const actual = jest.requireActual<typeof import("../../../../api/carts")>("../../../../api/carts");
  return {
    ...actual,
    fetchCartById: jest.fn().mockResolvedValue({
      id: 100,
      products: [
        {
          id: 1,
          title: "Item",
          price: 1,
          quantity: 1,
          total: 1,
          discountPercentage: 0,
          discountedTotal: 1,
          thumbnail: "https://example.com/i.png",
        },
      ],
      total: 1,
      discountedTotal: 1,
      userId: 1,
      totalProducts: 1,
      totalQuantity: 1,
    }),
  };
});

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

const summaryData: CartsByUserWithSummaryResponse = {
  carts: [{ id: 100, total: 50, discountedTotal: 45, userId: 1, totalProducts: 2, totalQuantity: 3 }],
  total: 1,
  skip: 0,
  limit: 10,
  summary: { transactionCount: 2, totalSum: 120.5 },
};

describe("CustomerSelectionDetail", () => {
  it("shows dashes in summary while carts are still loading", () => {
    renderWithClient(
      <CustomerSelectionDetail
        selectedUser={mockUser({ firstName: "Bob", lastName: "Lee" })}
        cartsQuery={cartsQueryStub({
          isPending: true,
          isLoading: true,
          status: "pending",
          data: undefined,
        })}
      />,
    );
    expect(screen.getByText("Quantidade")).toBeInTheDocument();
    expect(screen.getByText("Bob Lee")).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/—/);
  });

  it("formats summary when data is present", () => {
    renderWithClient(
      <CustomerSelectionDetail
        selectedUser={mockUser()}
        cartsQuery={cartsQueryStub({
          isPending: false,
          isLoading: false,
          status: "success",
          isSuccess: true,
          data: summaryData,
        })}
      />,
    );
    expect(screen.getByText("Quantidade")).toBeInTheDocument();
    expect(document.body.textContent).toContain("2");
    expect(document.body.textContent).toMatch(/120,50/);
  });

  it("shows loading state for transactions", () => {
    renderWithClient(
      <CustomerSelectionDetail
        selectedUser={mockUser()}
        cartsQuery={cartsQueryStub({ isPending: true, isLoading: true, status: "pending" })}
      />,
    );
    expect(screen.getByText(/A carregar/i)).toBeInTheDocument();
  });

  it("shows error state for transactions", () => {
    renderWithClient(
      <CustomerSelectionDetail
        selectedUser={mockUser()}
        cartsQuery={cartsQueryStub({
          isPending: false,
          isError: true,
          isLoading: false,
          status: "error",
        })}
      />,
    );
    expect(screen.getByText(/Não foi possível carregar as transações/i)).toBeInTheDocument();
  });

  it("opens modal when a transaction row is clicked and closes via modal", async () => {
    const user = userEvent.setup();
    renderWithClient(
      <CustomerSelectionDetail
        selectedUser={mockUser()}
        cartsQuery={cartsQueryStub({
          isPending: false,
          status: "success",
          isSuccess: true,
          data: summaryData,
        })}
      />,
    );

    const txRow = screen.getByRole("row", { name: /identificador 100/i });
    await user.click(txRow);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Transação #100/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
