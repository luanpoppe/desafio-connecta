import { normalizeApiBaseUrl } from "../api-client";

describe("normalizeApiBaseUrl", () => {
  it("trims trailing slash", () => {
    expect(normalizeApiBaseUrl("https://api.example.com/")).toBe("https://api.example.com");
  });

  it("throws when missing or blank", () => {
    expect(() => normalizeApiBaseUrl(undefined)).toThrow(/VITE_API_BASE_URL/);
    expect(() => normalizeApiBaseUrl("")).toThrow(/VITE_API_BASE_URL/);
    expect(() => normalizeApiBaseUrl("   ")).toThrow(/VITE_API_BASE_URL/);
  });
});
