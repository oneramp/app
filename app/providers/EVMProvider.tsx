"use client";

import { wagmiAdapter, projectId, networks, config } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";

// Set up queryClient
const queryClient = new QueryClient();

const COIN_BASE_SMART_ID =
  "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa";

// Set up metadata
const metadata = {
  name: "OneRamp",
  description:
    "Swap and sell stablecoins using mobile money and bank transfers",
  url: "https://beta.oneramp.io", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  coinbasePreference: "smartWalletOnly",
  featuredWalletIds: [COIN_BASE_SMART_ID],
  features: {
    email: false,
    socials: false,
    analytics: true, // Keep analytics if desired
    onramp: false, // Keep onramp if desired
    swaps: false, // Keep swaps if desired
    connectMethodsOrder: ["wallet"],
    connectorTypeOrder: ["featured", "recent", "walletConnect"],
  },
  allWallets: "HIDE",
  themeVariables: {
    "--w3m-accent": "#000000",
  },
});

function EVMProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as unknown as Parameters<
      typeof cookieToInitialState
    >[0],
    cookies
  );

  return (
    <WagmiProvider
      config={
        config as unknown as Parameters<typeof WagmiProvider>[0]["config"]
      }
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default EVMProvider;
