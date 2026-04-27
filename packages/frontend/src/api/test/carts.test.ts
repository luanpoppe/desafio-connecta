jest.mock("../api-client", () => ({
  api: {
    get: jest.fn(),
  },
}));

import { api } from "../api-client";
import { fetchCartById, fetchCartsByUserId } from "../carts";

const mockedGet = api.get as jest.MockedFunction<typeof api.get>;

describe("carts API", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("fetchCartsByUserId requests /carts with userId", async () => {
    const payload = {
      carts: [],
      total: 0,
      skip: 0,
      limit: 10,
      summary: { transactionCount: 0, totalSum: 0 },
    };
    mockedGet.mockResolvedValue({ data: payload });

    const result = await fetchCartsByUserId(99);

    expect(mockedGet).toHaveBeenCalledWith("/carts", { params: { userId: 99 } });
    expect(result).toEqual(payload);
  });

  it("fetchCartById requests /carts/:id", async () => {
    const payload = {
      id: 3,
      products: [],
      total: 10,
      discountedTotal: 9,
      userId: 1,
      totalProducts: 1,
      totalQuantity: 2,
    };
    mockedGet.mockResolvedValue({ data: payload });

    const result = await fetchCartById(3);

    expect(mockedGet).toHaveBeenCalledWith("/carts/3");
    expect(result).toEqual(payload);
  });
});
