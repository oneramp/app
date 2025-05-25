"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useMemo, useEffect } from "react";
import { CountryCurrencyModal } from "./modals/CountryCurrencyModal";
import Image from "next/image";
import { useUserSelectionStore } from "@/store/user-selection";
import { useAmountStore } from "@/store/amount-store";
import { useExchangeRateStore } from "@/store/exchange-rate-store";
import { AppState, Country } from "@/types";
import { cn } from "@/lib/utils";
import { getCountryExchangeRate } from "@/actions/rates";

const SelectCountry = () => {
  const [showCountryCurrencyModal, setShowCountryCurrencyModal] =
    useState(false);
  const { country, updateSelection, paymentMethod, setAppState } =
    useUserSelectionStore();
  const { amount, setIsValid, setFiatAmount } = useAmountStore();
  const { exchangeRate, isLoading, setExchangeRate, setIsLoading, setError } =
    useExchangeRateStore();

  // Fetch exchange rate when country or payment method changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (!country?.countryCode) return;

      try {
        setAppState(AppState.Processing);
        setIsLoading(true);
        const response = await getCountryExchangeRate({
          country: country.countryCode,
          orderType: "selling",
          providerType: paymentMethod,
        });

        setExchangeRate(response);
        setError(null);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch exchange rate"
        );
        setExchangeRate(null);
      } finally {
        setAppState(AppState.Idle);
        setIsLoading(false);
      }
    };

    fetchExchangeRate();
  }, [
    country?.countryCode,
    paymentMethod,
    setExchangeRate,
    setIsLoading,
    setError,
  ]);

  const calculatedAmount = useMemo(() => {
    if (!country || !amount || !exchangeRate) return null;
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return null;

    // Use the exchange rate from the API response
    const rate = exchangeRate.exchange;

    const convertedAmount = numericAmount * rate;

    // Include fees from conversionResponse if available
    // THIS IS THE FEE CALCULATION FUNCTIONALITY

    // if (exchangeRate.conversionResponse) {
    //   const { chargeFeeInFiat, gasFeeInFiat } = exchangeRate.conversionResponse;
    //   const totalFees = (chargeFeeInFiat || 0) + (gasFeeInFiat || 0);
    //   return (convertedAmount + totalFees).toFixed(2);
    // }

    return convertedAmount.toFixed(2);
  }, [amount, country, exchangeRate]);

  const isAmountValid = useMemo(() => {
    if (!calculatedAmount || !country) return true;
    const numericAmount = parseFloat(calculatedAmount);
    const valid =
      (numericAmount > country.fiatMinMax.min &&
        numericAmount < country.fiatMinMax.max) ||
      numericAmount === country.fiatMinMax.min ||
      numericAmount === country.fiatMinMax.max;
    setIsValid(valid);
    // setFiatAmount(calculatedAmount);
    return valid;
  }, [calculatedAmount, country, setIsValid, setFiatAmount]);

  const handleCountrySelect = (selectedCountry: Country) => {
    const rate = exchangeRate?.exchange ?? selectedCountry.exchangeRate;

    updateSelection({
      country: {
        ...selectedCountry,
        exchangeRate: rate,
      },
      // Reset related fields when country changes
      institution: undefined,
      address: undefined,
      accountNumber: undefined,
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
              "text-neutral-300",
              isAmountValid ? "" : ""
            )}
          >
            {isLoading
              ? ""
              : calculatedAmount
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
