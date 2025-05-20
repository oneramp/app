"use client";

import { Button } from "@/app/components/ui/button";
import useWalletGetInfo from "@/hooks/useWalletGetInfo";
import { useAppKit } from "@reown/appkit/react";
import { useState } from "react";
import { WalletTypeModal } from "./modals/WalletTypeModal";
import { StarknetkitConnector } from "starknetkit";
import { useStarknetkitConnectModal } from "starknetkit";
import { Connector, useConnect, useDisconnect } from "@starknet-react/core";
import { useNetworkStore } from "@/store/network";
import { toast } from "sonner";

export const ConnectButton = () => {
  const { address, isConnected } = useWalletGetInfo();
  const { open } = useAppKit();
  const [showWalletTypeModal, setShowWalletTypeModal] = useState(false);

  const { currentNetwork } = useNetworkStore();

  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });

  const { disconnect: disconnectStarknet } = useDisconnect();

  async function connectStarknet() {
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      return;
    }
    await connect({ connector: connector as Connector });
  }

  const handleWalletTypeSelect = (type?: "evm" | "starknet" | undefined) => {
    const chainType = currentNetwork?.type || type;

    if (!chainType) {
      setShowWalletTypeModal(true);
      return;
    }

    // TODO: Handle Starknet wallet connection
    if (chainType === "evm") {
      open();
    }

    if (chainType === "starknet") {
      connectStarknet();
    }
  };

  const handleDisconnectCurrentWallet = (type?: "evm" | "starknet") => {
    const chainType = currentNetwork?.type || type;

    if (!chainType) {
      toast.error("No wallet connected");
      return;
    }

    if (chainType === "evm") {
      open();
    }

    if (chainType === "starknet") {
      disconnectStarknet();
    }
  };

  return (
    <div>
      {isConnected ? (
        <Button
          className="rounded-full px-6 py-1.5 text-sm font-semibold transition-colors bg-neutral-800 hover:bg-neutral-700 text-white"
          onClick={() => handleDisconnectCurrentWallet()}
        >
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
      ) : (
        <Button
          // onClick={() => setShowWalletTypeModal(true)}
          onClick={() => handleWalletTypeSelect()}
          className="rounded-full px-6 py-1.5 text-sm font-semibold transition-colors bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
        >
          Connect Wallet
        </Button>
      )}

      <WalletTypeModal
        open={showWalletTypeModal}
        onClose={() => setShowWalletTypeModal(false)}
        onSelectWalletType={handleWalletTypeSelect}
      />
    </div>
  );
};
