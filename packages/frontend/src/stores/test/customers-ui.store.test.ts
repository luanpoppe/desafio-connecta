import { useCustomersUiStore } from "../customers-ui.store";

describe("useCustomersUiStore", () => {
  beforeEach(() => {
    useCustomersUiStore.setState({ selectedUserId: null });
  });

  it("starts with no selection", () => {
    expect(useCustomersUiStore.getState().selectedUserId).toBeNull();
  });

  it("selectUser sets selectedUserId", () => {
    useCustomersUiStore.getState().selectUser(42);
    expect(useCustomersUiStore.getState().selectedUserId).toBe(42);
  });

  it("clearSelection resets selectedUserId", () => {
    useCustomersUiStore.getState().selectUser(7);
    useCustomersUiStore.getState().clearSelection();
    expect(useCustomersUiStore.getState().selectedUserId).toBeNull();
  });
});
