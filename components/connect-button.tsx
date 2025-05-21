"use client";

import { Button } from "@/app/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SUPPORTED_NETWORKS_WITH_RPC_URLS } from "@/data/networks";
import useWalletGetInfo from "@/hooks/useWalletGetInfo";
import { cn } from "@/lib/utils";
import { useNetworkStore } from "@/store/network";
import {
  useAppKit,
  useDisconnect as useDisconnectEVM,
} from "@reown/appkit/react";
import { Connector, useConnect, useDisconnect } from "@starknet-react/core";
import Image from "next/image";
import { useState } from "react";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import ConnectedWalletCard from "./connected-wallet-card";
import { ChainTypes } from "@/types";

export const ConnectButton = ({ large }: { large?: boolean }) => {
  const { address, isConnected } = useWalletGetInfo();
  const { open } = useAppKit();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const {
    currentNetwork,
    setCurrentNetwork,
    addConnectedNetwork,
    connectedNetworks,
    removeConnectedNetwork,
  } = useNetworkStore();
  const disconnectEvm = useDisconnectEVM();

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

  const handleWalletTypeSelect = async (
    type?: "evm" | "starknet" | undefined
  ) => {
    // const chainType = currentNetwork?.type || type;
    const chainType = type;

    if (!chainType) {
      setPopoverOpen(true);
      return;
    }

    // TODO: Handle Starknet wallet connection
    if (chainType === "evm") {
      // Set the current network to the EVM network
      await open();
      setCurrentNetwork(SUPPORTED_NETWORKS_WITH_RPC_URLS[0]);
      // First check if the network is already connected
      if (
        !connectedNetworks.some(
          (network) => network.id === SUPPORTED_NETWORKS_WITH_RPC_URLS[0].id
        )
      ) {
        addConnectedNetwork(SUPPORTED_NETWORKS_WITH_RPC_URLS[0]);
      }
    }

    if (chainType === "starknet") {
      // Set the current network to the Starknet network (The last one in the array)
      const starknetPositionInArray =
        SUPPORTED_NETWORKS_WITH_RPC_URLS[
          SUPPORTED_NETWORKS_WITH_RPC_URLS.length - 1
        ];
      await connectStarknet();
      setCurrentNetwork(starknetPositionInArray);
      // First check if the network is already connected
      if (
        !connectedNetworks.some(
          (network) => network.id === starknetPositionInArray.id
        )
      ) {
        addConnectedNetwork(starknetPositionInArray);
      }
    }
  };

  const handleDisconnectCurrentWallet = async (type?: "evm" | "starknet") => {
    const chainType = currentNetwork?.type || type;

    if (!chainType) {
      // toast.error("No wallet connected");
      // Disconnect all wallets
      await disconnectEvm.disconnect();
      await disconnectStarknet();
      setCurrentNetwork(null);
      // Remove all connected networks
      connectedNetworks.forEach((network) => {
        removeConnectedNetwork(network);
      });
      return;
    }

    if (chainType === "evm") {
      // open();
      await disconnectEvm.disconnect();
      setCurrentNetwork(null);
      // Remove the connected network
      if (currentNetwork) {
        removeConnectedNetwork(currentNetwork);
      }
    }

    if (chainType === "starknet") {
      await disconnectStarknet();
      setCurrentNetwork(null);
      // Remove the connected network
      if (currentNetwork) {
        removeConnectedNetwork(currentNetwork);
      }
    }
  };

  console.log("====================================");
  console.log("connectedNetworks", connectedNetworks);
  console.log("====================================");

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger onClick={() => setPopoverOpen(true)}>
        {isConnected ? (
          <Button
            className={cn(
              "rounded-full px-6 py-1.5 text-sm font-semibold transition-colors bg-neutral-800 hover:bg-neutral-700 text-white",
              large && "w-full h-14 rounded-lg text-lg mt-2"
            )}
            // onClick={() => handleDisconnectCurrentWallet()}
          >
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        ) : (
          <Button
            // onClick={() => setShowWalletTypeModal(true)}
            // onClick={() => handleWalletTypeSelect()}
            className={cn(
              "rounded-full px-6 py-1.5 w-full text-sm font-semibold transition-colors bg-[#2563eb] hover:bg-[#1d4ed8] text-white",
              large && "w-full h-14 rounded-lg text-lg mt-2"
            )}
          >
            Connect Wallet
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent className="bg-[#181818] rounded-3xl  m-5 w-[380px] shadow-2xl relative border border-[#232323]">
        <div className="h-14 mb-4 px-3 flex items-center justify-between">
          <h1 className="text-white text-xl font-semibold">My Wallets</h1>
          <button
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-[#232323] transition-colors"
            onClick={() => setPopoverOpen(false)}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {isConnected &&
          (currentNetwork?.type === ChainTypes.EVM ||
            connectedNetworks.some(
              (network) => network.type === ChainTypes.EVM
            )) ? (
            <ConnectedWalletCard
              disconnect={() => handleDisconnectCurrentWallet("evm")}
              network={ChainTypes.EVM}
            />
          ) : (
            <Button
              onClick={() => handleWalletTypeSelect("evm")}
              variant="outline"
              className="flex justify-start items-center gap-4 w-full h-16   border-[#232323] hover:bg-[#2a2a2a] rounded-2xl transition-all hover:scale-[1.02] border  hover:border-[#353535] group"
            >
              <div className="p-2 bg-[#353535] rounded-lg group-hover:bg-[#454545] transition-colors">
                <Image
                  src="/logos/ethereum.png"
                  alt="EVM"
                  width={24}
                  height={24}
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-white font-medium text-base">
                  EVM Wallet
                </span>
              </div>
              <Button className="bg-white text-black rounded-md hover:bg-neutral-200 text-sm">
                Connect
              </Button>
            </Button>
          )}

          {isConnected &&
          (currentNetwork?.type === ChainTypes.Starknet ||
            connectedNetworks.some(
              (network) => network.type === ChainTypes.Starknet
            )) ? (
            <ConnectedWalletCard
              disconnect={() => handleDisconnectCurrentWallet("starknet")}
              network={ChainTypes.Starknet}
            />
          ) : (
            <Button
              onClick={() => handleWalletTypeSelect("starknet")}
              variant="outline"
              className="flex justify-start items-center  gap-4 w-full h-16  border-[#232323] hover:bg-[#2a2a2a] rounded-2xl transition-all hover:scale-[1.02] border  hover:border-[#353535] group"
            >
              <div className="p-2 bg-[#353535] rounded-lg group-hover:bg-[#454545] transition-colors">
                <Image
                  src="/logos/starknet.png"
                  alt="Starknet"
                  width={24}
                  height={24}
                  className="rounded-lg"
                />
              </div>

              <div className="flex flex-col items-start flex-1">
                <span className="text-white font-medium text-base">
                  Starknet Wallet
                </span>
              </div>

              <Button className="bg-white text-black rounded-md hover:bg-neutral-200 text-sm">
                Connect
              </Button>
            </Button>
          )}
        </div>

        {isConnected && (
          <Button
            className="w-full mt-5 rounded-lg text-base h-12 font-medium bg-[#9E2121] hover:bg-red-800"
            onClick={() => handleDisconnectCurrentWallet()}
          >
            Disconnect All
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};
