import React from "react";
import { useUserSelectionStore } from "@/store/user-selection";
import { useExchangeRateStore } from "@/store/exchange-rate-store";
import { Loader2 } from "lucide-react";

const ExchangeRateComponent = () => {
  const { country, asset } = useUserSelectionStore();
  const { exchangeRate, isLoading } = useExchangeRateStore();

  return (
    <>
      {country && (
        <div className="mx-10 mb-4 flex justify-between text-sm">
          <span className="text-neutral-400 flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Fetching rate...</span>
              </>
            ) : (
              <>
                1 {asset?.symbol} ~{" "}
                {exchangeRate ? (
                  <>
                    {exchangeRate.exchange.toLocaleString()} {country.currency}
                  </>
                ) : (
                  <>-- {country.currency}</>
                )}
              </>
            )}
          </span>
          <span className="text-neutral-400">
            Swap usually completes in 30s
          </span>
        </div>
      )}
    </>
  );
};

export default ExchangeRateComponent;
