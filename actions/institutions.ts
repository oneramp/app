"use server";

import { oneRampApi } from "@/constants";

export async function getInstitutions(country: string, method = "buy") {
  try {
    if (!country) {
      throw new Error("Country is required");
    }

    const response = await oneRampApi.get(`/institutions/${country}/${method}`);

    return response.data;
  } catch (error) {
    throw new Error("Failed to get country exchange rate", { cause: error });
  }
}
