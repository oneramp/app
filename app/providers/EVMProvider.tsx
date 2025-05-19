"use client";

import { wagmiAdapter, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, celo, base, polygon } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "oneramp",
  description: "sell and buy crypto",
  url: "https://oneramp.io",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create the modal with proper network configuration
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId,
  networks: [mainnet, base, polygon, celo],
  defaultNetwork: mainnet, // Set a default network
  metadata: metadata,
  features: {
    analytics: true, // Enable analytics for better tracking
  },
  enableNetworkSwitch: true, // Explicitly enable network switching
});

function EVMProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default EVMProvider;
