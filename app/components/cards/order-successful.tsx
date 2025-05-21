import { Button } from "@/components/ui/button";
import { useQuoteStore } from "@/store/quote-store";
import { useUserSelectionStore } from "@/store/user-selection";
import { OrderStep } from "@/types";

const OrderSuccessful = () => {
  const { reset, updateSelection } = useUserSelectionStore();
  const { resetQuote } = useQuoteStore();

  const handleBackClick = () => {
    reset();
    resetQuote();
    updateSelection({ orderStep: OrderStep.Initial });
  };

  return (
    <div className="fixed inset-0 z-50 flex py-20 justify-center bg-[#181818] gap-x-16">
      {/* Left side - Timeline */}
      <div className="flex flex-1 justify-end">
        <div className="flex flex-col gap-y-2">
          {/* Top step - USDC */}
          <div className="flex items-center gap-1.5 mb-2 bg-neutral-800 rounded-full px-4 py-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                fill="#3B82F6"
              />
              <path
                d="M12 6v12M15 12H9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-lg text-white font-medium">1 USDC</span>
          </div>

          {/* Vertical line with dot */}
          <div className="flex flex-1 flex-row justify-between">
            <div className="flex flex-1"></div>
            <div className="flex flex-col items-center gap-4">
              <div className="border-[1px] h-full border-neutral-700 border-dashed w-[1px]"></div>
              <div className="size-2.5 rounded-full bg-[#2ecc71] z-10"></div>
              <Button className="p-3 bg-[#232323] rounded-xl hover:bg-[#2a2a2a] text-white font-medium text-sm transition-colors w-fit">
                Ok
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex flex-1">
        <div className="flex flex-col gap-4 max-w-md">
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

          <div className="text-[#666666] text-sm space-y-1">
            <p>
              Your transfer of{" "}
              <span className="text-white">1 USDC (Ksh 127.82)</span> to Ok has
              been completed successfully.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <Button className="px-4 py-2 bg-[#232323] hover:bg-[#2a2a2a] text-white text-sm rounded-md transition-colors">
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
            <div className="flex justify-between text-sm">
              <span className="text-[#666666]">Onchain receipt</span>
              <a href="#" className="text-[#7B68EE] hover:underline">
                View in explorer
              </a>
            </div>
          </div>

          {/* Social Share */}
          <div className="mt-4">
            <p className="text-sm text-[#666666] mb-3">Help spread the word</p>
            <div className="bg-[#232323] p-4 rounded-lg mb-4">
              <p className="text-sm text-[#666666]">
                <span className="text-[#FFD700]">♥</span> Yay! I just swapped
                USDC for KES in 167 seconds on noblocks.xyz
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#232323] hover:bg-[#2a2a2a] text-white text-sm rounded-md transition-colors">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X (Twitter)
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#232323] hover:bg-[#2a2a2a] text-white text-sm rounded-md transition-colors">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M8 16l8-8M16 16L8 8" />
                </svg>
                Warpcast
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessful;
