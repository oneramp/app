"use client";

import { Button } from "@/app/components/ui/button";
import useWalletGetInfo from "@/hooks/useWalletGetInfo";
import { useAppKit } from "@reown/appkit/react";

export const ConnectButton = () => {
  const { address, isConnected } = useWalletGetInfo();
  const { open } = useAppKit();
  return (
    <div>
      {isConnected ? (
        <Button
          className="rounded-full px-6  py-1.5 text-sm font-semibold transition-colors bg-neutral-800 hover:bg-neutral-700 text-white"
          onClick={() => open()}
        >
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
      ) : (
        <Button
          onClick={() => open()}
          className="rounded-full px-6  py-1.5 text-sm font-semibold transition-colors bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
