"use client";

import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import { useQuoteStore } from "@/store/quote-store";
import { useWindowSize } from "react-use";
import { useUserSelectionStore } from "@/store/user-selection";
import { ChainTypes, OrderStep, TransferType } from "@/types";
import { useEffect, useState } from "react";
import AssetAvator from "./asset-avator";
import { assets } from "@/data/currencies";
import { useTransferStore } from "@/store/transfer-store";
import { useNetworkStore } from "@/store/network";
import { useRouter } from "next/navigation";

const OrderSuccessful = () => {
  const [exploreUrl, setExploreUrl] = useState<string>("");
  const { reset, updateSelection, orderStep } = useUserSelectionStore();
  const { quote } = useQuoteStore();
  const { width, height } = useWindowSize();
  const { resetQuote } = useQuoteStore();
  const { resetTransfer, transactionHash } = useTransferStore();
  const [showConfetti, setShowConfetti] = useState(true);
  const { currentNetwork } = useNetworkStore();

  const router = useRouter();

  useEffect(() => {
    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(confettiTimer);
  }, []);

  useEffect(() => {
    if (orderStep !== OrderStep.PaymentCompleted) {
      setTimeout(() => {
        updateSelection({ orderStep: OrderStep.PaymentCompleted });
      }, 5000);
    }
  }, [orderStep]);

  useEffect(() => {
    if (transactionHash) {
      if (currentNetwork?.type === ChainTypes.EVM) {
        setExploreUrl(
          currentNetwork?.blockExplorers?.default.url + "/tx/" + transactionHash
        );
      } else if (currentNetwork?.type === ChainTypes.Starknet) {
        const url = "https://voyager.online/tx/" + transactionHash;
        setExploreUrl(url);
      }
    }
  }, [transactionHash, currentNetwork]);

  const handleBackClick = () => {
    reset();
    resetQuote();
    resetTransfer();
    updateSelection({ asset: assets[0] });
    updateSelection({ orderStep: OrderStep.Initial });
    updateSelection({ pastedAddress: undefined });
    updateSelection({ paymentMethod: "momo" });
    router.refresh();
  };

  if (!quote) return null;

  return (
    <div className="fixed inset-0 z-50 flex-col md:flex-row flex py-20  justify-center bg-[#181818] gap-x-16">
      {orderStep === OrderStep.PaymentCompleted && showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Left side - Timeline */}
      <div className=" flex-col md:flex-row md:justify-end w-full md:w-1/3 flex">
        <div className="flex gap-4 px-4 md:px-0 md:gap-0 items-center justify-between flex-row md:flex-col gap-y-2  ">
          {/* Top step - USDC */}

          <div className="flex ">
            {quote && (
              <AssetAvator
                cryptoType={quote?.cryptoType}
                cryptoAmount={quote?.amountPaid}
              />
            )}
          </div>

          {/* Vertical line with dot */}
          <div className="flex flex-1 flex-col md:flex-row justify-between ">
            <div className="flex flex-1 "></div>
            <div className="flex flex-row md:flex-col  items-center gap-4 ">
              <div className="border-[1px] h-[1px] md:h-32 border-neutral-700 border-dashed w-full md:w-[1px]"></div>
              <div className="hidden md:block size-2.5 rounded-full bg-[#2ecc71] z-10"></div>
              <Button className="p-3 bg-[#232323] rounded-xl hover:bg-[#2a2a2a] text-white font-medium text-sm transition-colors w-fit">
                Ok
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="p-8 md:p-0 flex gap-x-10 flex-1 w-full">
        <div className="flex flex-col gap-4 max-w-md">
          <div className="flex items-center gap-2 ">
            <svg
              className="text-[#2ecc71] w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 4L12 14.01l-3-3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <h2 className="text-2xl font-medium text-white">
              Transaction successful
            </h2>
          </div>

          <div className="text-[#666666] text-sm space-y-1">
            <p>
              Your transfer of{" "}
              <span className="text-white">
                {quote?.amountPaid} {quote?.cryptoType} ({quote.fiatType}{" "}
                {quote.fiatAmount})
              </span>{" "}
              to Ok has been completed successfully.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <Button
              disabled
              className="px-4 py-2 bg-[#232323] hover:bg-[#2a2a2a] text-white text-sm rounded-md transition-colors"
            >
              Get receipt
            </Button>
            <Button
              onClick={handleBackClick}
              className="px-4 py-2 bg-[#7B68EE] hover:bg-[#6A5ACD] text-white text-sm rounded-md transition-colors"
            >
              New payment
            </Button>
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox bg-transparent border-[#333333] rounded text-[#7B68EE]"
            />
            <span className="text-sm text-[#666666]">
              Add Ok to beneficiaries
            </span>
          </label>

          {/* Transaction Details */}
          <div className="space-y-4 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#666666]">Transaction status</span>
              <span className="text-[#2ecc71]">Completed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#666666]">Time spent</span>
              <span className="text-white">167 seconds</span>
            </div>

            {quote?.transferType === TransferType.TransferOut && (
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Onchain receipt</span>
                <a
                  href={exploreUrl}
                  target="_blank"
                  className="text-[#7B68EE] hover:underline"
                >
                  View in explorer
                </a>
              </div>
            )}
          </div>

          {/* Social Share */}
          <div className="mt-4">
            <p className="text-sm text-[#666666] mb-3">Help spread the word</p>
            <div className="bg-[#232323] p-4 rounded-lg mb-4">
              <p className="text-sm text-[#666666]">
                <span className="text-[#FFD700]">♥</span> Yay! I just swapped{" "}
                {quote?.cryptoType} for {quote.fiatType} in 167 seconds on
                pay.oneramp.io
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://x.com/0xOneramp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#232323] hover:bg-[#2a2a2a] text-white text-sm rounded-md transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X (Twitter)
              </a>
              {/* <button className="flex items-center gap-2 px-4 py-2 bg-[#232323] hover:bg-[#2a2a2a] text-white text-sm rounded-md transition-colors">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M8 16l8-8M16 16L8 8" />
                </svg>
                Warpcast
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessful;
