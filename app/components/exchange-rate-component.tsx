import React from "react";
import { useUserSelectionStore } from "@/store/user-selection";
import { useExchangeRateStore } from "@/store/exchange-rate-store";
import { cn } from "@/lib/utils";

const ExchangeRateComponent = ({
  default: isDefault,
}: {
  default?: boolean;
}) => {
  const { country, asset } = useUserSelectionStore();
  const { exchangeRate } = useExchangeRateStore();

  return (
    <div
      className={cn(
        isDefault && "w-full flex flex-col items-center justify-center"
      )}
    >
      {country && (
        <div className="mx-4 md:mx-10 mb-4 flex justify-between text-sm ">
          <span className="text-neutral-400 flex items-center gap-2">
            1 {asset?.symbol ? asset.symbol : "USD"} ~{" "}
            {exchangeRate ? (
              <>
                {exchangeRate.exchange.toLocaleString()} {country.currency}
              </>
            ) : (
              <>-- {country.currency}</>
            )}
          </span>
          {!isDefault && (
            <span className="text-neutral-400 hidden md:block">
              Swap usually completes in 30s
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ExchangeRateComponent;
