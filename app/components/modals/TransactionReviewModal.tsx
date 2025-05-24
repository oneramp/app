import { createTransferIn } from "@/actions/transfer";
import { Button } from "@/components/ui/button";
import { useNetworkStore } from "@/store/network";
import { useQuoteStore } from "@/store/quote-store";
import { useTransferStore } from "@/store/transfer-store";
import { useUserSelectionStore } from "@/store/user-selection";
import { OrderStep } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import AssetAvator from "../cards/asset-avator";
import { CancelModal } from "./cancel-modal";

export function TransactionReviewModal() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { quote, resetQuote } = useQuoteStore();
  const { institution, accountNumber, updateSelection, orderStep } =
    useUserSelectionStore();
  const { currentNetwork } = useNetworkStore();
  const { setTransfer, resetTransfer } = useTransferStore();

  // if (!open) return null;

  const transferInMutation = useMutation({
    mutationFn: createTransferIn,
    onSuccess: (data) => {
      updateSelection({ orderStep: OrderStep.GotTransfer });
      setTransfer(data);
      // toast.success("Transfer in request created");
    },
    onError: () => {
      toast.error("Failed to create transfer in request");
    },
  });

  const handleBackClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    resetQuote();
    resetTransfer();
    updateSelection({ orderStep: OrderStep.Initial });
  };

  if (orderStep !== OrderStep.GotQuote) return null;

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
                  {quote?.fiatAmount} {quote?.fiatType}
                </span>
              </div>

              {/* Recipient */}
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-lg">Recipient</span>
                <span className="text-white text-lg font-medium">
                  {quote?.address.slice(0, 4)}...{quote?.address.slice(-4)}
                </span>
              </div>

              {/* Account */}
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

              {/* Network */}
              {currentNetwork && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-lg">Network</span>
                  <div className="flex items-center gap-2">
                    <Image
                      src={currentNetwork?.logo}
                      alt={currentNetwork?.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-white text-lg font-medium">
                      {currentNetwork?.name}
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
                disabled={transferInMutation.isPending}
              >
                Back
              </Button>

              <Button
                className="flex-1 bg-[#7B68EE] hover:bg-[#6A5ACD] text-white p-6 text-lg rounded-xl"
                onClick={() => transferInMutation.mutate()}
                disabled={transferInMutation.isPending}
              >
                {transferInMutation.isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Confirm payment"
                )}
              </Button>
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
