import axios from "axios";

export const ONERAMP_API_URL = "http://localhost:4000";

export const oneRampApi = axios.create({
  baseURL: ONERAMP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ONERAMP_API_KEY}`,
  },
});
