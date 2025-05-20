"use client";
import { ConnectButton } from "@/components/connect-button";
import { useNetworkStore } from "@/store/network";
import { useDisconnect } from "@reown/appkit/react";
import { useAccount as useStarknetAccount } from "@starknet-react/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBalance, useToken } from "wagmi";
import { WalletDetailsModal } from "./WalletDetailsModal";

interface AppKitAccount {
  address?: string;
}

interface AppKit {
  subscribeAccount: (callback: (account: AppKitAccount) => void) => () => void;
  disconnect?: () => void;
}

declare global {
  interface Window {
    appKit?: AppKit;
    ethereum?: Record<string, unknown>;
  }
}

export function Header({ logoOnly }: { logoOnly?: boolean }) {
  // Track both wallet types separately
  const [evmConnected, setEvmConnected] = useState(false);
  const [evmAddress, setEvmAddress] = useState<string | undefined>();
  const [starknetConnected, setStarknetConnected] = useState(false);
  const [starknetWalletAddress, setStarknetWalletAddress] = useState<
    string | undefined
  >();

  // const [setShowWalletModal] = useState(false);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [buttonPosition] = useState<
    { top: number; right: number } | undefined
  >();
  // const buttonRef = useRef<HTMLButtonElement>(null);

  // // Network state from Zustand
  const { currentNetwork, setCurrentNetwork, supportedNetworks } =
    useNetworkStore();

  const { disconnect } = useDisconnect();

  // Network switching state using AppKit hooks
  // const chainId = useChainId();

  // Update current network when chainId changes
  // useEffect(() => {
  // const network = supportedNetworks.find(
  //   (n) => Number(n.chainId) === chainId
  // );
  // if (
  //   network &&
  //   Number(network.chainId) !== Number(currentNetwork?.chainId)
  // ) {
  //   console.log("Chain ID changed, updating network:", {
  //     newChainId: chainId,
  //     newNetwork: network,
  //     currentNetworkChainId: currentNetwork?.chainId,
  //   });
  //   setCurrentNetwork(network);
  // }
  // }, [chainId, currentNetwork?.chainId, setCurrentNetwork, supportedNetworks]);

  // Get current token address
  const currentTokenAddress = currentNetwork?.tokenAddress;

  // Balance hooks with token tracking
  const { data: evmBalance } = useBalance({
    address: evmAddress as `0x${string}`,
    token: currentTokenAddress as `0x${string}`,
    query: {
      enabled: !!evmAddress && !!currentTokenAddress,
    },
  });

  // // Token details
  const { data: tokenData } = useToken({
    address: currentTokenAddress as `0x${string}`,
    query: {
      enabled: !!currentTokenAddress,
    },
  });

  // Get Starknet account
  const { address: starknetAddress } = useStarknetAccount();
  // const { disconnect: disconnectStarknet } = useStarknetDisconnect();

  // Listen for AppKit connection changes for EVM
  useEffect(() => {
    // Get the appKit instance that was created in WalletConnectionModal
    const appKit = window.appKit;
    if (!appKit) return;
    const unsubscribe = appKit.subscribeAccount((account: AppKitAccount) => {
      if (account?.address) {
        setEvmConnected(true);
        setEvmAddress(account.address);
      } else {
        setEvmConnected(false);
        setEvmAddress(undefined);
      }
    });
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  // Check if connected to Starknet
  useEffect(() => {
    if (starknetAddress) {
      setStarknetConnected(true);
      setStarknetWalletAddress(starknetAddress);
    } else {
      setStarknetConnected(false);
      setStarknetWalletAddress(undefined);
    }
  }, [starknetAddress]);

  // Listen for network changes
  useEffect(() => {
    const appKit = window.appKit;
    if (!appKit) return;
    const handleChainChanged = async (chainIdHex: string) => {
      console.log("Chain changed event received:", chainIdHex);
      const chainId = parseInt(chainIdHex, 16);
      const network = supportedNetworks.find((n) => n.chainId === chainId);
      if (network) {
        console.log("Updating network state to match wallet:", network.name);
        setCurrentNetwork(network);
      }
    };
    const ethereum = window.ethereum;
    if (ethereum && typeof ethereum === "object") {
      const provider = ethereum as {
        on: (event: string, callback: (chainId: string) => void) => void;
        removeListener: (
          event: string,
          callback: (chainId: string) => void
        ) => void;
      };
      provider.on("chainChanged", handleChainChanged);
      return () => {
        provider.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [supportedNetworks, setCurrentNetwork]);

  // Determine what to show on the connect wallet button
  const anyWalletConnected = evmConnected || starknetConnected;
  // const primaryAddress = evmConnected ? evmAddress : starknetWalletAddress;

  // const handleConnectButtonClick = () => {
  //   if (anyWalletConnected) {
  //     // Update button position for dropdown positioning
  //     if (buttonRef.current) {
  //       const rect = buttonRef.current.getBoundingClientRect();
  //       setButtonPosition({
  //         top: rect.bottom,
  //         right: window.innerWidth - rect.right,
  //       });
  //     }
  //     // If already connected, show wallet details
  //     setShowWalletDetails(true);
  //     return;
  //   }
  //   // Update button position for dropdown positioning
  //   if (buttonRef.current) {
  //     const rect = buttonRef.current.getBoundingClientRect();
  //     setButtonPosition({
  //       top: rect.bottom,
  //       right: window.innerWidth - rect.right,
  //     });
  //   }
  //   // Show wallet modal
  //   setShowWalletModal(true);
  // };

  // const handleWalletConnect = (walletId: string) => {
  //   console.log(`Connecting to ${walletId} wallet`);
  //   setShowWalletModal(false);
  //   // Connection state is handled by the useEffect monitoring address changes
  // };

  const handleConnectFromDetails = () => {
    // Close wallet details modal first
    setShowWalletDetails(false);

    // Show the connect wallet modal to connect the new wallet
    // setShowWalletModal(true);
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  // Format balance display
  const formattedBalance = evmBalance
    ? `$${parseFloat(evmBalance?.formatted || "0").toFixed(2)}`
    : "$0.00";

  // Get token symbol safely
  const tokenSymbol = tokenData?.symbol?.toLowerCase() || "usdc";

  return (
    <nav className="w-full  ">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        {logoOnly ? (
          <div className="flex items-center">
            <div className="block md:hidden ">
              <Image
                src="/logos/oneramp.png"
                alt="OneRamp"
                width={32}
                height={32}
                priority
                className="rounded-full"
              />
            </div>
            <div className="hidden md:block ">
              <Image
                src="/logos/oneramp-long.png"
                alt="OneRamp"
                width={100}
                height={32}
                priority
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {evmBalance && (
                <div className="hidden md:flex items-center px-3 py-1.5 bg-[#222222] rounded-full">
                  <Image
                    src={`/logos/${tokenSymbol}.svg`}
                    alt={tokenData?.symbol || "USDC"}
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-white">
                    {formattedBalance}
                  </span>
                </div>
              )}

              <ConnectButton />
            </div>
          </>
        )}
      </div>

      {/* Wallet Connection Modal */}
      {/* <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        buttonPosition={buttonPosition}
        onConnect={handleWalletConnect}
      /> */}

      {/* Wallet Details Modal */}
      {anyWalletConnected && (
        <WalletDetailsModal
          isOpen={showWalletDetails}
          onClose={() => setShowWalletDetails(false)}
          buttonPosition={buttonPosition}
          evmAddress={evmAddress}
          evmConnected={evmConnected}
          starknetAddress={starknetWalletAddress}
          starknetConnected={starknetConnected}
          onDisconnect={handleDisconnect}
          onConnectWallet={handleConnectFromDetails}
        />
      )}
    </nav>
  );
}
