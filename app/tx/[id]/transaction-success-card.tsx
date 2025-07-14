import React from "react";
import { FiCheck, FiLink, FiArrowRight, FiFileText } from "react-icons/fi";
import { TransferType, TransferStatus } from "@/types";

import CountryAvator from "@/app/components/cards/country-avator";
import AssetAvator from "@/app/components/cards/asset-avator";

interface TransactionSuccessCardProps {
  transferStatus: TransferStatus;
  exploreUrl?: string;
  onNewPayment: () => void;
  onGetReceipt: () => void;
}

const TransactionSuccessCard: React.FC<TransactionSuccessCardProps> = ({
  transferStatus,
  exploreUrl,
  onGetReceipt,
}) => {
  const currentDate =
    new Date().toLocaleDateString("en-CA") +
    " " +
    new Date().toLocaleTimeString("en-GB");

  let totalAmount = 0;
  if (transferStatus.fiatType === "KES" || transferStatus.fiatType === "UGX") {
    totalAmount = Number(transferStatus.amountProvided);
  } else {
    totalAmount = Number(transferStatus.amountProvided);
  }

  return (
    <div className="min-h-screen text-white flex items-center w-full md:w-1/3 justify-center bg-black">
      <div className="w-full h-full max-w-lg">
        {/* Main Card */}
        <div className="bg-[#181818] rounded-2xl border border-[#232323] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#232323]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck size={16} color="#ffffff" />
              </div>
              <h2 className="text-xl font-medium text-white">Completed</h2>
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
            <div className="relative flex items-center gap-2 mb-8">
              {/* Source Card - Changes based on Transfer Type */}
              <div className="flex-1 bg-[#232323] rounded-xl p-6 h-44 flex flex-col items-center justify-center">
                <div className="mb-4 flex items-center justify-center relative size-24">
                  {transferStatus.transferType === TransferType.TransferIn ? (
                    <CountryAvator country="UG" iconOnly />
                  ) : (
                    <AssetAvator
                      cryptoType={transferStatus.cryptoType}
                      cryptoAmount={transferStatus.amountReceived}
                      iconOnly
                    />
                  )}
                </div>
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-lg font-medium text-white mb-1">
                    {transferStatus.transferType === TransferType.TransferIn
                      ? transferStatus.fiatType
                      : "Polygon"}
                  </h1>
                  <h2 className="text-gray-300 font-mono text-sm">
                    {transferStatus.transferType === TransferType.TransferIn
                      ? `${totalAmount.toFixed(2)} ${transferStatus.fiatType}`
                      : `${Number(transferStatus.amountReceived).toFixed(3)} ${
                          transferStatus.cryptoType
                        }`}
                  </h2>
                </div>
              </div>

              {/* Arrow positioned in the middle */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-[#181818] border-4 border-[#232323] rounded-xl p-2 md:p-3 shadow-lg text-green-500">
                  <FiArrowRight size={20} />
                </div>
              </div>

              {/* Destination Card - Changes based on Transfer Type */}
              <div className="flex-1 bg-[#232323] rounded-xl p-6 h-44 flex flex-col items-center justify-center">
                <div className="mb-4 flex items-center justify-center relative size-24">
                  {transferStatus.transferType === TransferType.TransferIn ? (
                    <AssetAvator
                      cryptoType={transferStatus.cryptoType}
                      cryptoAmount={transferStatus.amountReceived}
                      iconOnly
                    />
                  ) : (
                    <CountryAvator country="UG" iconOnly />
                  )}
                </div>
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-lg font-medium text-white mb-1">
                    {transferStatus.transferType === TransferType.TransferIn
                      ? "Polygon"
                      : transferStatus.fiatType}
                  </h1>
                  <h2 className="text-gray-300 font-mono text-sm">
                    {transferStatus.transferType === TransferType.TransferIn
                      ? `${Number(transferStatus.amountReceived).toFixed(3)} ${
                          transferStatus.cryptoType
                        }`
                      : `${totalAmount.toFixed(2)} ${transferStatus.fiatType}`}
                  </h2>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              {/* Source TX */}
              {transferStatus.txHash && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Source TX</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">
                      {`${transferStatus.txHash.slice(
                        0,
                        6
                      )}...${transferStatus.txHash.slice(-6)}`}
                    </span>
                    <FiCheck size={16} color="#10b981" />
                  </div>
                </div>
              )}

              {/* Order ID */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Order ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">
                    {transferStatus.transferId.slice(0, 6)}...
                    {transferStatus.transferId.slice(-6)}
                  </span>
                  <FiCheck size={16} color="#10b981" />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#232323] my-4"></div>

              {/* Recipient Address */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Recipient address</span>
                <span className="text-white font-mono text-sm">
                  {transferStatus.transferAddress.slice(0, 6)}...
                  {transferStatus.transferAddress.slice(-6)}
                </span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Timestamp</span>
                <span className="text-white text-sm">{currentDate}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-sm font-medium">
                    Completed
                  </span>
                  <FiCheck size={16} color="#10b981" />
                </div>
              </div>

              {/* Institution (if available) */}
              {transferStatus?.userActionDetails?.institutionName && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Institution</span>
                  <span className="text-white text-sm">
                    {transferStatus.userActionDetails.institutionName}
                  </span>
                </div>
              )}

              {/* Explorer Link (if processing TransferOut) */}
              {transferStatus.transferType === TransferType.TransferOut &&
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
            {/* <div className="mt-8">
              <Button
                onClick={onNewPayment}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold h-14 rounded-xl transition-colors"
              >
                {transferStatus.transferType === TransferType.TransferIn
                  ? "New Payment"
                  : "Swap Again"}
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSuccessCard;
