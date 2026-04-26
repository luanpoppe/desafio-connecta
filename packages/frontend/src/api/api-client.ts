import axios from "axios";

function getBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error(
      "Defina VITE_API_BASE_URL no ficheiro .env (veja .env.example).",
    );
  }
  return raw.replace(/\/$/, "");
}

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { Accept: "application/json" },
});
