import Image from "next/image";
import { Button } from "@/components/ui/button";

interface TransactionReviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  currency: string;
  currencyLogo: string;
  totalValue: string;
  recipient: string;
  account: string;
  institution: string;
  network: string;
  networkLogo: string;
}

export function TransactionReviewModal({
  open,
  onClose,
  onConfirm,
  amount,
  currency,
  currencyLogo,
  totalValue,
  recipient,
  account,
  institution,
  network,
  networkLogo
}: TransactionReviewModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="bg-[#181818] rounded-2xl max-w-md w-[90%] shadow-xl p-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white">Review transaction</h1>
          <p className="text-neutral-400 mb-4">Verify transaction details before you send</p>
          
          <div className="space-y-5">
            {/* Amount */}
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 text-lg">Amount</span>
              <div className="flex items-center gap-2">
                <Image src={currencyLogo} alt={currency} width={24} height={24} className="rounded-full" />
                <span className="text-white text-lg font-medium">{amount} {currency}</span>
              </div>
            </div>
            
            {/* Total value */}
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 text-lg">Total value</span>
              <span className="text-white text-lg font-medium">{totalValue}</span>
            </div>
            
            {/* Recipient */}
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 text-lg">Recipient</span>
              <span className="text-white text-lg font-medium">{recipient}</span>
            </div>
            
            {/* Account */}
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 text-lg">Account</span>
              <div className="text-white text-lg font-medium flex items-center">
                <span>{account}</span>
                <span className="text-neutral-400 mx-2">•</span>
                <span>{institution}</span>
              </div>
            </div>
            
            {/* Network */}
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 text-lg">Network</span>
              <div className="flex items-center gap-2">
                <Image src={networkLogo} alt={network} width={24} height={24} className="rounded-full" />
                <span className="text-white text-lg font-medium">{network}</span>
              </div>
            </div>
          </div>
          
          {/* Warning */}
          <div className="bg-[#232323] p-4 rounded-lg mt-4 mb-4 flex items-start gap-3">
            <div className="mt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="2" />
                <path d="M12 7v6" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="#666" />
              </svg>
            </div>
            <p className="text-neutral-400 text-sm">
              Ensure the details above are correct. Failed transaction due to wrong details may attract a refund fee
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              className="flex-1 bg-[#333] hover:bg-[#444] border-none text-white py-4 text-lg rounded-xl"
              onClick={onClose}
            >
              Back
            </Button>
            
            <Button
              className="flex-1 bg-[#7B68EE] hover:bg-[#6A5ACD] text-white py-4 text-lg rounded-xl"
              onClick={onConfirm}
            >
              Confirm payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 