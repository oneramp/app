"use server";

import { oneRampApi, oneRampApiWithCustomHeaders } from "@/constants";
import {
  SubmitTransactionHashRequest,
  TransferBankRequest,
  TransferMomoRequest,
} from "@/types";
import { v4 as uuidv4 } from "uuid";

export const createTransferIn = async (
  payload: TransferMomoRequest | TransferBankRequest
) => {
  try {
    if (!payload.operator || !payload.quoteId) {
      return new Error("Invalid payload", { cause: payload });
    }

    const idompetancyKey = uuidv4();

    const response = await oneRampApiWithCustomHeaders({
      "Idempotency-Key": idompetancyKey,
    }).post("/transfer-in", payload);

    return response.data;
  } catch (error) {
    throw new Error("Failed to create transfer in", { cause: error });
  }
};

export const createTransferOut = async (
  payload: TransferMomoRequest | TransferBankRequest
) => {
  try {
    if (!payload.operator || !payload.quoteId) {
      return new Error("Invalid payload", { cause: payload });
    }

    const idompetancyKey = uuidv4();

    const response = await oneRampApiWithCustomHeaders({
      "Idempotency-Key": idompetancyKey,
    }).post("/transfer-out", payload);

    return response.data;
  } catch (error) {
    throw new Error("Failed to create transfer out", { cause: error });
  }
};

export const getTransferStatus = async (transferId: string) => {
  try {
    if (!transferId) {
      throw new Error("Transfer ID is required");
    }

    const response = await oneRampApi.get(`/transfer/${transferId}`);

    return response.data;
  } catch (error) {
    throw new Error("Failed to get transfer status", { cause: error });
  }
};

export const submitTransactionHash = async (
  payload: SubmitTransactionHashRequest
) => {
  try {
    if (!payload.transferId || !payload.txHash) {
      throw new Error("Invalid payload", { cause: payload });
    }

    const response = await oneRampApi.post(`/tx`, payload);

    return response.data;
  } catch (error) {
    throw new Error("Failed to submit transaction hash", { cause: error });
  }
};
