import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Network } from "@/types";
import { SUPPORTED_NETWORKS_WITH_RPC_URLS } from "@/data/networks";

interface NetworkState {
  currentNetwork: Network | null;
  supportedNetworks: Network[];
  setCurrentNetwork: (network: Network | null) => void;
  updateNetworks: (networks: Network[]) => void;
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set) => ({
      currentNetwork: SUPPORTED_NETWORKS_WITH_RPC_URLS[0],
      supportedNetworks: SUPPORTED_NETWORKS_WITH_RPC_URLS,
      setCurrentNetwork: (network) => {
        set({ currentNetwork: network });
      },
      updateNetworks: (networks) => set({ supportedNetworks: networks }),
    }),
    {
      name: "network-storage",
    }
  )
);
