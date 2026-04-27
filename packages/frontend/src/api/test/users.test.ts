jest.mock("../api-client", () => ({
  api: {
    get: jest.fn(),
  },
}));

import { api } from "../api-client";
import { fetchUsersPage } from "../users";

const mockedGet = api.get as jest.MockedFunction<typeof api.get>;

describe("fetchUsersPage", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("calls GET /users with pagination params and returns data", async () => {
    const payload = {
      items: [],
      totalItems: 0,
      page: 2,
      pageSize: 5,
    };
    mockedGet.mockResolvedValue({ data: payload });

    const result = await fetchUsersPage(2, 5);

    expect(mockedGet).toHaveBeenCalledWith("/users", { params: { page: 2, pageSize: 5 } });
    expect(result).toEqual(payload);
  });
});
