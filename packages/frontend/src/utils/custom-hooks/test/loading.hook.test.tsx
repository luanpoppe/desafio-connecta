import { renderHook, waitFor, act } from "@testing-library/react";
import toast from "react-hot-toast";
import { useIsLoading } from "../loading.hook";

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

const toastError = toast.error as jest.MockedFunction<typeof toast.error>;

describe("useIsLoading", () => {
  beforeEach(() => {
    toastError.mockClear();
  });

  it("toggles isLoading around a successful request", async () => {
    const callback = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useIsLoading(callback));

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.request();
    });

    expect(callback).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(toastError).not.toHaveBeenCalled();
  });

  it("shows toast and resets loading on rejection", async () => {
    const callback = jest.fn().mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useIsLoading(callback));

    await act(async () => {
      await result.current.request();
    });

    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(result.current.isLoading).toBe(false);
  });
});
