"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUPPORTED_NETWORKS_WITH_RPC_URLS } from "@/data/networks";
import { cn } from "@/lib/utils";
import { useNetworkStore } from "@/store/network";
import { useUserSelectionStore } from "@/store/user-selection";
import { useAppKitAccount } from "@reown/appkit/react";
import { useState } from "react";
import SubmitButton from "./buttons/submit-button";
import { InstitutionModal } from "./modals/InstitutionModal";

const SelectInstitution = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const { institution, country, updateSelection } = useUserSelectionStore();

  const { currentNetwork } = useNetworkStore();

  const { isConnected } = useAppKitAccount();

  const handleInstitutionSelect = (inst: string) => {
    updateSelection({ institution: inst });
    setShowInstitutionModal(false);
  };

  // Updated swap button text function
  const getSwapButtonText = () => {
    if (!isConnected) {
      return "Connect Wallet";
    }

    if (currentNetwork?.type === "evm" && !isConnected) {
      return "Connect EVM Wallet";
    }

    if (currentNetwork?.type === "starknet" && !isConnected) {
      return "Connect Starknet Wallet";
    }

    if (!accountNumber) {
      return "Enter account number";
    }

    if (!institution) {
      return "Select institution";
    }

    return "Swap";
  };

  // Check if user has the required wallet for the selected network
  const hasRequiredWallet = () => {
    // if (currentNetwork?.type === "starknet") {
    //   return starknetConnected;
    // } else {
    //   return evmConnected;
    // }

    // TODO: Check for starknet too...

    const isSupportedNetwork = SUPPORTED_NETWORKS_WITH_RPC_URLS.find(
      (network) => network.name === currentNetwork?.name
    );

    return isSupportedNetwork;
  };

  return (
    <>
      <div className="mx-4 mb-2 bg-[#232323] rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-white text-lg font-medium">Recipient</span>
        </div>

        <div className="flex gap-3 items-center h-14   ">
          {/* Institution Selector */}
          <Button
            variant="default"
            onClick={() => setShowInstitutionModal(true)}
            className="bg-transparent  border w-1/3 h-full border-[#444] text-neutral-400 rounded-full p-3 cursor-pointer flex items-center justify-center"
          >
            <span className=" line-clamp-1">
              {institution || "Select institution"}
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

          {/* Account Number */}
          <div className="flex-1 h-full">
            <Input
              type="text"
              placeholder="Account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="bg-transparent border border-[#444] text-lg text-white font-medium rounded-full h-full pl-6 w-full focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>
      </div>
      {country && (
        <InstitutionModal
          open={showInstitutionModal}
          onClose={() => setShowInstitutionModal(false)}
          institutions={country.institutions}
          selectedInstitution={institution || null}
          onSelect={handleInstitutionSelect}
          country={country.name}
        />
      )}

      <div className="mx-4 mb-4">
        {/* If recipient form is fully completed or wallet is not yet connected, show the button */}
        <SubmitButton
          className={cn(
            "w-full text-white text-base font-bold h-14 mt-2 rounded-2xl",
            hasRequiredWallet()
              ? country && institution && accountNumber
                ? "bg-[#2563eb] hover:bg-[#1d4ed8]"
                : "bg-[#232323] hover:bg-[#2a2a2a]"
              : "bg-[#232323] hover:bg-[#2a2a2a]"
          )}
          onClick={() => {}}
          // disabled={isSwapButtonDisabled()}
        >
          {getSwapButtonText()}
        </SubmitButton>

        {/* Show wallet requirement message if needed */}
        {!hasRequiredWallet() && (
          <div className="text-center mt-2 text-xs text-amber-400 font-medium">
            {currentNetwork?.type === "starknet"
              ? "Starknet wallet required for this network"
              : "EVM wallet required for this network"}
          </div>
        )}
      </div>
    </>
  );
};

export default SelectInstitution;
