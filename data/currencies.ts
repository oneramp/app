import { Asset } from "@/types";
import { base, celo, mainnet, polygon } from "@reown/appkit/networks";

export const currencies = [
  { symbol: "USDC", logo: "/logos/USDC.svg" },
  { symbol: "USDT", logo: "/logos/USDT.svg" },
];

export const assets: Asset[] = [
  {
    name: "USDC",
    logo: "/logos/USDC.svg",
    symbol: "USDC",
    networks: {
      Ethereum: {
        ...mainnet,
        logo: "/logos/ethereum.png",
        type: "evm",
        chainId: 1,
        chainNamespace: "eip155",
        caipNetworkId: "eip155:1",
        tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      Polygon: {
        ...polygon,
        logo: "/logos/polygon.png",
        type: "evm",
        chainId: 137,
        chainNamespace: "eip155",
        caipNetworkId: "eip155:137",
        tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      },
      Celo: {
        ...celo,
        logo: "/logos/celo-logo.png",
        type: "evm",
        chainId: 42220,
        chainNamespace: "eip155",
        caipNetworkId: "eip155:42220",
        tokenAddress: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
      },
      Base: {
        ...base,
        logo: "/logos/base.png",
        type: "evm",
        chainId: 8453,
        chainNamespace: "eip155",
        caipNetworkId: "eip155:8453",
        tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      },
      //   .... more networks
    },
  },

  {
    name: "USDT",
    logo: "/logos/USDT.svg",
    symbol: "USDT",
    networks: {
      Ethereum: {
        ...mainnet,
        logo: "/logos/ethereum.png",
        type: "evm",
        chainId: 1,
        chainNamespace: "eip155",
        caipNetworkId: "eip155:1",
        tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      Polygon: {
        ...polygon,
        logo: "/logos/polygon.png",
        type: "evm",
        chainId: 137,
        chainNamespace: "eip155",
        caipNetworkId: "eip155:137",
        tokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      },
      Celo: {
        ...celo,
        logo: "/logos/celo-logo.png",
        type: "evm",
        chainId: 42220,
        chainNamespace: "eip155",
        caipNetworkId: "eip155:42220",
        tokenAddress: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
      },
      Base: {
        ...base,
        logo: "/logos/base.png",
        type: "evm",
        chainId: 8453,
        chainNamespace: "eip155",
        caipNetworkId: "eip155:8453",
        tokenAddress: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      },
      //   .... more networks
    },
  },
];
