import Image from "next/image";

export function NetworkSelectModal({ open, onClose, networks, selectedNetwork, onSelect }: {
  open: boolean;
  onClose: () => void;
  networks: { name: string; logo: string }[];
  selectedNetwork: { name: string; logo: string };
  onSelect: (network: { name: string; logo: string }) => void;
}) {
  if (!open) return null;
  return (
    <div className="min-h-screen fixed inset-0 z-40 flex items-center justify-center backdrop-blur-xs">
      <div className="bg-[#232323] rounded-2xl p-6 min-w-[300px] shadow-2xl relative">
        <button className="absolute top-2 right-2 text-neutral-400 hover:text-white" onClick={onClose}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div className="text-lg text-white font-semibold mb-4">Select Network</div>
        <div className="flex flex-col gap-2">
          {networks.map((n) => (
            <button
              key={n.name}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#353535] transition-colors ${selectedNetwork.name === n.name ? "bg-[#353535]" : ""}`}
              onClick={() => onSelect(n)}
            >
              <Image src={n.logo} alt={n.name} width={32} height={32} className="rounded-full" />
              <span className="text-white font-medium text-lg">{n.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 