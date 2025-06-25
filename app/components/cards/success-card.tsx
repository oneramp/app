import React from "react";
import { FiCheck, FiLink } from "react-icons/fi";
import { HiOutlineLink } from "react-icons/hi";
import { TransferType, Quote } from "@/types";
import AssetAvator from "./asset-avator";
import { Button } from "@/components/ui/button";

interface SuccessCardProps {
  transactionHash?: string;
  exploreUrl?: string;
  quote: Quote;
  onNewPayment: () => void;
  onGetReceipt: () => void;
}

const SuccessCard: React.FC<SuccessCardProps> = ({
  transactionHash,
  exploreUrl,
  quote,
  onNewPayment,
  onGetReceipt,
}) => {
  return (
    <div className="h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md h-full">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              {quote.transferType === TransferType.TransferIn ? "Buy" : "Swap"}
            </span>
            <span className="text-gray-600">›</span>
            <span className="text-gray-300">
              {transactionHash
                ? `${transactionHash.slice(0, 4)}...${transactionHash.slice(
                    -4
                  )}`
                : quote.address.slice(0, 4) + "..." + quote.address.slice(-4)}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
          {/* Asset Avatar */}

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-6">
              {/* Step 1 */}
              <div className="flex relative items-center justify-center w-12 h-12 rounded-full ">
                <AssetAvator
                  cryptoType={quote.cryptoType}
                  cryptoAmount={quote.amountPaid}
                  iconOnly
                />
              </div>

              {/* Connection Line */}
              <div className="w-12 h-0.5 bg-blue-500"></div>

              {/* Step 2 - Success Badge */}
              <div className="relative">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiCheck size={32} color="#ffffff" />
                </div>
                <div className="absolute -top-2 -left-2 w-20 h-20 border-4 border-blue-500/30 rounded-full"></div>
              </div>

              {/* Connection Line */}
              <div className="w-12 h-0.5 bg-blue-500"></div>

              {/* Step 3 */}
              <div className="flex items-center justify-center size-10 rounded-full bg-blue-500 border-2 border-blue-500">
                <HiOutlineLink size={18} color="#ffffff" />
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-2">
            <div className="text-gray-400 text-2xl">Transfer successful!</div>
          </div>

          {/* Transaction Summary */}
          <div className="text-center mb-4">
            <div className="text-gray-400 text-sm">
              Your transfer of{" "}
              <span className="text-white font-medium">
                {Number(quote.amountPaid).toFixed(2)} {quote.cryptoType}
              </span>{" "}
              ({Number(quote.fiatAmount).toFixed(2)} {quote.fiatType}) has been
              completed successfully.
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-2 mt-4">
            <div className="h-px bg-gray-800 my-4"></div>

            <div className="flex items-center justify-between pb-3">
              <span className="text-gray-400">Amount sent</span>
              <span className="text-white">
                {Number(quote.fiatAmount).toFixed(2)} {quote.fiatType}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3">
              <span className="text-gray-400">Network</span>
              <span className="text-white capitalize">{quote.network}</span>
            </div>

            <div className="flex items-center justify-between pb-3">
              <span className="text-gray-400">Country</span>
              <span className="text-white">{quote.country}</span>
            </div>

            {/* View on Transactions Link */}
            {quote.transferType === TransferType.TransferOut && exploreUrl && (
              <div className="">
                <a
                  href={exploreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full text-gray-300 hover:text-white transition-colors group"
                >
                  <span>View on Transactions page</span>
                  <FiLink size={16} color="#9ca3af" />
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={onGetReceipt}
                disabled
                className="flex-1 px-4 py-2 bg-transparent border border-gray-800  text-gray-400 text-base h-12 rounded-lg transition-colors"
              >
                Get Receipt
              </Button>
              <Button
                onClick={onNewPayment}
                className="flex-1  bg-blue-500 hover:bg-blue-600 text-white text-base h-12 rounded-lg transition-colors"
              >
                New Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessCard;
