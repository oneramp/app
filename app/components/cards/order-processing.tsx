"use client";

import { getTransferStatus } from "@/actions/transfer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuoteStore } from "@/store/quote-store";
import { useTransferStore } from "@/store/transfer-store";
import { useUserSelectionStore } from "@/store/user-selection";
import { OrderStep, TransferStatusEnum, TransferType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy, ExternalLink, Landmark, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CancelModal } from "../modals/cancel-modal";
import AssetAvator from "./asset-avator";
import TakingLongCard from "./taking-long-card";

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-[#333] rounded-lg transition-colors"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-neutral-400" />
      )}
    </button>
  );
};

const OrderProcessing = () => {
  const { updateSelection, paymentMethod, resetToDefault } =
    useUserSelectionStore();
  const { transfer, resetTransfer } = useTransferStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { quote, resetQuote } = useQuoteStore();
  const router = useRouter();

  const { data: transferStatus, isLoading } = useQuery({
    queryKey: ["transferStatus", transfer?.transferId],
    queryFn: () => {
      if (!transfer?.transferId) {
        throw new Error("Transfer ID is required");
      }
      return getTransferStatus(transfer.transferId);
    },
    enabled: !!transfer?.transferId,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  useEffect(() => {
    if (
      transferStatus?.status === TransferStatusEnum.TransferComplete &&
      !isLoading
    ) {
      updateSelection({ orderStep: OrderStep.PaymentCompleted });
    }
  }, [transferStatus?.status, isLoading]);

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    resetQuote();
    resetTransfer();
    // updateSelection({
    //   orderStep: OrderStep.Initial,
    //   accountNumber: undefined,
    //   institution: undefined,
    //   paymentMethod: "momo",
    //   pastedAddress: undefined,
    //   country: undefined,
    // });
    resetToDefault();
    router.refresh();
  };

  const paymentLink = transfer?.userActionDetails?.paymentLink;

  console.log("====================================");
  console.log("paymentLink", paymentLink);
  console.log("====================================");

  return (
    <div className="fixed inset-0 z-50 flex-col md:flex-row flex py-20  justify-center bg-[#181818] gap-x-16">
      {/* Left side - Timeline */}
      <div className="flex flex-col md:flex-row md:justify-end w-full md:w-1/3">
        <div className="flex gap-4 px-4 md:px-0 md:gap-0 items-center justify-between flex-row md:flex-col gap-y-2  ">
          {/* Top step - USDC */}

          <div className="flex ">
            {quote && (
              <AssetAvator
                cryptoAmount={quote?.amountPaid}
                cryptoType={quote?.cryptoType}
              />
            )}
          </div>

          {/* Vertical line with dot */}
          <div className="flex flex-1 flex-col md:flex-row justify-between ">
            <div className="flex flex-1 "></div>
            <div className="flex flex-row md:flex-col  items-center gap-4 ">
              <div className="border-[1px] h-[1px] md:h-32 border-neutral-700 border-dashed w-full md:w-[1px]"></div>
              <div className="hidden md:block size-2.5 rounded-full bg-[#2ecc71] z-10"></div>
              <Button
                disabled
                // onClick={() => {
                //   updateSelection({ orderStep: OrderStep.PaymentCompleted });
                // }}
                // onClick={handleTryAgain}
                // disabled={submitTxHashMutation.isPending}
                className=" p-3 rbg-[#232323] rounded-xl hover:!bg-[#2a2a2a] text-white font-medium text-sm transition-colors w-fit"
              >
                {/* {submitTxHashMutation.isPending || isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Ok"
                )} */}
                Ok
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="p-5 md:p-0 flex gap-x-10 flex-1 w-full">
        <div className="flex flex-col gap-4">
          <Badge
            variant="outline"
            className="text-yellow-500 p-2 border-none bg-neutral-800  rounded-full px-3 flex flex-row items-center justify-center gap-2"
          >
            <Loader className="size-10 animate-spin" />
            <h2 className="text-sm">Processing</h2>
          </Badge>

          {paymentMethod === "bank" &&
          quote?.transferType === TransferType.TransferIn ? (
            <div className="flex flex-col space-y-6">
              <div>
                <h2 className="text-2xl font-medium text-white mb-2">
                  Deposit Account Details
                </h2>
                <p className="text-[#666666] text-sm">
                  Send exactly{" "}
                  <span className="text-white">
                    {quote?.fiatType} {quote?.fiatAmount}
                  </span>{" "}
                  to the bank account below
                </p>
              </div>

              {paymentLink && (
                <div
                  onClick={() => {
                    window.open(paymentLink, "_blank");
                  }}
                  className="flex hover:bg-[#2a2a2a] border-[1px] border-neutral-700 transition-colors hover:cursor-pointer h-20 gap-3 bg-[#232323] items-center justify-between  flex-row rounded-xl p-4"
                >
                  <div className="size-12 bg-black rounded-md flex items-center justify-center">
                    <Landmark className="size-7 text-white" />
                  </div>
                  <div className="flex flex-1 w-full h-full flex-col">
                    <h1 className="text-white font-medium">
                      Pay with {transfer?.userActionDetails?.institutionName}
                    </h1>
                    <p className="text-[#666666] text-sm">
                      Use this link to complete your payment with your bank.
                    </p>
                  </div>

                  <div className="size-12 rounded-md  flex justify-end">
                    <ExternalLink className="size-6 text-white" />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "flex flex-col space-y-3 bg-[#232323]  rounded-xl p-4",
                  paymentLink && "bg-transparent"
                )}
              >
                {!paymentLink && (
                  <div className="flex w-full items-center justify-between py-3 border-b border-neutral-700">
                    <p className="text-neutral-400">Account Name</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">
                        {transfer?.userActionDetails?.accountName}
                      </p>
                      <CopyButton
                        value={transfer?.userActionDetails?.accountName || ""}
                      />
                    </div>
                  </div>
                )}

                {transfer?.userActionDetails?.accountNumber && (
                  <div className="flex w-full items-center justify-between py-3 border-b border-neutral-700">
                    <p className="text-neutral-400">Account Number</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold">
                        {transfer?.userActionDetails?.accountNumber}
                      </p>
                      <CopyButton
                        value={transfer?.userActionDetails?.accountNumber || ""}
                      />
                    </div>
                  </div>
                )}

                <div className="flex w-full items-center justify-between py-3 border-b border-neutral-700">
                  <p className="text-neutral-400">Amount</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold">
                      {quote?.fiatType}{" "}
                      {Number(quote?.fiatAmount).toLocaleString()}
                    </p>
                    <CopyButton value={quote?.fiatAmount || ""} />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between py-3 border-b border-neutral-700">
                  <p className="text-neutral-400">Institution Name</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">
                      {transfer?.userActionDetails?.institutionName}
                    </p>
                    <CopyButton
                      value={transfer?.userActionDetails?.institutionName || ""}
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between py-3">
                  <p className="text-neutral-400">Transaction Reference</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">
                      {"********" +
                        transfer?.userActionDetails?.transactionReference.slice(
                          -4
                        )}
                    </p>
                    <CopyButton
                      value={
                        transfer?.userActionDetails?.transactionReference || ""
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 p-4 rounded-lg">
                <p className="text-yellow-500 text-sm">
                  Important: Send the exact amount to avoid transaction delays.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <h2 className="text-2xl font-medium text-white mt-2">
                Processing payment...
              </h2>

              <div className="text-[#666666] text-sm space-y-1">
                <p>
                  Processing payment of{" "}
                  <span className="text-white">
                    {Number(quote?.amountPaid).toFixed(2).toLocaleString()}{" "}
                    {quote?.cryptoType} (
                    {Number(quote?.fiatAmount).toFixed(2).toLocaleString()}{" "}
                    {quote?.fiatType})
                  </span>{" "}
                  to
                </p>
                <p>Ok. Hang on, this will only take a few seconds</p>
              </div>

              <div className="flex my-4 w-full md:w-[80%] ">
                <TakingLongCard />
              </div>
            </div>
          )}
          <div className="flex flex-row gap-x-2  ">
            {/* {quote?.transferType === TransferType.TransferIn ? (
              <Button
                variant="ghost"
                onClick={() => setShowCancelModal(true)}
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
              >
                Cancel
              </Button>
            ) : (
              // <></>
              <Button
                variant="ghost"
                // onClick={() => setShowCancelModal(true)}
                onClick={handleCancelConfirm}
                className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
              >
                Done
              </Button>
            )} */}
            <Button
              variant="ghost"
              // onClick={() => setShowCancelModal(true)}
              onClick={handleCancelConfirm}
              className="!text-green-500 hover:!text-green-400 hover:!bg-green-500/10"
            >
              Done
            </Button>
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
    </div>
  );
};

export default OrderProcessing;
