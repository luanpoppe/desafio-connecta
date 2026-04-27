import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { fetchUsersPage } from "../../api/users";
import { mockUser } from "../../test/fixtures/users";
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

  it("keeps previous page data visible while the next page is loading", async () => {
    const page1 = {
      items: [mockUser({ id: 1 })],
      page: 1,
      pageSize: 5,
      totalItems: 10,
    };
    const page2 = {
      items: [mockUser({ id: 2 })],
      page: 2,
      pageSize: 5,
      totalItems: 10,
    };

    let releasePage2: (value: typeof page2) => void;
    const page2Promise = new Promise<typeof page2>((resolve) => {
      releasePage2 = resolve;
    });

    mockedFetch.mockResolvedValueOnce(page1).mockImplementationOnce(() => page2Promise);

    const qc = createTestQueryClient();

    const { result, rerender } = renderHook(({ page }: { page: number }) => useUsersQuery(page, 5), {
      wrapper: wrapper(qc),
      initialProps: { page: 1 },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(page1);

    rerender({ page: 2 });

    await waitFor(() => expect(result.current.isFetching).toBe(true));
    expect(result.current.data).toEqual(page1);
    expect(result.current.isPlaceholderData).toBe(true);

    releasePage2!(page2);

    await waitFor(() => expect(result.current.data).toEqual(page2));
    expect(result.current.isPlaceholderData).toBe(false);
  });
});
