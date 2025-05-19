import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base, celo, mainnet, polygon } from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "@wagmi/core";

// Get projectId from https://cloud.reown.com
// export const projectId = "081dd40aa3102bed7ea37f7664dda931";
export const projectId = "eb1a0fe9f3a6cdb660cda5830d45ea09";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [mainnet, polygon, celo, base];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
