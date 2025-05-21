"use client";

import { createQuote } from "@/actions/quote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUPPORTED_NETWORKS_WITH_RPC_URLS } from "@/data/networks";
import useWalletGetInfo from "@/hooks/useWalletGetInfo";
import { useAmountStore } from "@/store/amount-store";
import { useNetworkStore } from "@/store/network";
import { useQuoteStore } from "@/store/quote-store";
import { useUserSelectionStore } from "@/store/user-selection";
import { OrderStep, Quote, QuoteRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SubmitButton from "./buttons/submit-button";
import { InstitutionModal } from "./modals/InstitutionModal";

const SelectInstitution = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const { institution, country, updateSelection } = useUserSelectionStore();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const {
    isValid: isAmountValid,
    amount: userAmountEntered,
    fiatAmount,
  } = useAmountStore();
  const userPayLoad = useUserSelectionStore();

  const { setQuote } = useQuoteStore();
  const { currentNetwork } = useNetworkStore();
  const { isConnected, address } = useWalletGetInfo();

  const createMutation = useMutation({
    mutationFn: async (payload: QuoteRequest) => await createQuote(payload),
    onSuccess: (data) => {
      updateSelection({ accountNumber, orderStep: OrderStep.GotQuote });

      // TEMPORARILY UPDATE QUOTE STATE
      if (!userPayLoad) return;

      const { country, asset } = userPayLoad;

      if (!country || !asset || !currentNetwork) return;

      const quoteTempData = {
        ...data.quote,
        address: address as string,
        country: country?.countryCode,
        cryptoAmount: userAmountEntered,
        fiatAmount: fiatAmount,
        cryptoType: asset?.symbol,
        fiatType: country?.currency,
        network: currentNetwork?.name.toLowerCase(),
      };

      setQuote(quoteTempData as Quote);
    },
    onError: () => {
      toast.error("Failed to create quote");
    },
  });

  // Update button disabled state and text whenever dependencies change
  useEffect(() => {
    const isDisabled =
      !isConnected ||
      !hasRequiredWallet() ||
      !accountNumber ||
      !institution ||
      !country ||
      !isAmountValid;
    setButtonDisabled(isDisabled);

    // Update button text based on conditions
    if (!isConnected) {
      setButtonText("Connect Wallet");
    } else if (!hasRequiredWallet()) {
      setButtonText(
        currentNetwork?.type === "starknet"
          ? "Connect Starknet Wallet"
          : "Connect EVM Wallet"
      );
    } else if (!accountNumber) {
      setButtonText("Enter account number");
    } else if (!institution) {
      setButtonText("Select institution");
    } else if (!isAmountValid) {
      setButtonText("Invalid amount");
    } else {
      setButtonText("Swap");
    }
  }, [
    isConnected,
    accountNumber,
    institution,
    country,
    currentNetwork,
    isAmountValid,
  ]);

  const handleInstitutionSelect = (inst: string) => {
    updateSelection({ institution: inst });
    setShowInstitutionModal(false);
  };

  const handleSubmit = () => {
    if (!userPayLoad) return;

    const { country, asset } = userPayLoad;

    if (!country || !asset || !currentNetwork) return;

    const payload: QuoteRequest = {
      address: address as string,
      country: country?.countryCode,
      cryptoAmount: userAmountEntered,
      cryptoType: asset?.symbol,
      fiatType: country?.currency,
      network: currentNetwork?.name.toLowerCase(),
    };

    createMutation.mutate(payload);
  };

  // Check if user has the required wallet for the selected network
  const hasRequiredWallet = () => {
    if (!currentNetwork) return false;

    const isSupportedNetwork = SUPPORTED_NETWORKS_WITH_RPC_URLS.find(
      (network) => network.name === currentNetwork.name
    );

    return !!isSupportedNetwork && isConnected;
  };

  return (
    <>
      <div className="mx-4 mb-2 bg-[#232323] rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-white text-lg font-medium">Recipient</span>
        </div>

        <div className="flex gap-3 items-center h-14">
          {/* Institution Selector */}
          <Button
            variant="default"
            onClick={() => setShowInstitutionModal(true)}
            className="bg-transparent border w-1/3 h-full border-[#444] text-neutral-400 rounded-full p-3 cursor-pointer flex items-center justify-center"
          >
            <span className="line-clamp-1">
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
        <SubmitButton
          onClick={handleSubmit}
          disabled={buttonDisabled || createMutation.isPending}
          className={`w-full text-white text-base font-bold h-14 mt-2 rounded-2xl ${
            buttonDisabled
              ? "bg-[#232323] hover:bg-[#2a2a2a] cursor-not-allowed"
              : "bg-[#2563eb] hover:bg-[#1d4ed8]"
          }`}
        >
          {createMutation.isPending ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            buttonText
          )}
        </SubmitButton>

        {/* Show wallet requirement message if needed */}
        {!hasRequiredWallet() && isConnected && (
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
