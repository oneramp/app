"use client";

import { createQuoteIn, createQuoteOut } from "@/actions/quote";
import { createTransferOut } from "@/actions/transfer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUPPORTED_NETWORKS_WITH_RPC_URLS } from "@/data/networks";
import useWalletGetInfo from "@/hooks/useWalletGetInfo";
import { useAmountStore } from "@/store/amount-store";
import { useKYCStore } from "@/store/kyc-store";
import { useNetworkStore } from "@/store/network";
import { useQuoteStore } from "@/store/quote-store";
import { useTransferStore } from "@/store/transfer-store";
import { useUserSelectionStore } from "@/store/user-selection";
import {
  AppState,
  Institution,
  OrderStep,
  QuoteRequest,
  TransferBankRequest,
  TransferMomoRequest,
} from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AccountDetails from "./account-details";
import SubmitButton from "./buttons/submit-button";
import { InstitutionModal } from "./modals/InstitutionModal";
import { KYCVerificationModal } from "./modals/KYCVerificationModal";

const SelectInstitution = ({ buy }: { buy?: boolean }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const { institution, country, updateSelection } = useUserSelectionStore();
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const { isValid: isAmountValid, amount: userAmountEntered } =
    useAmountStore();
  const userPayLoad = useUserSelectionStore();
  const { kycData } = useKYCStore();

  const { setQuote } = useQuoteStore();
  const { currentNetwork } = useNetworkStore();
  const { isConnected, address } = useWalletGetInfo();
  const { setTransfer } = useTransferStore();

  const createMutation = useMutation({
    mutationFn: async (payload: QuoteRequest) =>
      buy ? await createQuoteIn(payload) : await createQuoteOut(payload),
    onSuccess: async (data) => {
      updateSelection({ accountNumber, orderStep: OrderStep.GotQuote });

      // Create the transfer here too...
      if (userPayLoad.paymentMethod === "momo") {
        const { institution } = userPayLoad;
        const { fullKYC } = kycData || {};

        if (!institution || !accountNumber || !country || !fullKYC) return;

        const {
          fullName,
          nationality,
          dateOfBirth,
          documentNumber,
          documentType,
          documentSubType,
        } = fullKYC;

        // accountNumber withouth the leading 0
        const accountNumberWithoutLeadingZero = accountNumber.replace(
          /^0+/,
          ""
        );

        const fullPhoneNumber = `${country.phoneCode}${accountNumberWithoutLeadingZero}`;
        let updatedDocumentType = documentType;
        let updatedDocumentTypeSubType = documentSubType;

        if (country.countryCode === "NG") {
          updatedDocumentTypeSubType = "BVN";
          updatedDocumentType = "NIN";
        }

        if (documentType === "ID") {
          updatedDocumentType = "NIN";
        } else if (documentType === "P") {
          updatedDocumentType = "Passport";
        } else {
          updatedDocumentType = "License";
        }

        const payload: TransferMomoRequest = {
          phone: fullPhoneNumber,
          operator: institution.name.toLocaleLowerCase(),
          quoteId: data.quote.quoteId,
          userDetails: {
            name: fullName,
            country: nationality,
            address: country?.countryCode || "",
            phone: accountNumber,
            dob: dateOfBirth,
            idNumber: documentNumber,
            idType: updatedDocumentType,
            additionalIdType: updatedDocumentType,
            additionalIdNumber: updatedDocumentTypeSubType,
          },
        };

        setQuote(data.quote);

        if (!buy) {
          const transferResponse = await createTransferOut(payload);
          setTransfer(transferResponse);

          return;
        }
      }

      if (userPayLoad.paymentMethod === "bank") {
        const { institution } = userPayLoad;
        const { fullKYC } = kycData || {};

        if (!institution || !accountNumber || !country || !fullKYC) return;

        const {
          fullName,
          nationality,
          dateOfBirth,
          documentNumber,
          documentType,
          documentSubType,
        } = fullKYC;

        let updatedDocumentType = documentType;
        let updatedDocumentTypeSubType = documentSubType;

        if (country.countryCode === "NG") {
          updatedDocumentTypeSubType = "BVN";
          updatedDocumentType = "NIN";
        }

        if (documentType === "ID") {
          updatedDocumentType = "NIN";
        } else if (documentType === "P") {
          updatedDocumentType = "Passport";
        } else {
          updatedDocumentType = "License";
        }

        const accountName =
          userPayLoad.accountName === "OK"
            ? fullName
            : userPayLoad.accountName || fullName;

        const payload: TransferBankRequest = {
          bank: {
            code: institution.code,
            accountNumber: accountNumber,
            accountName: accountName,
          },
          operator: "bank",
          quoteId: data.quote.quoteId,
          userDetails: {
            name: fullName,
            country: nationality,
            address: country?.countryCode || "",
            phone: accountNumber,
            dob: dateOfBirth,
            idNumber: documentNumber,
            idType: updatedDocumentType,
            additionalIdType: updatedDocumentType,
            additionalIdNumber: updatedDocumentTypeSubType,
          },
        };

        setQuote(data.quote);

        if (!buy) {
          const transferResponse = await createTransferOut(payload);
          setTransfer(transferResponse);

          return;
        }
      }
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

  const handleInstitutionSelect = (inst: Institution) => {
    let instType = inst.type;
    // First check if the inst data has a key of type if not revert it to check if it has a key of accountNumberType
    if (!inst.type) {
      instType = inst.accountNumberType;
    }

    // Now check the inst.type value contains a string of mobile, if yes set the paymentMethod to momo
    if (instType.includes("mobile")) {
      // updateSelection({ paymentMethod: "momo" });
      instType = "momo";
    }

    updateSelection({
      institution: inst,
      paymentMethod: instType as "bank" | "momo",
    });
    setShowInstitutionModal(false);
  };

  const handleSubmit = () => {
    if (!userPayLoad) return;

    const { country, asset } = userPayLoad;

    if (!country || !asset || !currentNetwork) return;

    // Verify KYC
    if (kycData && kycData.kycStatus !== "VERIFIED") {
      setShowKYCModal(true);
      toast.error("KYC verification required");
      return;
    }

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

  const isAccountNumberValid = () => {
    if (!userPayLoad) return false;
    if (!accountNumber) return false;

    const { country, paymentMethod } = userPayLoad;

    if (!country?.accountNumberLength) return false;

    if (paymentMethod === "bank" && country.accountNumberLength?.bankLength) {
      return accountNumber.length >= country.accountNumberLength.bankLength;
    }

    if (paymentMethod === "momo" && country.accountNumberLength?.mobileLength) {
      return accountNumber.length >= country.accountNumberLength.mobileLength;
    }

    return false;
  };

  return (
    <>
      <div className={`mb-2 bg-[#232323] rounded-2xl p-5 flex flex-col gap-4 `}>
        <div className="flex items-center justify-between">
          <span className="text-white text-lg font-medium">Recipient</span>
        </div>

        <div className="flex gap-3 items-center h-14">
          {/* Institution Selector */}
          <Button
            variant="default"
            onClick={() => {
              setShowInstitutionModal(true);
              setAccountNumber("");
              updateSelection({ paymentMethod: undefined });
            }}
            className="bg-transparent border w-1/3 h-full border-[#444] text-neutral-400 rounded-full p-3 cursor-pointer flex items-center justify-center"
          >
            <span className="line-clamp-1">
              {institution?.name || "Select institution"}
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

        {/* Show account details only when account number is entered */}
        {accountNumber && isAccountNumberValid() && (
          <AccountDetails accountNumber={accountNumber} />
        )}
      </div>

      {country && (
        <InstitutionModal
          open={showInstitutionModal}
          onClose={() => setShowInstitutionModal(false)}
          selectedInstitution={institution || null}
          onSelect={handleInstitutionSelect}
          country={country.countryCode}
          buy={buy}
        />
      )}

      {buy && (
        <>
          <div className="flex items-center border border-[#444] rounded-full px-9 py-3">
            <svg
              width="24"
              height="24"
              className="mr-2 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="#888"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 4H4v14a2 2 0 002 2h12a2 2 0 002-2v-5M9 15H4M15 1v6m-3-3h6"
              />
            </svg>
            <Input
              type="text"
              placeholder="Paste your wallet address here..."
              // value={}
              // onChange={(e) => setDescription(e.target.value)}
              className="bg-transparent text-white w-full focus:outline-none p-3 outline-none border-none"
            />
          </div>

          <h1 className="text-center text-neutral-700 text-sm font-medium">
            OR
          </h1>
        </>
      )}

      <div className=" mb-4">
        <SubmitButton
          onClick={handleSubmit}
          disabled={
            buttonDisabled ||
            createMutation.isPending ||
            userPayLoad.appState === AppState.Processing
          }
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

      <KYCVerificationModal
        open={showKYCModal}
        onClose={() => {
          setShowKYCModal(false);
        }}
        kycLink={kycData?.message?.link || null}
      />
    </>
  );
};

export default SelectInstitution;
