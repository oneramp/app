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
  payload: SubmitTransactionHashRequest
) => {
  try {
    console.log("====================================");
    console.log("payload", payload);
    console.log("====================================");

    if (!payload.transferId || !payload.txHash) {
      return {
        success: false,
        message: "Missing required fields: transferId or txHash",
      };
    }

    const response = await oneRampApi.post(`/tx`, payload);

    console.log("====================================");
    console.log("response", response);
    console.log("====================================");

    // Return a simplified success response
    return {
      success: true,
      data: response.data ? response.data : null,
    };
  } catch (error) {
    // Handle Axios error
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
    }>;

    // Return a simplified error response
    return {
      success: false,
      status: axiosError.response?.status || 500,
      message:
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Failed to submit transaction hash",
    };
  }
};
