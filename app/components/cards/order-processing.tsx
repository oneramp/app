"use client";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";
import TakingLongCard from "./taking-long-card";
import { useUserSelectionStore } from "@/store/user-selection";
import { OrderStep, TransferStatusEnum } from "@/types";
import { Button } from "@/components/ui/button";
import { useTransferStore } from "@/store/transfer-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTransferStatus, submitTransactionHash } from "@/actions/transfer";
import { useEffect } from "react";
import AssetAvator from "./asset-avator";
import { useQuoteStore } from "@/store/quote-store";
import { toast } from "sonner";
const OrderProcessing = () => {
  const { updateSelection } = useUserSelectionStore();
  const { transfer, transactionHash } = useTransferStore();
  const { quote } = useQuoteStore();

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

  const submitTxHashMutation = useMutation({
    mutationFn: submitTransactionHash,
    onSuccess: () => {
      updateSelection({ orderStep: OrderStep.GotTransfer });
    },
    onError: (error) => {
      toast.error("Failed to submit transaction hash", {
        description: error.message,
      });
    },
  });

  const handleTryAgain = () => {
    if (!transfer?.transferId || !transactionHash) {
      toast.error("Transfer ID or transaction hash is required");
      return;
    }

    submitTxHashMutation.mutate({
      transferId: transfer?.transferId,
      txHash: transactionHash,
    });
  };

  // const handlePaymentCompleted = () => {
  //   updateSelection({ orderStep: OrderStep.PaymentCompleted });
  // };

  return (
    <div className="fixed inset-0 z-50 flex py-20  justify-center bg-[#181818] gap-x-16">
      {/* Left side - Timeline */}
      <div className="flex justify-end w-1/2">
        <div className="flex flex-col gap-y-2  ">
          {/* Top step - USDC */}

          {quote && (
            <AssetAvator
              cryptoAmount={quote?.cryptoAmount}
              cryptoType={quote?.cryptoType}
            />
          )}

          {/* Vertical line with dot */}
          <div className="flex flex-1 flex-row justify-between ">
            <div className="flex flex-1 "></div>
            <div className="flex flex-col items-center gap-4 ">
              <div className="border-[1px] h-32 border-neutral-700 border-dashed w-[1px]"></div>
              <div className=" size-2.5 rounded-full bg-[#2ecc71] z-10"></div>
              <Button
                disabled
                // onClick={() => {
                //   updateSelection({ orderStep: OrderStep.PaymentCompleted });
                // }}
                onClick={handleTryAgain}
                // disabled={submitTxHashMutation.isPending}
                className=" p-3 bg-[#232323] rounded-xl hover:bg-[#2a2a2a] text-white font-medium text-sm transition-colors w-fit"
              >
                {submitTxHashMutation.isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Ok"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Content */}
      <div className=" flex gap-x-10 flex-1 w-full">
        <div className="flex flex-col gap-4">
          <Badge
            variant="outline"
            className="text-green-500 p-2 border-none bg-neutral-800  rounded-full px-3 flex flex-row items-center justify-center gap-2"
          >
            <Loader className="size-10 animate-spin" />
            <h2 className="text-sm">Fulfilled</h2>
          </Badge>

          <h2 className="text-2xl font-medium text-white mt-2">
            Processing payment...
          </h2>

          <div className="text-[#666666] text-sm space-y-1">
            <p>
              Processing payment of{" "}
              <span className="text-white">1 USDC (Ksh 134)</span> to
            </p>
            <p>Ok. Hang on, this will only take a few seconds</p>
          </div>

          <TakingLongCard />
        </div>
      </div>
    </div>
  );
};

export default OrderProcessing;
