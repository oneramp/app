import { mockOnChainTransaction } from "@/actions/mocker";
import { MOCK_TRANSACTIONS } from "@/constants";
import { useState } from "react";
import { erc20Abi, TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

// Starknet imports

export type TransactionPayload = {
  recipient: string;
  amount: bigint | string | number;
  tokenAddress: string;
};

export const TOKEN_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
];

const useEVMPay = () => {
  const [mockLoading, setMockLoading] = useState(false);
  const [mockSuccess, setMockSuccess] = useState(false);
  const [mockTransactionReceipt, setMockTransactionReceipt] =
    useState<TransactionReceipt | null>(null);

  const { writeContract, data: hash } = useWriteContract();
  const {
    isLoading,
    isSuccess,
    data: transactionReceipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const payWithEVM = async (transactionPayload: TransactionPayload) => {
    const { recipient, amount, tokenAddress } = transactionPayload;

    await writeContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "transfer",
      args: [recipient as `0x${string}`, amount as bigint],
    });
  };

  const mockPayWithEVM = async (transactionPayload: TransactionPayload) => {
    setMockLoading(true);
    const transactionReceipt = await mockOnChainTransaction(transactionPayload);
    setMockSuccess(true);
    setMockTransactionReceipt(
      transactionReceipt as unknown as TransactionReceipt
    );
    setMockLoading(false);
    return transactionReceipt;
  };

  return {
    payWithEVM: MOCK_TRANSACTIONS ? mockPayWithEVM : payWithEVM,
    isLoading: MOCK_TRANSACTIONS ? mockLoading : isLoading,
    isSuccess: MOCK_TRANSACTIONS ? mockSuccess : isSuccess,
    transactionReceipt: MOCK_TRANSACTIONS
      ? mockTransactionReceipt
      : transactionReceipt,
  };
};

export default useEVMPay;
