// Starknet imports
import STRK_ABI from "@/utils/STRK_ABI.json";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { type Abi, type Call } from "starknet";
import { TransactionPayload } from "./useEVMPay";

const usePayStarknet = (tokenAddress: string) => {
  const { address } = useAccount();

  const { contract } = useContract({
    address: tokenAddress as `0x${string}`,
    abi: STRK_ABI as Abi,
  });

  const { send, error, status, data } = useSendTransaction({
    calls: undefined,
  });

  const payWithStarknet = async (transactionPayload: TransactionPayload) => {
    try {
      const { recipient, amount } = transactionPayload;

      if (!contract || !address) {
        throw new Error("Contract or address not initialized");
      }
      // const feltAmount = uint256.bnToUint256(amount);
      // @ts-expect-error - Converting amount to uint256 format required by Starknet
      const feltAmount = { low: BigInt(amount * 10 ** 6), high: 0n };

      const transactionCall: Call = await contract.populate("transfer", [
        recipient,
        feltAmount,
      ]);

      await send([transactionCall]);
      console.log(`Transaction for ${amount} tokens sent successfully`);
    } catch (error) {
      console.error("Starknet transaction failed:", error);
      throw error;
    }
  };

  return {
    payWithStarknet,
    error,
    status,
    data,
  };
};

export default usePayStarknet;
