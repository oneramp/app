"use client";

import { useUserSelectionStore } from "@/store/user-selection";
import { OrderStep } from "@/types";
import OrderProcessing from "../components/cards/order-processing";
import OrderSuccessful from "../components/cards/order-successful";
import { TransactionReviewModal } from "../components/modals/TransactionReviewModal";

const StateContextProvider = () => {
  const { orderStep } = useUserSelectionStore();

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
