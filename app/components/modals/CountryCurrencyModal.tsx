import { Country } from "@/types";
import Image from "next/image";
import { countries } from "@/data/countries";
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

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-center">
        <div className={`
          bg-[#181818] border-[#232323] text-white shadow-2xl
          w-full h-[60vh] rounded-t-2xl p-6 max-h-[80vh]
          md:max-w-md md:w-full md:h-auto md:rounded-2xl
          transform transition-all duration-300 ease-out
          ${open ? 'translate-y-0' : 'translate-y-full'}
          md:transform-none
        `}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Select Country</h2>
            <button
              className="text-neutral-400 hover:text-white"
              onClick={onClose}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(60vh-120px)] md:max-h-[60vh]">
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
      </div>
    </>
  );
}
