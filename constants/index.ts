import axios from "axios";

// LOCAL URLS
// export const ONERAMP_API_URL = "http://localhost:4000";
// export const KYC_REDIRECT_URL = "http://localhost:3000";
export const MOCK_TRANSACTIONS = false;
export const MOCK_NIGERIAN_PHONE_NUMBER_SUCCESS = "+2341111111111";
export const MOCK_NIGERIAN_PHONE_NUMBER_FAILED = "+2340000000000";
export const MOCK_NIGERIAN_ACCOUNT_NUMBER_SUCCESS = "1111111111";
export const MOCK_NIGERIAN_ACCOUNT_NUMBER_FAILED = "0000000000";

// BETA URLS
export const ONERAMP_API_URL =
  "https://beta-api-testing-production.up.railway.app";
export const KYC_REDIRECT_URL =
  "https://signup.metamap.com/?merchantToken=671a3cf5673134001da20657&flowId=671a3cf5673134001da20656";

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
