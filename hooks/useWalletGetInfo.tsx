import {
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
} from "@reown/appkit/react";
import { useClientMounted } from "./useClientMounted";

const useWalletInfo = () => {
  const kitTheme = useAppKitTheme();
  const state = useAppKitState();
  const { address, caipAddress, isConnected, embeddedWalletInfo } =
    useAppKitAccount();
  const events = useAppKitEvents();
  const mounted = useClientMounted();
  const { chainId, caipNetworkId, caipNetwork } = useAppKitNetwork();
  return {
    kitTheme,
    state,
    address,
    caipAddress,
    isConnected,
    embeddedWalletInfo,
    events,
    mounted,
    chainId,
    caipNetworkId,
    caipNetwork,
  };
};

export default useWalletInfo;
