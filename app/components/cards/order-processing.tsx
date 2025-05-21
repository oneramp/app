import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";
import TakingLongCard from "./taking-long-card";
import { useUserSelectionStore } from "@/store/user-selection";
import { OrderStep } from "@/types";
import { Button } from "@/components/ui/button";

const OrderProcessing = () => {
  const { updateSelection, orderStep } = useUserSelectionStore();

  // if (orderStep !== OrderStep.ProcessingPayment) return null;

  console.log("====================================");
  console.log("Order step", orderStep);
  console.log("====================================");

  // TODO: Test functions
  const handlePaymentCompleted = () => {
    updateSelection({ orderStep: OrderStep.PaymentCompleted });
  };

  return (
    <div className="fixed inset-0 z-50 flex py-20  justify-center bg-[#181818] gap-x-16">
      {/* Left side - Timeline */}
      <div className="flex flex-1 justify-end">
        <div className="flex flex-col gap-y-2  ">
          {/* Top step - USDC */}
          <div className="flex items-center gap-1.5 mb-2 bg-neutral-800 rounded-full px-4 py-2">
            <div className="size-8 rounded-full bg-blue-600"></div>
            <h1 className="text-lg text-white font-medium">1 USDC</h1>
          </div>

          {/* Vertical line with dot */}
          <div className="flex flex-1 flex-row justify-between ">
            <div className="flex flex-1 "></div>
            <div className="flex flex-col items-center gap-4 ">
              <div className="border-[1px] h-32 border-neutral-700 border-dashed w-[1px]"></div>
              <div className=" size-2.5 rounded-full bg-[#2ecc71] z-10"></div>
              <Button
                onClick={handlePaymentCompleted}
                className=" p-3 bg-[#232323] rounded-xl hover:bg-[#2a2a2a] text-white font-medium text-sm transition-colors w-fit"
              >
                Ok
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Content */}
      <div className=" flex gap-x-10 flex-1">
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
