import { create } from "zustand";

interface CustomersUiState {
  selectedUserId: number | null;
  selectUser: (id: number) => void;
  clearSelection: () => void;
}

export const useCustomersUiStore = create<CustomersUiState>((set) => ({
  selectedUserId: null,
  selectUser: (id) => set({ selectedUserId: id }),
  clearSelection: () => set({ selectedUserId: null }),
}));
