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
}
