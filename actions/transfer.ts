"use server";

import { oneRampApi, oneRampApiWithCustomHeaders } from "@/constants";
import {
  SubmitTransactionHashRequest,
  TransferBankRequest,
  TransferMomoRequest,
} from "@/types";
import { v4 as uuidv4 } from "uuid";
import { AxiosError } from "axios";

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
  payload: SubmitTransactionHashRequest,
  maxRetries: number = 3
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!payload.transferId || !payload.txHash) {
        return {
          success: false,
          message: "Missing required fields: transferId or txHash",
        };
      }

      const response = await oneRampApi.post(`/tx`, payload);

      return {
        success: true,
        data: response.data || null,
      };
    } catch (error) {
      // const axiosError = error as AxiosError;

      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;

      // If it's a 500 error and we have retries left, continue
      if (axiosError.response?.status === 500 && attempt < maxRetries) {
        console.log(`Attempt ${attempt} failed with 500, retrying...`);
        // Optional: add delay between retries
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      // Last attempt or non-500 error
      return {
        success: false,
        status: axiosError.response?.status || 500,
        message:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "Failed to submit transaction hash",
        // Add more context for debugging
        details: process.env.NODE_ENV === "development" ? error : undefined,
      };
    }
  }
};
