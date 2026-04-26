import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { fetchUsersPage } from "../../api/users";
import { createTestQueryClient } from "./test-query-client";
import { useUsersQuery } from "../useUsersQuery";

jest.mock("../../api/users", () => ({
  fetchUsersPage: jest.fn(),
}));

const mockedFetch = fetchUsersPage as jest.MockedFunction<typeof fetchUsersPage>;

function wrapper(queryClient: ReturnType<typeof createTestQueryClient>) {
  return function W({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useUsersQuery", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it("loads users page on success", async () => {
    const data = {
      items: [],
      totalItems: 0,
      page: 1,
      pageSize: 5,
    };
    mockedFetch.mockResolvedValue(data);
    const qc = createTestQueryClient();

    const { result } = renderHook(() => useUsersQuery(1, 5), {
      wrapper: wrapper(qc),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockedFetch).toHaveBeenCalledWith(1, 5);
  });

  it("surfaces errors from fetchUsersPage", async () => {
    mockedFetch.mockRejectedValue(new Error("network"));
    const qc = createTestQueryClient();

    const { result } = renderHook(() => useUsersQuery(1, 5), {
      wrapper: wrapper(qc),
    });

    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 10_000 });
    expect(result.current.error).toEqual(expect.any(Error));
  });
});
