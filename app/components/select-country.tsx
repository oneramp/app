"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { CountryCurrencyModal } from "./modals/CountryCurrencyModal";
import Image from "next/image";
import { useUserSelectionStore } from "@/store/user-selection";
import { Country } from "@/types";

const SelectCountry = () => {
  const [showCountryCurrencyModal, setShowCountryCurrencyModal] =
    useState(false);
  const { country, updateSelection } = useUserSelectionStore();

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
        <div className="flex-1 text-right">
          <span className="text-3xl text-neutral-300 font-light">
            {country?.exchangeRate.toLocaleString()}
          </span>
        </div>
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
