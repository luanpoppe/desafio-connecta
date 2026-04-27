import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { fetchCartsByUserId } from "../../api/carts";
import { createTestQueryClient } from "./test-query-client";
import { useCartsByUserQuery } from "../useCartsByUserQuery";

jest.mock("../../api/carts", () => ({
  fetchCartsByUserId: jest.fn(),
}));

const mockedFetch = fetchCartsByUserId as jest.MockedFunction<typeof fetchCartsByUserId>;

function wrapper(queryClient: ReturnType<typeof createTestQueryClient>) {
  return function W({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useCartsByUserQuery", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it("does not call API when userId is null", async () => {
    const qc = createTestQueryClient();
    const { result } = renderHook(() => useCartsByUserQuery(null), {
      wrapper: wrapper(qc),
    });

    await waitFor(() => expect(result.current.fetchStatus).toBe("idle"));
    expect(result.current.status).toBe("pending");
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("fetches when userId is set", async () => {
    const payload = {
      carts: [],
      total: 0,
      skip: 0,
      limit: 10,
      summary: { transactionCount: 0, totalSum: 0 },
    };
    mockedFetch.mockResolvedValue(payload);
    const qc = createTestQueryClient();

    const { result } = renderHook(() => useCartsByUserQuery(5), {
      wrapper: wrapper(qc),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedFetch).toHaveBeenCalledWith(5);
    expect(result.current.data).toEqual(payload);
  });
});
