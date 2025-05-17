"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WalletConnectionModal } from "./WalletConnectionModal";
import { useAccount as useStarknetAccount } from '@starknet-react/core';
import { createAppKit } from '@reown/appkit';

export function Header() {
  const [connected, setConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | undefined>();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{ top: number; right: number } | undefined>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Get Starknet account
  const { address: starknetAddress } = useStarknetAccount();

  // Listen for AppKit connection changes for EVM
  useEffect(() => {
    // Get the appKit instance that was created in WalletConnectionModal
    const appKit = (window as any).appKit;
    
    if (!appKit) return;
    
    const unsubscribe = appKit.subscribeAccount((account: { address?: string }) => {
      if (account?.address) {
        setConnected(true);
        setConnectedAddress(account.address);
      }
    });
    
    return unsubscribe;
  }, []);

  // Check if connected to Starknet
  useEffect(() => {
    if (starknetAddress) {
      setConnected(true);
      setConnectedAddress(starknetAddress);
    }
  }, [starknetAddress]);

  const handleConnectButtonClick = () => {
    if (connected) {
      // If already connected, toggle connected state
      setConnected(false);
      setConnectedAddress(undefined);
      return;
    }
    
    // Update button position for dropdown positioning
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right
      });
    }
    
    // Show wallet modal
    setShowWalletModal(true);
  };

  const handleWalletConnect = (walletId: string) => {
    console.log(`Connecting to ${walletId} wallet`);
    setShowWalletModal(false);
    // Connection state is handled by the useEffect monitoring address changes
  };

  // Format the displayed address
  const displayAddress = connectedAddress 
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
    : "Wallet Connected";

  return (
    <header className="w-full bg-black py-4">
      <div className="max-w-[1000px] mx-auto flex justify-between items-center px-6">
        {/* Logo - Mobile version for small screens, Desktop version for medium screens and up */}
        <div className="flex items-center">
          <div className="block md:hidden">
            <Image src="/logos/oneramp.png" alt="OneRamp" width={40} height={40} priority className="rounded-full" />
          </div>
          <div className="hidden md:block">
            <Image src="/logos/oneramp-long.png" alt="OneRamp" width={150} height={40} priority />
          </div>
        </div>

        {/* Connect Wallet Button */}
        <Button 
          ref={buttonRef}
          onClick={handleConnectButtonClick}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            connected 
              ? "bg-[#232323] hover:bg-[#2c2c2c] text-purple-400" 
              : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
          }`}
        >
          {connected ? displayAddress : "Connect Wallet"}
        </Button>
      </div>

      {/* Wallet Connection Modal */}
      <WalletConnectionModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        buttonPosition={buttonPosition}
        onConnect={handleWalletConnect}
      />
    </header>
  );
} 