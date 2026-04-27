import { useCallback, useState } from "react";
import toast from "react-hot-toast";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getAxiosLikeStatus(error: unknown): string | undefined {
  if (!isRecord(error)) return undefined;
  const status = error.status;
  return typeof status === "number" || typeof status === "string"
    ? String(status)
    : undefined;
}

function getAxiosLikeResponseData(error: unknown): unknown {
  if (!isRecord(error)) return undefined;
  const response = error.response;
  if (!isRecord(response)) return undefined;
  return response.data;
}

export function useIsLoading<T = unknown>(callback: () => Promise<T>) {
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(async () => {
    setIsLoading(true);
    try {
      await callback();
      setIsLoading(false);
    } catch (error: unknown) {
      toast.error("Algo não ocorreu como deveria!");
      console.log(
        "error: ",
        getAxiosLikeStatus(error) ?? (error instanceof Error ? error.message : String(error)),
        getAxiosLikeResponseData(error),
      );
      setIsLoading(false);
    }
  }, [callback]);

  return { isLoading, request };
}
