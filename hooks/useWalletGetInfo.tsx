"use client";

import { useNetworkStore } from "@/store/network";
import {
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
} from "@reown/appkit/react";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { useClientMounted } from "./useClientMounted";

const useWalletInfo = () => {
  const { currentNetwork } = useNetworkStore();

  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(null);

  // EVM Wallet data
  const kitTheme = useAppKitTheme();
  const state = useAppKitState();
  const {
    address: evmAddress,
    caipAddress,
    isConnected: evmIsConnected,
    embeddedWalletInfo,
  } = useAppKitAccount();
  const events = useAppKitEvents();
  const mounted = useClientMounted();
  const {
    chainId: evmChainId,
    caipNetworkId,
    caipNetwork,
  } = useAppKitNetwork();

  // Starknet Wallet data
  const { address: starknetAddress, status } = useAccount();
  const starknetChainId = currentNetwork?.id;

  useEffect(() => {
    // Set the address and isConnected state based on the current network
    if (currentNetwork?.type === "evm") {
      setAddress(evmAddress ?? null);
      setIsConnected(evmIsConnected);
      setChainId(
        typeof evmChainId === "string"
          ? parseInt(evmChainId)
          : evmChainId ?? null
      );
    } else if (currentNetwork?.type === "starknet") {
      setAddress(starknetAddress ?? null);
      setIsConnected(status === "connected");
      setChainId(
        typeof starknetChainId === "string"
          ? parseInt(starknetChainId)
          : starknetChainId ?? null
      );
    }
  }, [
    currentNetwork,
    evmAddress,
    evmIsConnected,
    starknetAddress,
    status,
    starknetChainId,
  ]);

  return {
    kitTheme,
    state, //
    address, //
    caipAddress,
    isConnected, // will be got from the status fro starknet
    embeddedWalletInfo,
    events,
    mounted,
    chainId, //
    caipNetworkId,
    caipNetwork,
  };
};

export default useWalletInfo;
