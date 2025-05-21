"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useMemo } from "react";
import { CountryCurrencyModal } from "./modals/CountryCurrencyModal";
import Image from "next/image";
import { useUserSelectionStore } from "@/store/user-selection";
import { useAmountStore } from "@/store/amount-store";
import { Country } from "@/types";
import { cn } from "@/lib/utils";

const SelectCountry = () => {
  const [showCountryCurrencyModal, setShowCountryCurrencyModal] =
    useState(false);
  const { country, updateSelection } = useUserSelectionStore();
  const { amount, setIsValid, setFiatAmount } = useAmountStore();

  const calculatedAmount = useMemo(() => {
    if (!country || !amount) return null;
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return null;
    return (numericAmount * country.exchangeRate).toFixed(2);
  }, [amount, country]);

  const isAmountValid = useMemo(() => {
    if (!calculatedAmount || !country) return true;
    const numericAmount = parseFloat(calculatedAmount);
    const valid =
      (numericAmount > country.fiatMinMax.min &&
        numericAmount < country.fiatMinMax.max) ||
      numericAmount === country.fiatMinMax.min ||
      numericAmount === country.fiatMinMax.max;
    setIsValid(valid);
    setFiatAmount(calculatedAmount);
    return valid;
  }, [calculatedAmount, country, setIsValid]);

  const handleCountrySelect = (selectedCountry: Country) => {
    updateSelection({
      country: {
        ...selectedCountry,
        exchangeRate: selectedCountry.exchangeRate,
      },
      // Reset related fields when country changes
      institution: undefined,
      address: undefined,
    });
    setShowCountryCurrencyModal(false);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <span
            className={cn(
              "text-3xl font-semibold",
              isAmountValid ? "text-neutral-300" : "text-red-500"
            )}
          >
            {calculatedAmount
              ? parseFloat(calculatedAmount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </span>
        </div>

        <Button
          variant="default"
          className="flex items-center gap-2 bg-black border-none px-4 py-2 rounded-full min-w-[140px]"
          onClick={() => setShowCountryCurrencyModal(true)}
        >
          {country ? (
            <>
              <Image
                src={country.logo}
                alt={country.name}
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="text-white font-medium">{country.name}</span>
            </>
          ) : (
            <span className="text-neutral-400 font-medium">Select Country</span>
          )}
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path
              d="M7 10l5 5 5-5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      <CountryCurrencyModal
        open={showCountryCurrencyModal}
        onClose={() => setShowCountryCurrencyModal(false)}
        onSelect={handleCountrySelect}
      />
    </>
  );
};

export default SelectCountry;
