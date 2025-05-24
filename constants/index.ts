import axios from "axios";

export const ONERAMP_API_URL = "http://localhost:4000";
export const KYC_REDIRECT_URL = "http://localhost:3000";
export const MOCK_TRANSACTIONS = false;

export const oneRampApi = axios.create({
  baseURL: ONERAMP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ONERAMP_API_KEY}`,
  },
});

// Create a oneRampApi with a custom headers passed in
export const oneRampApiWithCustomHeaders = (
  headers: Record<string, string>
) => {
  return axios.create({
    baseURL: ONERAMP_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ONERAMP_API_KEY}`,
      ...headers,
    },
  });
};
