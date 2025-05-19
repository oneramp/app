import Image from "next/image";
import { Network } from "@/types";

export function NetworkSelectModal({
  open,
  onClose,
  networks,
  selectedNetwork,
  onSelect,
  canSwitch,
}: {
  open: boolean;
  onClose: () => void;
  networks: Network[];
  selectedNetwork: Network;
  onSelect: (network: Network) => void;
  canSwitch?: (network: Network) => boolean;
}) {
  if (!open) return null;
  return (
    <div className="min-h-screen fixed inset-0 z-40 flex items-center justify-center backdrop-blur-xs">
      <div className="bg-[#232323] rounded-2xl p-6 min-w-[300px] shadow-2xl relative">
        <button
          className="absolute top-2 right-2 text-neutral-400 hover:text-white"
          onClick={onClose}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="text-lg text-white font-semibold mb-4">
          Select Network
        </div>
        <div className="flex flex-col gap-2">
          {networks.map((n) => {
            const isSelected = selectedNetwork.name === n.name;
            const hasRequiredWallet = !canSwitch || canSwitch(n);
            return (
              <button
                key={n.name}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors ${
                  isSelected ? "bg-[#353535]" : "hover:bg-[#353535]"
                }`}
                onClick={() => onSelect(n)}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={n.logo}
                    alt={n.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-white font-medium text-lg">
                    {n.name}
                  </span>
                </div>
                {!hasRequiredWallet && (
                  <span
                    className={`text-xs ${
                      isSelected ? "text-amber-400" : "text-gray-400"
                    }`}
                  >
                    Requires {n.type === "starknet" ? "Starknet" : "EVM"} wallet
                  </span>
                )}
                {hasRequiredWallet && isSelected && (
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="#bcbcff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
