import { Network } from "@/types";
import { mainnet, polygon, celo, base } from "@reown/appkit/networks";

// Add Starknet network configuration
const starknet = {
  id: "SN_MAIN",
  name: "Starknet",
  network: "starknet",
  rpcUrls: {
    default: { http: ["https://starknet-mainnet.public.blastapi.io"] },
    public: { http: ["https://starknet-mainnet.public.blastapi.io"] },
  },
  blockExplorers: {
    default: {
      name: "Starkscan",
      url: "https://starkscan.co",
    },
  },
  testnet: false,
} as const;

export const SUPPORTED_NETWORKS = [mainnet, polygon, celo, base, starknet];
export const SUPPORTED_NETWORK_NAMES = SUPPORTED_NETWORKS.map(
  (network) => network.name
);

export const SUPPORTED_NETWORKS_WITH_RPC_URLS: Network[] = [
  {
    ...base,
    id: base.id,
    chainId: Number(base.id),
    chainNamespace: "eip155" as const,
    caipNetworkId: `eip155:${base.id}` as const,
    logo: "/logos/base.png",
    type: "evm",
  },
  {
    ...mainnet,
    id: mainnet.id,
    chainId: Number(mainnet.id),
    chainNamespace: "eip155" as const,
    caipNetworkId: `eip155:${mainnet.id}` as const,
    logo: "/logos/ethereum.png",
    type: "evm",
  },
  {
    ...polygon,
    id: polygon.id,
    chainId: Number(polygon.id),
    chainNamespace: "eip155" as const,
    caipNetworkId: `eip155:${polygon.id}` as const,
    logo: "/logos/polygon.png",
    type: "evm",
  },
  {
    ...celo,
    id: celo.id,
    chainId: Number(celo.id),
    chainNamespace: "eip155" as const,
    caipNetworkId: `eip155:${celo.id}` as const,
    logo: "/logos/celo-logo.png",
    type: "evm",
  },
  {
    ...starknet,
    id: starknet.id,
    chainId: 0x534e5f4d41494e, // Starknet mainnet chain ID in hex
    chainNamespace: "eip155" as const,
    caipNetworkId: `eip155:${0x534e5f4d41494e}` as const,
    logo: "/logos/starknet.png",
    type: "starknet",
    nativeCurrency: {
      name: "Starknet",
      symbol: "STRK",
      decimals: 18,
    },
  },
];
