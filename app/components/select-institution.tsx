"use client";

import { Input } from "@/components/ui/input";
import { useUserSelectionStore } from "@/store/user-selection";
import React, { useState } from "react";
import { InstitutionModal } from "./modals/InstitutionModal";
import { Button } from "@/components/ui/button";

const SelectInstitution = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const { institution, country, updateSelection } = useUserSelectionStore();

  const handleInstitutionSelect = (inst: string) => {
    updateSelection({ institution: inst });
    setShowInstitutionModal(false);
  };

  return (
    <>
      <div className="mx-4 mb-2 bg-[#232323] rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-white text-lg font-medium">Recipient</span>
        </div>

        <div className="flex gap-3 items-center h-14   ">
          {/* Institution Selector */}
          <Button
            variant="default"
            onClick={() => setShowInstitutionModal(true)}
            className="bg-transparent  border w-1/3 h-full border-[#444] text-neutral-400 rounded-full p-3 cursor-pointer flex items-center justify-center"
          >
            <span className=" line-clamp-1">
              {institution || "Select institution"}
            </span>
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

          {/* Account Number */}
          <div className="flex-1 h-full">
            <Input
              type="text"
              placeholder="Account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="bg-transparent border border-[#444] text-lg text-white font-medium rounded-full h-full pl-6 w-full focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>
      </div>
      {country && (
        <InstitutionModal
          open={showInstitutionModal}
          onClose={() => setShowInstitutionModal(false)}
          institutions={country.institutions}
          selectedInstitution={institution || null}
          onSelect={handleInstitutionSelect}
          country={country.name}
        />
      )}
    </>
  );
};

export default SelectInstitution;
