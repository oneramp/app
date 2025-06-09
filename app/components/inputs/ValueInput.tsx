import { Input } from "@/components/ui/input";
import { GLOBAL_MIN_MAX } from "@/data/countries";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAmountStore } from "@/store/amount-store";

const ValueInput = () => {
  const { amount, setAmount } = useAmountStore();
  const [isInvalid, setIsInvalid] = useState(false);

  const formatNumber = (num: string) => {
    // Remove any non-digit characters except decimal point and first decimal only
    let cleanNum = num.replace(/[^\d.]/g, "");

    // Ensure only one decimal point
    const decimalCount = (cleanNum.match(/\./g) || []).length;
    if (decimalCount > 1) {
      cleanNum = cleanNum.replace(/\./g, (match, index) =>
        index === cleanNum.indexOf(".") ? match : ""
      );
    }

    // If number has decimal point, return as is (with max 2 decimal places)
    if (cleanNum.includes(".")) {
      const [integerPart, decimalPart] = cleanNum.split(".");
      return `${integerPart}.${decimalPart.slice(0, 2)}`;
    }

    // For whole numbers, add commas
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const validateAmount = (amount: string) => {
    const numericValue = parseFloat(amount);
    return (
      !isNaN(numericValue) &&
      numericValue >= GLOBAL_MIN_MAX.min &&
      numericValue <= GLOBAL_MIN_MAX.max &&
      // Check if decimal places are valid (max 2)
      (amount.includes(".") ? amount.split(".")[1].length <= 2 : true)
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");

    // Allow typing decimal point and numbers
    if (rawValue === "" || rawValue === "." || /^\d*\.?\d*$/.test(rawValue)) {
      setAmount(rawValue);
      setIsInvalid(!validateAmount(rawValue));
    }
  };

  // Calculate dynamic font size based on amount length
  const getFontSize = () => {
    if (amount.length > 12) return "text-[1.25rem] md:text-[1.5rem]";
    if (amount.length > 9) return "text-[1.5rem] md:text-[1.75rem]";
    return "text-[2rem] md:text-[2.5rem]";
  };

  const getWidth = () => {
    if (amount.length > 3) return "w-2/3";
    if (amount.length > 6) return "w-full";
    return "w-full";
  };

  return (
    <div
      className={cn("relative flex items-center justify-end", getWidth())}
    >
      <div className="w-full relative">
        <Input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={formatNumber(amount)}
          onChange={handleChange}
          className={cn(
            "w-full text-right pr-2 !leading-tight py-4 font-semibold outline-none bg-transparent border-none focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:border-transparent focus:outline-none",
            isInvalid ? "text-red-500" : "text-white",
            getFontSize(),
            "transition-all duration-200"
          )}
        />
      </div>
    </div>
  );
};

export default ValueInput;
