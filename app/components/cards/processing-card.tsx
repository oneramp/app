import React from "react";
import { FiLink, FiArrowRight, FiFileText } from "react-icons/fi";
import { Loader } from "lucide-react";
import { TransferType, Quote, Transfer } from "@/types";
import AssetAvator from "./asset-avator";
import CountryAvator from "./country-avator";

interface ProcessingCardProps {
  transactionHash?: string;
  exploreUrl?: string;
  quote: Quote;
  transfer?: Transfer;
  onCancel: () => void;
  onGetReceipt: () => void;
}

const ProcessingCard: React.FC<ProcessingCardProps> = ({
  transactionHash,
  exploreUrl,
  quote,
  transfer,
  onGetReceipt,
}) => {
  const currentDate =
    new Date().toLocaleDateString("en-CA") +
    " " +
    new Date().toLocaleTimeString("en-GB");

  return (
    <div className="min-h-screen text-white flex items-center w-full md:w-1/3 justify-center">
      <div className="w-full h-full max-w-lg">
        {/* Main Card */}
        <div className="bg-gray-900 md:rounded-2xl md:border md:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Loader size={16} className="animate-spin text-white" />
              </div>
              <h2 className="text-xl font-medium text-white">Processing</h2>
            </div>
            <button
              onClick={onGetReceipt}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiFileText size={24} />
            </button>
          </div>

          {/* Transaction Flow */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
              {/* Source Card - Changes based on Transfer Type */}
              <div className="flex-1 bg-gray-800 rounded-xl p-6 h-44 flex flex-col items-center justify-center">
                <div className="mb-4 flex items-center justify-center relative size-24">
                  {quote.transferType === TransferType.TransferIn ? (
                    <CountryAvator country={quote.country} iconOnly />
                  ) : (
                    <AssetAvator
                      cryptoType={quote.cryptoType}
                      cryptoAmount={quote.amountPaid}
                      iconOnly
                    />
                  )}
                </div>
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-lg font-medium text-white mb-1">
                    {quote.transferType === TransferType.TransferIn
                      ? quote.fiatType
                      : quote.network.charAt(0).toUpperCase() +
                        quote.network.slice(1)}
                  </h1>
                  <h2 className="text-gray-300 font-mono text-sm">
                    {quote.transferType === TransferType.TransferIn
                      ? `${Number(quote.fiatAmount).toFixed(2)} ${
                          quote.fiatType
                        }`
                      : `${Number(quote.amountPaid).toFixed(3)} ${
                          quote.cryptoType
                        }`}
                  </h2>
                </div>
              </div>

              {/* Arrow */}
              <div className="bg-gray-800 rounded-full p-3 text-yellow-500">
                <FiArrowRight size={20} />
              </div>

              {/* Destination Card - Changes based on Transfer Type */}
              <div className="flex-1 bg-gray-800 rounded-xl p-6 h-44 flex flex-col items-center justify-center">
                <div className="mb-4 flex items-center justify-center relative size-24">
                  {quote.transferType === TransferType.TransferIn ? (
                    <AssetAvator
                      cryptoType={quote.cryptoType}
                      cryptoAmount={quote.amountPaid}
                      iconOnly
                    />
                  ) : (
                    <CountryAvator country={quote.country} iconOnly />
                  )}
                </div>
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-lg font-medium text-white mb-1">
                    {quote.transferType === TransferType.TransferIn
                      ? quote.network.charAt(0).toUpperCase() +
                        quote.network.slice(1)
                      : quote.fiatType}
                  </h1>
                  <h2 className="text-gray-300 font-mono text-sm">
                    {quote.transferType === TransferType.TransferIn
                      ? `${Number(quote.amountPaid).toFixed(3)} ${
                          quote.cryptoType
                        }`
                      : `${Number(quote.fiatAmount).toFixed(2)} ${
                          quote.fiatType
                        }`}
                  </h2>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              {/* Source TX */}
              {transactionHash && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Source TX</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">
                      {transactionHash
                        ? `${transactionHash.slice(
                            0,
                            6
                          )}...${transactionHash.slice(-6)}`
                        : `${quote.address.slice(0, 6)}...${quote.address.slice(
                            -6
                          )}`}
                    </span>
                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Loader size={12} className="animate-spin text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Order ID */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Order ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">
                    {quote.quoteId.slice(0, 6)}...{quote.quoteId.slice(-6)}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700 my-4"></div>

              {/* Recipient Address */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Recipient address</span>
                <span className="text-white font-mono text-sm">
                  {quote.address.slice(0, 6)}...{quote.address.slice(-6)}
                </span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Started at</span>
                <span className="text-white text-sm">{currentDate}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-sm font-medium">
                    Processing
                  </span>
                  <Loader size={14} className="animate-spin text-yellow-500" />
                </div>
              </div>

              {/* Institution (if available) */}
              {transfer?.userActionDetails?.institutionName && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Institution</span>
                  <span className="text-white text-sm">
                    {transfer.userActionDetails.institutionName}
                  </span>
                </div>
              )}

              {/* Explorer Link (if processing TransferOut) */}
              {quote.transferType === TransferType.TransferOut &&
                exploreUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">View Transaction</span>
                    <a
                      href={exploreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span className="text-sm">Explorer</span>
                      <FiLink size={14} />
                    </a>
                  </div>
                )}
            </div>

            {/* Action Button */}
            <div className="mt-8">
              {/* <Button
                onClick={onCancel}
                variant="outline"
                className="w-full bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-lg font-medium h-14 rounded-xl transition-colors"
              >
                Cancel Transaction
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingCard;
