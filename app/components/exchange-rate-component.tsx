import React from "react";
import { useUserSelectionStore } from "@/store/user-selection";

const ExchangeRateComponent = () => {
  const { country, asset } = useUserSelectionStore();

  return (
    <>
      {country && (
        <div className="mx-10 mb-4 flex justify-between text-sm">
          <span className="text-neutral-400">
            1 {asset?.symbol} ~ {country.exchangeRate} {country.currency}
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
