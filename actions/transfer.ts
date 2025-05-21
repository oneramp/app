"use server";

import { transferInResponse, transferStatusResponse } from "@/dummy";
import { TransferStatusEnum } from "@/types";
import delay from "delay";

const DELAY_TIME = Number(process.env.DELAY_TIME!) || 4000;

// Counter to track number of calls
let globalCallTime = 0;
let transferStatus = TransferStatusEnum.TransferStarted;

export const createTransferIn = async () => {
  try {
    await delay(DELAY_TIME);
    return transferInResponse;
  } catch (error) {
    throw new Error("Failed to create transfer in", { cause: error });
  }
};

export const createTransferOut = async () => {
  try {
    await delay(DELAY_TIME);
    return {
      status: "success",
    };
  } catch (error) {
    throw new Error("Failed to create transfer out", { cause: error });
  }
};

export const getTransferStatus = async (transferId: string) => {
  try {
    if (!transferId) {
      throw new Error("Transfer ID is required");
    }

    await delay(3000);

    globalCallTime += 1;

    if (globalCallTime === 1) {
      transferStatus = TransferStatusEnum.TransferStarted;
    } else if (globalCallTime === 5) {
      transferStatus = TransferStatusEnum.TransferCompleted;
    } else if (globalCallTime === 10) {
      transferStatus = TransferStatusEnum.TransferFailed;
    }

    return {
      ...transferStatusResponse,
      status: transferStatus,
    };
  } catch (error) {
    throw new Error("Failed to get transfer status", { cause: error });
  }
};
