import axios from "axios";

export function normalizeApiBaseUrl(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error(
      "Defina VITE_API_BASE_URL no ficheiro .env (veja .env.example).",
    );
  }
  return raw.replace(/\/$/, "");
}

export const api = axios.create({
  baseURL: normalizeApiBaseUrl(process.env.VITE_API_BASE_URL),
  headers: { Accept: "application/json" },
});
