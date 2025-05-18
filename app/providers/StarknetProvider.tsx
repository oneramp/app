"use client";
import React, { useMemo } from "react";
import {
  mainnet as starknetMainnet,
  sepolia as starknetTestnet,
} from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  voyager,

} from "@starknet-react/core";

import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";
import { Connector } from "@starknet-react/core";
import { ArgentMobileConnector } from "starknetkit/argentMobile";

export default function StarknetProvider({ children }: { children: React.ReactNode }) {
  const connectors = useMemo(() => {
    if (typeof window === "undefined") return []; // SSR-safe

    return [
      new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
      new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
      ArgentMobileConnector.init({
        options: {
          dappName: "oneramp",
          projectId: "5175fef48e45eaa35b29009c6a3b8f77",
          // chainId: "mainnet" as "mainnet" | "testnet", // mainnet
          url: window.location.hostname, // ✅ safe now
          icons: ["https://your-icon-url.com"],
          rpcUrl: "https://starknet-mainnet.infura.io/v3/aa740f142a80486b94876ef7a659e9aa",
        },
        inAppBrowserOptions: {
        },
      }) as Connector,
      new InjectedConnector({ options: { id: "keplr", name: "Keplr" } }),
      new InjectedConnector({ options: { id: "okxwallet", name: "OKX" } }),
      new WebWalletConnector({ url: "https://web.argent.xyz" }),
    ];
  }, []);

  return (
    <StarknetConfig
      chains={[starknetMainnet, starknetTestnet]}
      provider={publicProvider()}
      connectors={connectors as Connector[]}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
