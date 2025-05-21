"use server";
import delay from "delay";
import { quoteResponse } from "@/dummy";
import { QuoteRequest } from "@/types";
const DELAY_TIME = Number(process.env.DELAY_TIME!) || 4000;

export const createQuote = async (payload: QuoteRequest) => {
  try {
    console.log("====================================");
    console.log("payload", payload);
    console.log("====================================");

    // Add an artificial delay
    await delay(DELAY_TIME);

    return quoteResponse;
  } catch (error) {
    throw new Error("Failed to create quote", { cause: error });
  }
};
