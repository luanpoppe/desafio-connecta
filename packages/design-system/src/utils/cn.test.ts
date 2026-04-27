import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class strings with a single space", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops null, undefined, and false", () => {
    expect(cn("a", null, undefined, false, "b")).toBe("a b");
  });

  it("returns empty string when all parts are falsy", () => {
    expect(cn(null, false)).toBe("");
  });
});
