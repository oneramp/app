import { Transfer } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TransferStore {
  transfer: Transfer | null;
  setTransfer: (transfer: Transfer) => void;
  resetTransfer: () => void;
}

const initialState = {
  transfer: null,
};

export const useTransferStore = create<TransferStore>()(
  persist(
    (set) => ({
      ...initialState,
      setTransfer: (transfer: Transfer) => set({ transfer }),
      resetTransfer: () => set(initialState),
    }),
    { name: "transfer" }
  )
);
