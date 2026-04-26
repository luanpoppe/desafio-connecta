import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { fetchCartById } from "../../api/carts";
import { createTestQueryClient } from "./test-query-client";
import { useCartByIdQuery } from "../useCartByIdQuery";

jest.mock("../../api/carts", () => ({
  fetchCartById: jest.fn(),
}));

const mockedFetch = fetchCartById as jest.MockedFunction<typeof fetchCartById>;

function wrapper(queryClient: ReturnType<typeof createTestQueryClient>) {
  return function W({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

const liveCart = {
  id: 1,
  products: [],
  total: 10,
  discountedTotal: 9,
  userId: 2,
  totalProducts: 1,
  totalQuantity: 1,
};

describe("useCartByIdQuery", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it("does not fetch when cartId is null", async () => {
    const qc = createTestQueryClient();
    const { result } = renderHook(() => useCartByIdQuery(null), {
      wrapper: wrapper(qc),
    });

    await waitFor(() => expect(result.current.fetchStatus).toBe("idle"));
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("fetches when cartId is set and enabled by default", async () => {
    mockedFetch.mockResolvedValue(liveCart);
    const qc = createTestQueryClient();

    const { result } = renderHook(() => useCartByIdQuery(1), {
      wrapper: wrapper(qc),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedFetch).toHaveBeenCalledWith(1);
  });

  it("does not fetch when options.enabled is false even with cartId", async () => {
    const qc = createTestQueryClient();
    const { result } = renderHook(() => useCartByIdQuery(1, { enabled: false }), {
      wrapper: wrapper(qc),
    });

    await waitFor(() => expect(result.current.fetchStatus).toBe("idle"));
    expect(mockedFetch).not.toHaveBeenCalled();
    expect(result.current.status).toBe("pending");
  });
});
