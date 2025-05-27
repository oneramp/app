import { assets } from "@/data/currencies";
import { AppState, OrderStep, UserSelectionGlobalState } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserSelectionStore extends UserSelectionGlobalState {
  updateSelection: (updates: Partial<UserSelectionGlobalState>) => void;
  resetSelection: () => void;
  reset: () => void;
  setAppState: (state: AppState) => void;
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
  appState: AppState.Idle,
  pastedAddress: undefined,
};

export const useUserSelectionStore = create<UserSelectionStore>()(
  persist(
    (set) => ({
      ...initialState,
      asset: assets[0],
      updateSelection: (updates) =>
        set((state) => ({
          ...state,
          ...updates,
        })),
      resetSelection: () => set(initialState),
      reset: () => set(initialState),
      setOrderStep: (step: OrderStep) =>
        set((state) => ({ ...state, orderStep: step })),
      setAppState: (newState: AppState) =>
        set((state) => ({ ...state, appState: newState })),
    }),
    {
      name: "user-selection",
    }
  )
);
