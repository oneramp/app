import { Country } from "@/types";
import Image from "next/image";
import { countries } from "@/data/countries";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUserSelectionStore } from "@/store/user-selection";

interface CountryCurrencyModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
}

export function CountryCurrencyModal({
  open,
  onClose,
  onSelect,
}: CountryCurrencyModalProps) {
  const { country } = useUserSelectionStore();

  const selectedCurrency = country;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#181818] border-[#232323] text-white p-0 gap-0">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Select Country</h2>
          <div className="flex flex-col gap-2">
            {countries.map((country) => (
              <button
                key={country.name}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors ${
                  selectedCurrency?.name === country.name
                    ? "bg-[#353545]"
                    : "hover:bg-[#23232f]"
                }`}
                onClick={() => onSelect(country)}
              >
                <span className="flex items-center gap-3">
                  <Image
                    src={country.logo}
                    alt={country.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-white font-medium text-lg">
                    {country.name}
                  </span>
                </span>
                {selectedCurrency?.name === country.name && (
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
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
