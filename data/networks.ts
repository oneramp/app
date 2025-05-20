import { Network } from "@/types";
import { mainnet, polygon, celo, base } from "@reown/appkit/networks";
import { mainnet as starknet } from "@starknet-react/chains";

// Add Starknet network configuration
// const starknet = {
//   id: "SN_MAIN",
//   name: "Starknet",
//   network: "starknet",
//   rpcUrls: {
//     default: { http: ["https://starknet-mainnet.public.blastapi.io"] },
//     public: { http: ["https://starknet-mainnet.public.blastapi.io"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "Starkscan",
//       url: "https://voyager.online",
//     },
//   },
//   testnet: false,
// } as const;

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
    id: starknet.id.toString(),
    chainId: Number(starknet.id),
    chainNamespace: "eip155" as const,
    caipNetworkId: `eip155:${starknet.id}` as const,
    logo: "/logos/starknet.png",
    type: "starknet",
    nativeCurrency: {
      name: "Starknet",
      symbol: "STRK",
      decimals: 18,
    },
  },
];
