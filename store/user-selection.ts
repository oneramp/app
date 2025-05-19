import { UserSelectionGlobalState } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserSelectionStore extends UserSelectionGlobalState {
  updateSelection: (updates: Partial<UserSelectionGlobalState>) => void;
  resetSelection: () => void;
}

const initialState: UserSelectionGlobalState = {
  country: undefined,
  network: undefined,
  asset: undefined,
  cryptoAmount: undefined,
  fiatAmount: undefined,
  address: undefined,
  paymentMethod: "momo",
  institution: undefined,
};

export const useUserSelectionStore = create<UserSelectionStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateSelection: (updates) =>
        set((state) => ({
          ...state,
          ...updates,
        })),
      resetSelection: () => set(initialState),
    }),
    {
      name: "user-selection",
    }
  )
);
