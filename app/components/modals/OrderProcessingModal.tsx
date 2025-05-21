import React from "react";
// import { useQuoteStore } from "@/store/quote-store";
import OrderProcessing from "../cards/order-processing";
import OrderSuccessful from "../cards/order-successful";
import { useUserSelectionStore } from "@/store/user-selection";
import { OrderStep } from "@/types";

const OrderProcessingModal = () => {
  //   const { quote } = useQuoteStore();
  const { orderStep } = useUserSelectionStore();

  //   if (orderStep !== OrderStep.GotTransfer) return null;

  //   if (orderStep === OrderStep.ProcessingPayment) return <OrderProcessing />;

  if (orderStep === OrderStep.PaymentCompleted) return <OrderSuccessful />;

  return <OrderProcessing />;
};

export default OrderProcessingModal;
