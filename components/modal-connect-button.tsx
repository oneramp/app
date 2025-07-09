"use client";

import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { useEffect, useState } from "react";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import ConnectedWalletCard from "./connected-wallet-card";
import { ChainTypes, OrderStep } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { getKYC } from "@/actions/kyc";
import { useKYCStore } from "@/store/kyc-store";
import { useUserSelectionStore } from "@/store/user-selection";
import { useQuoteStore } from "@/store/quote-store";
import { useTransferStore } from "@/store/transfer-store";
import TransactionsModal from "./modals/transactions-modal";

export const ModalConnectButton = ({ large }: { large?: boolean }) => {
  const { address, isConnected } = useWalletGetInfo();
  const { open } = useAppKit();
  const { resetQuote } = useQuoteStore();
  const { resetTransfer } = useTransferStore();
  const [modalOpen, setModalOpen] = useState(false);
  const { updateSelection } = useUserSelectionStore();

  const {
    setCurrentNetwork,
    addConnectedNetwork,
    connectedNetworks,
    removeConnectedNetwork,
    clearConnectedNetworks,
  } = useNetworkStore();
  const disconnectEvm = useDisconnectEVM();

  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });

  const { disconnect: disconnectStarknet } = useDisconnect();

  const { setKycData } = useKYCStore();

  const { mutate: getSaveKYCData } = useMutation({
    mutationFn: async () => await getKYC(address as string),
    onSuccess: (data) => {
      setKycData(data);
    },
  });

  useEffect(() => {
    if (address) {
      getSaveKYCData();
    }
  }, [address]);

  const handleSuccessfulEvmConnection = async () => {
    // Set the current network to the EVM network
    setCurrentNetwork(SUPPORTED_NETWORKS_WITH_RPC_URLS[0]);
    updateSelection({ pastedAddress: undefined });

    // First check if the network is already connected
    if (
      !connectedNetworks.some(
        (network) => network.id === SUPPORTED_NETWORKS_WITH_RPC_URLS[0].id
      )
    ) {
      addConnectedNetwork(SUPPORTED_NETWORKS_WITH_RPC_URLS[0]);
    }
  };

  const handleSuccessfulStarknetConnection = async () => {
    // Set the current network to the Starknet network (The last one in the array)
    const starknetPositionInArray =
      SUPPORTED_NETWORKS_WITH_RPC_URLS[
        SUPPORTED_NETWORKS_WITH_RPC_URLS.length - 1
      ];
    updateSelection({ pastedAddress: undefined });
    setCurrentNetwork(starknetPositionInArray);
    // First check if the network is already connected
    if (
      !connectedNetworks.some(
        (network) => network.id === starknetPositionInArray.id
      )
    ) {
      addConnectedNetwork(starknetPositionInArray);
    }
  };

  const handleWalletTypeSelect = async (
    type?: "evm" | "starknet" | undefined
  ) => {
    const chainType = type;

    if (!chainType) {
      setModalOpen(true);
      return;
    }

    if (chainType === "evm") {
      setModalOpen(false);
      try {
        await open();
        // Only update networks if the wallet was successfully connected
        await handleSuccessfulEvmConnection();
      } catch (error) {
        console.error("Failed to connect EVM wallet:", error);
      }
    }

    if (chainType === "starknet") {
      setModalOpen(false);
      try {
        const { connector } = await starknetkitConnectModal();
        if (!connector) return;

        await connect({ connector: connector as Connector });
        // Only update networks if the wallet was successfully connected
        await handleSuccessfulStarknetConnection();
      } catch (error) {
        console.error("Failed to connect Starknet wallet:", error);
      }
    }
  };

  const handleDisconnectCurrentWallet = async (type?: ChainTypes) => {
    // const chainType = currentNetwork?.type || type;
    const chainType = type;

    if (!chainType) {
      try {
        // Disconnect all wallets concurrently and wait for both to complete
        await Promise.all([
          Promise.resolve(disconnectEvm.disconnect()).catch((error: Error) => {
            console.error("Failed to disconnect EVM wallet:", error);
          }),
          Promise.resolve(disconnectStarknet()).catch((error: Error) => {
            console.error("Failed to disconnect Starknet wallet:", error);
          }),
        ]);

        // Only clear network state after both disconnections complete
        setCurrentNetwork(null);
        clearConnectedNetworks();
        // updateSelection({ address: undefined });
        handleCancelConfirm();
      } catch (error) {
        console.error("Error during wallet disconnection:", error);
      } finally {
        handleCancelConfirm();
      }
      return;
    }

    if (chainType === "evm") {
      try {
        await disconnectEvm.disconnect();
        // Remove all EVM chains from connectedNetworks
        connectedNetworks.forEach((network) => {
          if (network.type === ChainTypes.EVM) {
            removeConnectedNetwork(network);
          }
        });
        // updateSelection({ address: undefined });
        handleCancelConfirm();
      } catch (error) {
        console.error("Failed to disconnect EVM wallet:", error);
      } finally {
        handleCancelConfirm();
      }
    }

    if (chainType === "starknet") {
      try {
        await disconnectStarknet();
        // Remove all Starknet chains from connectedNetworks
        connectedNetworks.forEach((network) => {
          if (network.type === ChainTypes.Starknet) {
            removeConnectedNetwork(network);
          }
        });
        // updateSelection({ address: undefined });
        handleCancelConfirm();
      } catch (error) {
        console.error("Failed to disconnect Starknet wallet:", error);
      } finally {
        handleCancelConfirm();
      }
    }
  };

  const handleCancelConfirm = () => {
    // setShowCancelModal(false);
    resetQuote();
    resetTransfer();
    updateSelection({
      address: undefined,
      orderStep: OrderStep.Initial,
      accountNumber: undefined,
      accountName: undefined,
      institution: undefined,
      pastedAddress: undefined,
    });
  };

  const hasAnyEvmNetwork = connectedNetworks.some(
    (network) => network.type === ChainTypes.EVM
  );

  const hasAnyStarknetNetwork = connectedNetworks.some(
    (network) => network.type === ChainTypes.Starknet
  );

  return (
    <>
      {isConnected ? (
        <div className="flex items-center gap-2">
          <Button
            disabled={true}
            className={cn(
              "rounded-full  px-6 py-1.5 text-sm font-semibold transition-colors bg-neutral-800 hover:bg-neutral-700 text-white",
              large && "w-full h-14 rounded-lg text-lg "
            )}
            onClick={() => setModalOpen(true)}
          >
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>

          <TransactionsModal />
        </div>
      ) : (
        <Button
          onClick={() => setModalOpen(true)}
          className={cn(
            "rounded-full px-6 py-1.5 my-4 text-sm font-semibold transition-colors !bg-[#2563eb] hover:!bg-[#1d4ed8] text-white",
            large && "w-full flex-1 p-6 text-lg rounded-xl "
          )}
        >
          Connect Wallet
        </Button>
        // <CoinbaseWallet />
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[420px] max-w-[95%] h-1/2 p-0 bg-[#181818] border border-[#232323] md:rounded-3xl rounded-t-3xl rounded-b-none overflow-hidden fixed md:bottom-0 bottom-auto translate-y-0">
          <div className=" px-5 flex items-center justify-between  ">
            <h1 className="text-white text-xl font-semibold">My Wallets</h1>
            <button
              className="absolute top-2 right-4 text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-[#232323] transition-colors"
              onClick={() => setModalOpen(false)}
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

          <div className="flex flex-col gap-4 px-4">
            <>
              {isConnected && hasAnyEvmNetwork ? (
                <ConnectedWalletCard
                  disconnect={() =>
                    handleDisconnectCurrentWallet(ChainTypes.EVM)
                  }
                  network={ChainTypes.EVM}
                />
              ) : (
                <Button
                  onClick={() => handleWalletTypeSelect("evm")}
                  variant="outline"
                  className="flex justify-start items-center gap-4 w-full h-16 border-[#232323] hover:bg-[#2a2a2a] rounded-2xl transition-all hover:scale-[1.02] border hover:border-[#353535] group"
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
            </>

            <>
              {isConnected && hasAnyStarknetNetwork ? (
                <ConnectedWalletCard
                  disconnect={() =>
                    handleDisconnectCurrentWallet(ChainTypes.Starknet)
                  }
                  network={ChainTypes.Starknet}
                />
              ) : (
                <Button
                  onClick={() => handleWalletTypeSelect("starknet")}
                  variant="outline"
                  className="flex justify-start items-center gap-4 w-full h-16 border-[#232323] hover:bg-[#2a2a2a] rounded-2xl transition-all hover:scale-[1.02] border hover:border-[#353535] group"
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
            </>
          </div>

          {isConnected && (
            <div className="px-4 pb-4">
              <Button
                className="w-full mt-5 rounded-lg text-base h-12 font-medium bg-[#9E2121] hover:bg-red-800"
                onClick={() => handleDisconnectCurrentWallet()}
              >
                Disconnect All
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
