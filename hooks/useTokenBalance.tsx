"use client";

import { getTokenAddress, getTokenDecimals } from "@/data/token-config";
import { useNetworkStore } from "@/store/network";
import { ChainTypes } from "@/types";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { erc20Abi, formatUnits } from "viem";
import { useBalance, useReadContract } from "wagmi";
import useWalletGetInfo from "./useWalletGetInfo";

export interface TokenBalanceResult {
  balance: string;
  formatted: string;
  decimals: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTokenBalance(tokenSymbol: string): TokenBalanceResult {
  const { address, isConnected } = useWalletGetInfo();
  const { currentNetwork } = useNetworkStore();
  const { address: starknetAddress } = useAccount();
  
  const [starknetBalance, setStarknetBalance] = useState<string>("0");
  const [starknetLoading, setStarknetLoading] = useState(false);
  const [starknetError, setStarknetError] = useState<string | null>(null);

  const chainId = currentNetwork?.chainId;
  const tokenAddress = chainId ? getTokenAddress(tokenSymbol, chainId) : undefined;
  const decimals = chainId ? getTokenDecimals(tokenSymbol, chainId) : 18;

  // EVM token balance using wagmi
  const {
    data: evmBalanceData,
    isLoading: evmLoading,
    error: evmError,
    refetch: refetchEvm,
  } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: 
        !!address && 
        !!tokenAddress && 
        isConnected && 
        currentNetwork?.type === ChainTypes.EVM,
    },
  });

  // Starknet balance fetching
  useEffect(() => {
    if (
      !starknetAddress || 
      !tokenAddress || 
      !isConnected || 
      currentNetwork?.type !== ChainTypes.Starknet
    ) {
      return;
    }

    const fetchStarknetBalance = async () => {
      setStarknetLoading(true);
      setStarknetError(null);
      
      try {
        // Import starknet provider dynamically to avoid SSR issues
        const { RpcProvider } = await import("starknet");
        
        const provider = new RpcProvider({
          nodeUrl: "https://starknet-mainnet.infura.io/v3/aa740f142a80486b94876ef7a659e9aa",
        });

        // Call balanceOf function on the token contract
        const result = await provider.callContract({
          contractAddress: tokenAddress,
          entrypoint: "balanceOf",
          calldata: [starknetAddress],
        });

        // Convert the result to string (it's returned as hex)
        const balance = BigInt(result[0]).toString();
        setStarknetBalance(balance);
      } catch (error) {
        console.error("Error fetching Starknet balance:", error);
        setStarknetError(error instanceof Error ? error.message : "Failed to fetch balance");
        setStarknetBalance("0");
      } finally {
        setStarknetLoading(false);
      }
    };

    fetchStarknetBalance();
  }, [starknetAddress, tokenAddress, isConnected, currentNetwork]);

  const refetchStarknet = () => {
    if (currentNetwork?.type === ChainTypes.Starknet) {
      // Trigger re-fetch by updating a dependency
      setStarknetBalance("0");
    }
  };

  // Return appropriate data based on network type
  if (currentNetwork?.type === ChainTypes.Starknet) {
    const formatted = formatUnits(BigInt(starknetBalance), decimals);
    return {
      balance: starknetBalance,
      formatted: parseFloat(formatted).toFixed(2),
      decimals,
      isLoading: starknetLoading,
      error: starknetError,
      refetch: refetchStarknet,
    };
  }

  // EVM networks
  const balance = evmBalanceData ? evmBalanceData.toString() : "0";
  const formatted = evmBalanceData ? formatUnits(evmBalanceData, decimals) : "0";
  
  return {
    balance,
    formatted: parseFloat(formatted).toFixed(2),
    decimals,
    isLoading: evmLoading,
    error: evmError?.message || null,
    refetch: refetchEvm,
  };
} 