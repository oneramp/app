"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface WalletOption {
  id: string;
  name: string;
  logo: string;
}

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonPosition?: { top: number; right: number };
  onConnect: (walletId: string) => void;
}

const walletOptions: WalletOption[] = [
  { id: "evm", name: "EVM", logo: "/logos/ethereum.png" },
  { id: "starknet", name: "Starknet", logo: "/logos/starknet.png" },
];

export function WalletConnectionModal({ 
  isOpen, 
  onClose, 
  buttonPosition,
  onConnect 
}: WalletConnectionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close modal when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop dropdown - positioned relative to button */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none"
        aria-hidden={!isOpen}
      >
        {/* Desktop dropdown */}
        <div 
          ref={modalRef}
          className="hidden md:block absolute pointer-events-auto rounded-xl bg-[#1c1c1c] shadow-xl border border-[#333] w-[320px] overflow-hidden"
          style={buttonPosition ? {
            top: `${buttonPosition.top + 50}px`,
            right: `${buttonPosition.right}px`
          } : {}}
        >
          <div className="p-4 border-b border-[#333]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">My Wallets</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="p-2 max-h-[400px] overflow-y-auto">
            {walletOptions.map((wallet) => (
              <div 
                key={wallet.id}
                className="p-3 rounded-lg my-2 bg-[#232323] hover:bg-[#2a2a2a] cursor-pointer flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                    <Image src={wallet.logo} alt={wallet.name} width={24} height={24} className="rounded-full" />
                  </div>
                  <span className="text-white text-lg">{wallet.name}</span>
                </div>
                <Button
                  onClick={() => onConnect(wallet.id)}
                  className="bg-[#831d1d] hover:bg-[#9e2121] text-white rounded-lg px-4 py-2"
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet modal */}
      <div 
        className={`md:hidden fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
             style={{ opacity: isOpen ? 1 : 0 }}
        />
        <div 
          ref={modalRef}
          className={`absolute bottom-0 left-0 right-0 bg-[#1c1c1c] rounded-t-xl transform transition-transform duration-300 ease-in-out max-h-[80vh] overflow-y-auto ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="p-4 border-b border-[#333] sticky top-0 bg-[#1c1c1c] z-10">
            <div className="w-12 h-1 bg-[#444] rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">My Wallets</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="p-3">
            {walletOptions.map((wallet) => (
              <div 
                key={wallet.id}
                className="p-3 rounded-lg my-2 bg-[#232323] hover:bg-[#2a2a2a] cursor-pointer flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                    <Image src={wallet.logo} alt={wallet.name} width={24} height={24} className="rounded-full" />
                  </div>
                  <span className="text-white text-lg">{wallet.name}</span>
                </div>
                <Button
                  onClick={() => onConnect(wallet.id)}
                  className="bg-[#831d1d] hover:bg-[#9e2121] text-white rounded-lg px-4 py-2"
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 