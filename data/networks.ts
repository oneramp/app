import { Network } from "@/types";
import { mainnet, polygon, celo, base } from "@reown/appkit/networks";

export const SUPPORTED_NETWORKS = [mainnet, polygon, celo, base];
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
];
