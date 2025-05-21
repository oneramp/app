import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AmountStore {
  amount: string;
  fiatAmount: string;
  isValid: boolean;
  setAmount: (amount: string) => void;
  setFiatAmount: (fiatAmount: string) => void;
  setIsValid: (isValid: boolean) => void;
  resetAmount: () => void;
}

const initialState = {
  amount: "1",
  fiatAmount: "1",
  isValid: true,
};

export const useAmountStore = create<AmountStore>()(
  persist(
    (set) => ({
      ...initialState,
      setAmount: (amount: string) => set({ amount }),
      setFiatAmount: (fiatAmount: string) => set({ fiatAmount }),
      setIsValid: (isValid: boolean) => set({ isValid }),
      resetAmount: () => set(initialState),
    }),
    { name: "amount-store" }
  )
);
