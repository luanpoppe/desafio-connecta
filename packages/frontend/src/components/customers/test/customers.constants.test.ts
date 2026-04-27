import { money } from "../customers.constants";

describe("money", () => {
  it("formats BRL for pt-BR", () => {
    expect(money.format(1234.5)).toMatch(/1\.234,50/);
  });
});
