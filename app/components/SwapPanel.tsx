"use client";
import { Button } from "@/components/ui/button";
import { assets } from "@/data/currencies";
import { SUPPORTED_NETWORKS_WITH_RPC_URLS } from "@/data/networks";
import { useNetworkStore } from "@/store/network";
import { useUserSelectionStore } from "@/store/user-selection";
import { Asset, Network } from "@/types";
import { useAccount as useStarknetAccount } from "@starknet-react/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TransactionReviewModal } from "./modals/TransactionReviewModal";
import { NetworkSelector } from "./NetworkSelector";
import SelectCountry from "./select-country";
import SelectInstitution from "./select-institution";
import { WalletConnectionModal } from "./WalletConnectionModal";

interface AppKitAccount {
  address?: string;
}

interface AppKit {
  subscribeAccount: (callback: (account: AppKitAccount) => void) => () => void;
  disconnect?: () => void;
  getAccount: () => Promise<AppKitAccount>;
  switchChain: (params: { chainId: string }) => Promise<void>;
}

declare global {
  interface Window {
    // appKit?: AppKit;
    ethereum?: Record<string, unknown>;
  }
}

const networks: Network[] = SUPPORTED_NETWORKS_WITH_RPC_URLS;

export function SwapPanel() {
  const [selectedCurrency, setSelectedCurrency] = useState<Asset>(assets[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentNetwork, setCurrentNetwork } = useNetworkStore();
  const [selectedCountryCurrency] = useState<null | {
    name: string;
    logo: string;
  }>(null);
  const [accountNumber] = useState<string | null>(null);
  const [institution] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Wallet connection states
  const [evmConnected, setEvmConnected] = useState(false);
  const { address: starknetAddress } = useStarknetAccount();
  const starknetConnected = !!starknetAddress;

  const { country } = useUserSelectionStore();

  // Check EVM wallet connection
  useEffect(() => {
    const appKit = window.appKit;
    if (!appKit) return;

    const checkConnection = async () => {
      const account = await (appKit as AppKit).getAccount();
      setEvmConnected(!!account?.address);
    };

    checkConnection();

    const unsubscribe = appKit.subscribeAccount((account: AppKitAccount) => {
      setEvmConnected(!!account?.address);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  // Used to show wallet requirement in the network modal
  const canSwitchNetwork = (network: Network) => {
    if (network.type === "starknet") {
      return starknetConnected;
    } else {
      return evmConnected;
    }
  };

  // Update handleNetworkSelect to use global state
  const handleNetworkSelect = async (network: Network) => {
    // If appropriate wallet is connected, attempt to switch networks
    if (network.type === "evm" && evmConnected) {
      try {
        await switchNetwork(network);
        setCurrentNetwork(network);
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    }
  };

  // Handler for wallet connection
  const handleWalletConnect = (walletId: string) => {
    console.log(`Connected with wallet: ${walletId}`);
    setShowWalletModal(false);
  };

  // Handler for swap confirmation
  const handleConfirmSwap = () => {
    // In a real app, this would submit the transaction
    setShowReviewModal(false);
    alert(
      "Transaction confirmed! This would normally process the transaction."
    );
  };

  // Update switchNetwork function to use chainId
  const switchNetwork = async (network: Network) => {
    if (network.type !== "evm" || !evmConnected) return;

    const appKit = window.appKit;
    if (!appKit) return;

    try {
      await (appKit as AppKit).switchChain({
        chainId: network.chainId.toString(),
      });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[450px] bg-[#181818]  rounded-3xl p-0 flex flex-col gap-0 md:shadow-lg md:border border-[#232323] relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white">Swap</span>
          <div className="relative">
            <Button
              variant="default"
              className="flex items-center gap-2 bg-[#232323] border-none px-4 py-2 rounded-full min-w-[90px]"
              onClick={() => setShowDropdown((v) => !v)}
              type="button"
            >
              <Image
                src={selectedCurrency.logo}
                alt={selectedCurrency.symbol}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-white font-medium">
                {selectedCurrency.symbol}
              </span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path
                  d="M7 10l5 5 5-5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
            <div
              className={`absolute left-0 mt-2 w-full bg-[#232323] rounded-2xl shadow-lg z-30 border border-[#6b6b6b] origin-top transition-all duration-200 ease-out transform ${
                showDropdown
                  ? "scale-100 opacity-100 pointer-events-auto"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
              style={{ minWidth: 150 }}
            >
              {assets.map((c) => (
                <button
                  key={c.symbol}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors gap-3 ${
                    selectedCurrency.symbol === c.symbol
                      ? "bg-[#353545]"
                      : "hover:bg-[#23232f]"
                  }`}
                  onClick={() => {
                    setSelectedCurrency(c);
                    setShowDropdown(false);
                  }}
                >
                  <span className="flex items-center gap-3">
                    <Image
                      src={c.logo}
                      alt={c.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-white font-medium text-lg">
                      {c.symbol}
                    </span>
                  </span>
                  {selectedCurrency.symbol === c.symbol && (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="#bcbcff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="bg-[#232323] border-none p-2 rounded-xl"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="3"
              stroke="#fff"
              strokeWidth="2"
            />
            <path
              d="M8 8h8v8"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>

      {/* From Panel */}
      <div className="mx-4 mt-2 bg-[#232323] rounded-2xl p-5 flex flex-col gap-2 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-200 text-lg font-medium">From</span>
          <span className="text-neutral-400 text-sm">
            Balance: 0{" "}
            <span className="text-red-400 ml-1 cursor-pointer">Max</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <NetworkSelector
            selectedNetwork={currentNetwork || networks[0]}
            onNetworkChange={handleNetworkSelect}
            canSwitch={canSwitchNetwork}
            buttonClassName="bg-black border-none px-4 py-2 rounded-full min-w-[120px]"
          />
          <div className="flex-1 text-right">
            <span className="text-3xl text-neutral-300 font-light">10</span>
          </div>
        </div>
      </div>

      {/* Arrow in the middle */}
      <div
        className="flex justify-center relative z-20 mt-1"
        style={{ height: 0 }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <div
            className="bg-[#181818] border-4 border-[#232323] rounded-xl p-3 shadow-lg flex items-center justify-center"
            style={{ width: 56, height: 56 }}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 5v14m0 0l-5-5m5 5l5-5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* To Panel */}
      <div className="mx-4 mb-2 bg-[#232323] rounded-2xl p-5 flex flex-col gap-2 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-200 text-lg font-medium">To</span>
          {selectedCountryCurrency && (
            <span className="text-purple-400 font-medium text-sm cursor-pointer">
              Select beneficiary
            </span>
          )}
        </div>

        <SelectCountry />
      </div>

      {/* Recipient Details - Only show when a country is selected */}

      {/* Swap Info */}
      {country && (
        <div className="mx-10 mb-4 flex justify-between text-sm">
          <span className="text-neutral-400">
            1 {selectedCurrency.symbol} ~ {country.exchangeRate}{" "}
            {country.currency}
          </span>
          <span className="text-neutral-400">
            Swap usually completes in 30s
          </span>
        </div>
      )}

      {country && <SelectInstitution />}

      {/* Updated Swap Button */}

      {/* Transaction Review Modal */}
      <TransactionReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onConfirm={handleConfirmSwap}
        amount="1"
        currency={selectedCurrency.symbol}
        currencyLogo={selectedCurrency.logo}
        totalValue={
          selectedCountryCurrency
            ? `${
                selectedCountryCurrency.name.includes("Kenya") ? "Ksh" : "NGN"
              } 127.42`
            : "0"
        }
        recipient={
          accountNumber
            ? accountNumber.substring(0, 4) + "..."
            : "Not specified"
        }
        account={accountNumber || "Not specified"}
        institution={institution || "Not specified"}
        network={currentNetwork?.name || networks[0].name}
        networkLogo={currentNetwork?.logo || networks[0].logo}
      />

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        buttonPosition={undefined}
        onConnect={handleWalletConnect}
      />

      {/* Institution Modal */}
    </div>
  );
}
