import { formatLineDiscount } from "../utils";

describe("formatLineDiscount", () => {
  it("returns em dash for zero", () => {
    expect(formatLineDiscount(0)).toBe("—");
  });

  it("formats fractional discount as percent without trailing .0", () => {
    expect(formatLineDiscount(0.15)).toBe("15%");
    expect(formatLineDiscount(1)).toBe("100%");
  });

  it("keeps one decimal when needed", () => {
    expect(formatLineDiscount(0.125)).toBe("12.5%");
  });

  it("formats values greater than 1 as percent literal", () => {
    expect(formatLineDiscount(15)).toBe("15%");
  });
});
