"use client";

import { useKYCStore } from "@/store/kyc-store";
import { useUserSelectionStore } from "@/store/user-selection";
import { Check, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { KYCVerificationModal } from "./modals/KYCVerificationModal";
import useWalletGetInfo from "@/hooks/useWalletGetInfo";

export const FetchingAccountDetails = () => {
  return (
    <div className="flex items-center justify-between gap-2 text-neutral-600 text-sm">
      <Loader className="size-4 animate-spin" />
      <p>Verifying account name...</p>
    </div>
  );
};

const AccountDetails = () => {
  const { paymentMethod } = useUserSelectionStore();
  const { address } = useWalletGetInfo();
  //   const [isLoading, setIsLoading] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);

  const { setIsCheckingKyc, kycData, isCheckingKyc } = useKYCStore();

  // Automatically show KYC modal when status is not verified
  useEffect(() => {
    if (kycData && kycData.kycStatus !== "VERIFIED" && address) {
      setTimeout(() => {
        // setIsLoading(false);
        setShowKYCModal(true);
      }, 3000);
    }
  }, [kycData, isCheckingKyc]);

  //   if (isLoading) {
  //     return <FetchingAccountDetails />;
  //   }

  //   if (kycError) {
  //     return (
  //       <div className="text-red-500 text-xs">Error fetching account details</div>
  //     );
  //   }

  return (
    <div className="mb-2 flex flex-col gap-4">
      <KYCVerificationModal
        open={showKYCModal}
        onClose={() => {
          setShowKYCModal(false);
          setIsCheckingKyc(false);
        }}
        kycLink={kycData?.message?.link || null}
      />
      <div className="flex items-center justify-between">
        {kycData && kycData.kycStatus === "VERIFIED" && (
          <>
            <div className="flex p-1 text-white border-2 bg-neutral-900 border-[#bcbcff] rounded-lg px-4 text-sm font-medium border-gradient-to-r from-purple-500/20 to-indigo-500/20">
              {paymentMethod === "momo" ? (
                <h3>OK</h3>
              ) : (
                <h3>Catherine Jones</h3>
              )}
            </div>
            <Check className="size-6 text-green-500" />
          </>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
