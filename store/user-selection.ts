import { OrderStep, UserSelectionGlobalState } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserSelectionStore extends UserSelectionGlobalState {
  updateSelection: (updates: Partial<UserSelectionGlobalState>) => void;
  resetSelection: () => void;
  reset: () => void;
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
  accountNumber: undefined,
  orderStep: OrderStep.Initial,
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
      reset: () => set(initialState),
      setOrderStep: (step: OrderStep) =>
        set((state) => ({ ...state, orderStep: step })),
    }),
    {
      name: "user-selection",
    }
  )
);
