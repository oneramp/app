import { createTransferIn, submitTransactionHash } from "@/actions/transfer";
import { ConnectSingleWallet } from "@/components/connect-single-wallet";
import { Button } from "@/components/ui/button";
import useWalletInfo from "@/hooks/useWalletGetInfo";
import useEVMPay from "@/onchain/useEVMPay";
import usePayStarknet from "@/onchain/usePayStarknet";
import { useKYCStore } from "@/store/kyc-store";
import { useNetworkStore } from "@/store/network";
import { useQuoteStore } from "@/store/quote-store";
import { useTransferStore } from "@/store/transfer-store";
import { useUserSelectionStore } from "@/store/user-selection";
import {
  AppState,
  ChainTypes,
  OrderStep,
  TransferBankRequest,
  TransferMomoRequest,
  TransferType,
} from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import AssetAvator from "../cards/asset-avator";
import { CancelModal } from "./cancel-modal";

interface WrongChainState {
  isWrongChain: boolean;
  chainId: number;
  buttonText: string;
}

export function TransactionReviewModal() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { quote, resetQuote } = useQuoteStore();
  const [loading, setLoading] = useState(false);
  const {
    institution,
    accountNumber,
    updateSelection,
    orderStep: currentOrderStep,
    asset,
  } = useUserSelectionStore();
  const userPayLoad = useUserSelectionStore();
  const { kycData } = useKYCStore();
  const { currentNetwork } = useNetworkStore();
  const { resetTransfer, transfer, setTransactionHash, setTransfer } =
    useTransferStore();

  const [wrongChainState, setWrongChainState] = useState<WrongChainState>({
    isWrongChain: false,
    chainId: 0,
    buttonText: "Confirm payment",
  });

  const { payWithEVM, isLoading, isSuccess, transactionReceipt } = useEVMPay();

  // Initialize Starknet pay
  const starknetPay = usePayStarknet(
    asset?.networks["Starknet"]?.tokenAddress ?? ""
  );

  const { chainId, address, isConnected } = useWalletInfo();

  useEffect(() => {
    if (chainId !== currentNetwork?.chainId) {
      setWrongChainState({
        isWrongChain: true,
        chainId: currentNetwork?.chainId ?? 0,
        buttonText: "Switch to " + currentNetwork?.name,
      });
      return;
    }

    if (address && isConnected) {
      setWrongChainState({
        isWrongChain: false,
        chainId: chainId ?? 0,
        buttonText: "Confirm payment",
      });
      return;
    }

    if (!address || !isConnected) {
      setWrongChainState({
        isWrongChain: true,
        chainId: currentNetwork?.chainId ?? 0,
        buttonText: "Connect " + currentNetwork?.name,
      });
      return;
    }
  }, [chainId, currentNetwork, address, isConnected]);

  useEffect(() => {
    if (
      isSuccess &&
      !isLoading &&
      transactionReceipt?.transactionHash &&
      transfer?.transferId &&
      !wrongChainState.isWrongChain &&
      currentNetwork?.type === ChainTypes.EVM
    ) {
      setTransactionHash(transactionReceipt.transactionHash);
      submitTxHashMutation.mutate({
        transferId: transfer.transferId,
        txHash: transactionReceipt.transactionHash,
      });
      return;
    }

    if (
      starknetPay.status === "success" &&
      starknetPay.data?.transaction_hash &&
      transfer?.transferId &&
      !wrongChainState.isWrongChain &&
      currentNetwork?.type === ChainTypes.Starknet
    ) {
      setTransactionHash(starknetPay.data.transaction_hash);
      submitTxHashMutation.mutate({
        transferId: transfer.transferId,
        txHash: starknetPay.data.transaction_hash,
      });
      return;
    }
  }, [
    isSuccess,
    isLoading,
    transactionReceipt,
    starknetPay.status,
    starknetPay.data,
    transfer?.transferId,
    wrongChainState.isWrongChain,
    currentNetwork?.type,
    setTransactionHash,
  ]);

  const handleBackClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    resetQuote();
    resetTransfer();
    updateSelection({
      orderStep: OrderStep.Initial,
      accountNumber: undefined,
      accountName: undefined,
      institution: undefined,
      pastedAddress: undefined,
    });
  };

  const makeBlockchainTransaction = async () => {
    if (!asset || !currentNetwork || !quote || !transfer) return;

    const networkName = currentNetwork.name;

    const contractAddress = asset.networks[networkName]?.tokenAddress;

    if (!contractAddress) {
      return;
    }

    setLoading(true);

    const amountInWei = parseUnits(quote.amountPaid.toString(), 6);

    const recipient = transfer.transferAddress;

    const transactionPayload = {
      recipient,
      amount: amountInWei,
      tokenAddress: contractAddress,
    };

    const isStarknet = currentNetwork.type === ChainTypes.Starknet;

    if (isStarknet) {
      const strkPayload = {
        recipient,
        amount: quote.amountPaid,
        tokenAddress: contractAddress,
      };
      updateSelection({ appState: AppState.Processing });
      starknetPay.payWithStarknet(strkPayload);
    } else {
      updateSelection({ appState: AppState.Processing });
      payWithEVM(transactionPayload);
    }

    setTimeout(() => {
      setLoading(false);
    }, 7000);
  };

  const handleSubmitTransferIn = async () => {
    if (!quote) return;

    if (userPayLoad.paymentMethod === "momo") {
      const { institution, country } = userPayLoad;
      const { fullKYC } = kycData || {};

      // if (!institution || !accountNumber || !country || !fullKYC) return;
      if (!country || !fullKYC) return;

      const isNigeriaOrSouthAfrican =
        country.countryCode === "NG" || country.countryCode === "ZA";

      const {
        fullName,
        nationality,
        dateOfBirth,
        documentNumber,
        documentType,
        documentSubType,
        phoneNumber,
      } = fullKYC;

      let updatedDocumentType = documentType;
      let updatedDocumentTypeSubType = documentSubType;
      let payload: TransferMomoRequest | TransferBankRequest;

      if (country.countryCode === "NG") {
        updatedDocumentTypeSubType = "BVN";
        updatedDocumentType = "NIN";
      } else if (documentType === "ID") {
        updatedDocumentType = "NIN";
      } else if (documentType === "P") {
        updatedDocumentType = "Passport";
      } else {
        updatedDocumentType = "License";
      }

      const userDetails = {
        name: fullName,
        country: nationality,
        address: country.countryCode || "",
        phone: accountNumber,
        dob: dateOfBirth,
        idNumber: documentNumber,
        idType: updatedDocumentType,
        additionalIdType: updatedDocumentType,
        additionalIdNumber: updatedDocumentTypeSubType,
      };

      if (isNigeriaOrSouthAfrican) {
        if (!phoneNumber) return;
        payload = {
          bank: {
            code: "",
            accountNumber: "",
            accountName: "",
          },
          operator: "bank",
          quoteId: quote.quoteId,
          userDetails: {
            ...userDetails,
            phone: phoneNumber,
          },
        };
        updateSelection({
          paymentMethod: "bank",
        });
      } else {
        if (!institution || !accountNumber) return;
        const accountNumberWithoutLeadingZero = accountNumber.replace(
          /^0+/,
          ""
        );
        const fullPhoneNumber = `${country.phoneCode}${accountNumberWithoutLeadingZero}`;
        payload = {
          phone: fullPhoneNumber,
          operator: institution.name.toLowerCase(),
          quoteId: quote.quoteId,
          userDetails: {
            ...userDetails,
            phone: fullPhoneNumber,
          },
        };
      }

      const transferResponse = await createTransferIn(payload);
      setTransfer(transferResponse);
      return;
    }

    if (userPayLoad.paymentMethod === "bank") {
      const { institution, country } = userPayLoad;
      const { fullKYC } = kycData || {};

      // if (!institution || !accountNumber || !country || !fullKYC) return;
      if (!country || !fullKYC) return;

      const isNigeriaOrSouthAfrican =
        country.countryCode === "NG" || country.countryCode === "ZA";

      const {
        fullName,
        nationality,
        dateOfBirth,
        documentNumber,
        documentType,
        documentSubType,
        phoneNumber,
      } = fullKYC;

      let updatedDocumentType = documentType;
      let updatedDocumentTypeSubType = documentSubType;
      let payload;

      if (country.countryCode === "NG") {
        updatedDocumentTypeSubType = "BVN";
        updatedDocumentType = "NIN";
      } else if (documentType === "ID") {
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

      const userDetails = {
        name: fullName,
        country: nationality,
        address: country.countryCode || "",
        phone: accountNumber,
        dob: dateOfBirth,
        idNumber: documentNumber,
        idType: updatedDocumentType,
        additionalIdType: updatedDocumentType,
        additionalIdNumber: updatedDocumentTypeSubType,
      };

      if (isNigeriaOrSouthAfrican) {
        payload = {
          bank: {
            code: "",
            accountNumber: "",
            accountName: "",
          },
          operator: "bank",
          quoteId: quote.quoteId,
          userDetails: {
            ...userDetails,
            phone: phoneNumber,
          },
        };
        updateSelection({
          paymentMethod: "bank",
        });
      } else {
        if (!institution || !accountNumber) return;
        payload = {
          bank: {
            code: institution.code,
            accountNumber: accountNumber,
            accountName: accountName,
          },
          operator: "bank",
          quoteId: quote.quoteId,
          userDetails: {
            name: fullName,
            country: nationality,
            address: country.countryCode || "",
            phone: phoneNumber || accountNumber,
            // phone: MOCK_NIGERIAN_PHONE_NUMBER_SUCCESS,
            dob: dateOfBirth,
            idNumber: documentNumber,
            idType: updatedDocumentType,
            additionalIdType: updatedDocumentType,
            additionalIdNumber: updatedDocumentTypeSubType,
          },
        };
      }

      const transferResponse = await createTransferIn(payload);

      setTransfer(transferResponse);
      return;
    }
  };

  const submitTxHashMutation = useMutation({
    mutationFn: submitTransactionHash,
    onSuccess: () => {
      updateSelection({ orderStep: OrderStep.GotTransfer });
    },
    onError: (error: Error) => {
      console.log("error", error.message);
    },
    retry: 3,
    retryDelay: 5000,
  });

  const submitTransferIn = useMutation({
    mutationFn: handleSubmitTransferIn,
    onSuccess: () => {
      updateSelection({ orderStep: OrderStep.GotTransfer });
    },
  });

  if (currentOrderStep !== OrderStep.GotQuote) return null;
  if (!quote) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="bg-[#181818] rounded-2xl max-w-md w-[90%] shadow-xl p-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-white">
              Review transaction
            </h1>
            <p className="text-neutral-400 mb-4">
              Verify transaction details before you send
            </p>

            <div className="space-y-5">
              {/* Amount */}
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-lg">Amount</span>
                <AssetAvator
                  cryptoType={quote.cryptoType}
                  cryptoAmount={quote.amountPaid}
                />
              </div>

              {/* Total value */}
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-lg">Total value</span>
                <span className="text-white text-lg font-medium">
                  {quote.fiatAmount} {quote.fiatType}
                </span>
              </div>

              {/* Recipient */}
              {quote.transferType === TransferType.TransferOut && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-lg">Recipient</span>
                  <span className="text-white text-lg font-medium">
                    {transfer?.transferAddress?.slice(0, 4)}...
                    {transfer?.transferAddress?.slice(-4)}
                  </span>
                </div>
              )}

              {/* Account */}
              {accountNumber && institution && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-lg">Account</span>
                  <div className="text-white text-lg font-medium flex items-center">
                    <span>
                      {accountNumber?.slice(0, 4)}...{accountNumber?.slice(-4)}
                    </span>
                    <span className="text-neutral-400 mx-2">•</span>
                    <span>{institution?.name.slice(0, 4)}</span>
                  </div>
                </div>
              )}

              {/* Network */}
              {currentNetwork && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-lg">Network</span>
                  <div className="flex items-center gap-2">
                    <Image
                      src={currentNetwork.logo}
                      alt={currentNetwork.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-white text-lg font-medium">
                      {currentNetwork.name}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="bg-[#232323] p-4 rounded-lg mt-4 mb-4 flex items-start gap-3">
              <div className="mt-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#666"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 7v6"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="16" r="1" fill="#666" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">
                Ensure the details above are correct. Failed transaction due to
                wrong details may attract a refund fee
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <Button
                variant="outline"
                className="flex-1 bg-[#333] hover:bg-[#444] border-none text-white p-6 text-lg rounded-xl"
                onClick={handleBackClick}
                disabled={
                  isLoading || loading || submitTxHashMutation.isPending
                }
              >
                Back
              </Button>

              {quote && quote.transferType === TransferType.TransferIn ? (
                <Button
                  className="flex-1 bg-[#7B68EE] hover:bg-[#6A5ACD] text-white p-6 text-lg rounded-xl"
                  onClick={() => submitTransferIn.mutate()}
                  disabled={submitTransferIn.isPending}
                >
                  {isLoading ||
                  submitTxHashMutation.isPending ||
                  loading ||
                  submitTransferIn.isPending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Confirm Payment"
                  )}
                </Button>
              ) : (
                <>
                  {!isConnected ? (
                    <ConnectSingleWallet
                      large
                      chainType={currentNetwork?.type}
                    />
                  ) : (
                    <Button
                      className="flex-1 bg-[#7B68EE] hover:bg-[#6A5ACD] text-white p-6 text-lg rounded-xl"
                      onClick={makeBlockchainTransaction}
                      disabled={
                        isLoading ||
                        submitTxHashMutation.isPending ||
                        loading ||
                        wrongChainState.isWrongChain ||
                        !transfer
                      }
                    >
                      {isLoading ||
                      submitTxHashMutation.isPending ||
                      loading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        wrongChainState.buttonText
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <CancelModal
          title="Cancel Transaction?"
          description="Are you sure you want to cancel this transaction? Your current progress will be lost."
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </>
  );
}
