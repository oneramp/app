"use client";

import { useUserSelectionStore } from "@/store/user-selection";
import { OrderStep } from "@/types";
import OrderProcessing from "../components/cards/order-processing";
import OrderSuccessful from "../components/cards/order-successful";
import { TransactionReviewModal } from "../components/modals/TransactionReviewModal";
import { useQuery } from "@tanstack/react-query";
import useWalletGetInfo from "@/hooks/useWalletGetInfo";
import { getKYC } from "@/actions/kyc";
import { useEffect } from "react";
import { useKYCStore } from "@/store/kyc-store";

const StateContextProvider = () => {
  const { orderStep } = useUserSelectionStore();

  const { address } = useWalletGetInfo();
  const { setKycData } = useKYCStore();

  const getKYCQuery = useQuery({
    queryKey: ["kyc"],
    queryFn: async () => await getKYC(address as string),
    enabled: !!address,
    // refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (getKYCQuery.data) {
      setKycData(getKYCQuery.data);
    }
  }, [getKYCQuery.data]);

  if (orderStep === OrderStep.Initial) {
    return null;
  }

  if (orderStep === OrderStep.GotQuote) {
    return <TransactionReviewModal />;
  }

  if (orderStep === OrderStep.GotTransfer) {
    return <OrderProcessing />;
  }

  if (orderStep === OrderStep.PaymentCompleted) {
    return <OrderSuccessful />;
  }

  return null;
};

export default StateContextProvider;
