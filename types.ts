import { Chain } from "viem";
import { SUPPORTED_NETWORK_NAMES } from "./data/networks";

export interface Network extends Omit<Chain, "id"> {
  name: string;
  logo: string;
  type: string;
  chainId: number;
  tokenAddress?: string;
  id: string | number;
  chainNamespace: "eip155" | "solana" | "bip122" | "polkadot" | "cosmos";
  caipNetworkId:
    | `eip155:${string}`
    | `eip155:${number}`
    | `solana:${string}`
    | `solana:${number}`
    | `bip122:${string}`
    | `bip122:${number}`
    | `polkadot:${string}`
    | `polkadot:${number}`
    | `cosmos:${string}`
    | `cosmos:${number}`;
}

export enum TransferType {
  TransferIn = "TransferIn",
  TransferOut = "TransferOut",
}

export interface Asset {
  name: string;
  logo: string;
  symbol: string;
  networks: {
    [key in (typeof SUPPORTED_NETWORK_NAMES)[number]]: Network;
  };
}

export interface Institution {
  name: string;
}

export interface Country {
  name: string;
  logo: string;
  currency: string;
  countryCode: string;
  phoneCode: string;
  exchangeRate: number;
  institutions: Institution[];
}

export interface UserSelectionGlobalState {
  network?: Network;
  country?: Country;
  asset?: Asset;
  cryptoAmount?: number;
  fiatAmount?: number;
  address?: string;
  paymentMethod: "bank" | "momo";
  institution?: string;
  accountNumber?: string;
}

// {
//   "quote": {
//     "fiatType": "ZAR",
//     "cryptoType": "USDC",
//     "fiatAmount": "112.68",
//     "cryptoAmount": "5.64",
//     "country": "ZA",
//     "amountPaid": "6",
//     "address": "0x240ef8C7Ae6eB6C1A80Da77F5586EeE76d50C589",
//     "fee": "0.36",
//     "guaranteedUntil": "2025-05-14T17:41:01.381Z",
//     "transferType": "TransferIn",
//     "quoteId": "f6204b44-6089-4f82-8ded-dedb19e278d2",
//     "network": "celo",
//     "used": false,
//     "requestType": "fiat",
//     "id": "6824d5ada642d48ade8eb3d2"
//   },
// }

export interface Quote {
  fiatType: string;
  cryptoType: string;
  fiatAmount: string;
  cryptoAmount: string;
  country: string;
  amountPaid: string;
  address: string;
  fee: string;
  guaranteedUntil: string;
  transferType: TransferType;
  quoteId: string;
  network: string;
  used: boolean;
  requestType: string;
  id: string;
}
