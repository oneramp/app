import {
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";

// Transaction status types
type TransactionStatus = "processing" | "completed" | "failed" | "pending";

// Transaction interface
interface Transaction {
  id: string;
  type: "buy" | "sell";
  status: TransactionStatus;
  amount: string;
  currency: string;
  cryptoAmount: string;
  cryptoCurrency: string;
  network: string;
  timestamp: string;
  transactionHash?: string;
  recipientAddress: string;
  fee: string;
  estimatedTime?: string;
  progress?: number;
}

// Hardcoded transaction data
const mockTransactions: Transaction[] = [
  {
    id: "tx_001",
    type: "buy",
    status: "processing",
    amount: "50,000",
    currency: "NGN",
    cryptoAmount: "25.5",
    cryptoCurrency: "USDC",
    network: "Base",
    timestamp: "2024-01-15T10:30:00Z",
    transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
    recipientAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    fee: "1,500",
    estimatedTime: "2-5 minutes",
    progress: 65,
  },
  {
    id: "tx_002",
    type: "sell",
    status: "completed",
    amount: "75,000",
    currency: "NGN",
    cryptoAmount: "38.2",
    cryptoCurrency: "USDT",
    network: "Base",
    timestamp: "2024-01-14T15:45:00Z",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
    recipientAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    fee: "2,100",
  },
  {
    id: "tx_003",
    type: "buy",
    status: "completed",
    amount: "25,000",
    currency: "NGN",
    cryptoAmount: "12.8",
    cryptoCurrency: "USDC",
    network: "Base",
    timestamp: "2024-01-13T09:20:00Z",
    transactionHash: "0x7890abcdef1234567890abcdef1234567890abcd",
    recipientAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    fee: "800",
  },
  {
    id: "tx_004",
    type: "sell",
    status: "failed",
    amount: "100,000",
    currency: "NGN",
    cryptoAmount: "51.0",
    cryptoCurrency: "USDT",
    network: "Base",
    timestamp: "2024-01-12T14:15:00Z",
    recipientAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    fee: "2,800",
  },
  {
    id: "tx_005",
    type: "buy",
    status: "pending",
    amount: "30,000",
    currency: "NGN",
    cryptoAmount: "15.3",
    cryptoCurrency: "USDC",
    network: "Base",
    timestamp: "2024-01-15T11:00:00Z",
    recipientAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    fee: "900",
    estimatedTime: "5-10 minutes",
    progress: 25,
  },
];

const STATUS_COLORS = {
  processing: "bg-yellow-400",
  pending: "bg-yellow-400",
  completed: "bg-green-500",
  failed: "bg-red-500",
};

const TAB_OPTIONS = [
  { key: "processing", label: "Processing" },
  { key: "completed", label: "Completed" },
  { key: "failed", label: "Failed" },
];

const TransactionsModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(
    new Set()
  );
  const [activeTab, setActiveTab] = useState<
    "processing" | "completed" | "failed"
  >("processing");

  const processingTransactions = mockTransactions.filter(
    (tx) => tx.status === "processing"
  );
  const completedTransactions = mockTransactions.filter(
    (tx) => tx.status === "completed"
  );
  const failedTransactions = mockTransactions.filter(
    (tx) => tx.status === "failed"
  );

  let visibleTransactions: Transaction[] = [];
  if (activeTab === "processing") visibleTransactions = processingTransactions;
  if (activeTab === "completed") visibleTransactions = completedTransactions;
  if (activeTab === "failed") visibleTransactions = failedTransactions;

  const getStatusIcon = (status: TransactionStatus) => {
    const iconBg =
      status === "processing"
        ? STATUS_COLORS.processing
        : status === "pending"
        ? STATUS_COLORS.pending
        : status === "completed"
        ? STATUS_COLORS.completed
        : status === "failed"
        ? STATUS_COLORS.failed
        : "bg-gray-400";
    const iconColor = status === "processing" ? "text-black" : "text-white";
    let Icon = Clock;
    if (status === "completed") Icon = CheckCircle;
    if (status === "failed") Icon = XCircle;
    return (
      <span
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${iconBg} bg-opacity-90`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </span>
    );
  };

  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case "processing":
        return "Processing";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "processing":
        return "text-yellow-400";
      case "completed":
        return "text-green-400";
      case "failed":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const openExplorer = (hash: string) => {
    window.open(`https://basescan.org/tx/${hash}`, "_blank");
  };

  const TransactionCard = ({
    tx,
    isExpanded,
    onToggle,
  }: {
    tx: Transaction;
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <div className="bg-[#202124] rounded-2xl p-5 mb-5 shadow-lg transition-all duration-200 hover:shadow-xl hover:bg-[#23232f] cursor-pointer">
      {/* Top Row: Status, Chevron */}
      <div className="flex items-center justify-between" onClick={onToggle}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {getStatusIcon(tx.status)}
          <span
            className={`font-semibold ${getStatusColor(tx.status)} text-base`}
          >
            {getStatusText(tx.status)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-gray-400 hover:text-white ml-2"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Amount and Conversion Row */}
      <div className="flex items-center gap-2 mt-4 text-lg font-bold text-white">
        <span>
          {tx.amount} {tx.currency}
        </span>
        <span className="text-gray-400 font-normal text-xl">→</span>
        <span>
          {tx.cryptoAmount} {tx.cryptoCurrency}
        </span>
      </div>

      {/* Network and Date Row */}
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
        <Image
          src="/logos/base.png"
          alt={tx.network}
          width={18}
          height={18}
          className="rounded"
        />
        <span className="font-medium">{tx.network}</span>
        <span className="mx-1">•</span>
        <span>{formatDate(tx.timestamp)}</span>
      </div>

      {/* Divider for expanded details */}
      {isExpanded && <div className="my-4 border-t !border-[#2a2a2a]" />}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Amount</span>
            <span className="font-medium">
              {tx.amount} {tx.currency}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">You&apos;ll receive</span>
            <span className="font-medium">
              {tx.cryptoAmount} {tx.cryptoCurrency}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Network</span>
            <div className="flex items-center gap-2">
              <Image
                src="/logos/base.png"
                alt={tx.network}
                width={16}
                height={16}
                className="rounded"
              />
              <span className="font-medium">{tx.network}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Fee</span>
            <span className="font-medium">
              {tx.fee} {tx.currency}
            </span>
          </div>

          {/* Transaction Hash */}
          {tx.transactionHash && (
            <div className="mt-4 pt-4 border-t !border-[#2a2a2a]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Transaction Hash</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openExplorer(tx.transactionHash!)}
                  className="p-1 h-auto text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm font-mono text-gray-300 mt-1">
                {truncateHash(tx.transactionHash)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Button className="relative p-0 pr-3" onClick={() => setModalOpen(true)}>
        <Badge
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums absolute -top-1 -right-1"
          variant="destructive"
        >
          {processingTransactions.length +
            completedTransactions.length +
            failedTransactions.length}
        </Badge>
        <Bell className="size-5 text-white" />
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="fixed border-none inset-0 z-50 w-screen h-screen max-w-none max-h-none p-0 bg-[#181818] text-white flex flex-col translate-x-0 translate-y-0 top-0 left-0">
          <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#232323]">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-[#2a2a2a] rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-2xl font-bold">Transactions</h2>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="sticky top-0 z-10 bg-[#181818] px-4 pt-4 pb-2">
              <div className="flex w-full gap-2">
                {TAB_OPTIONS.map((tab) => (
                  <Button
                    key={tab.key}
                    className={`flex-1 py-2 rounded-full font-semibold text-base transition-all relative
                      ${
                        activeTab === tab.key
                          ? "bg-white text-black shadow-lg border border-gray-200"
                          : "bg-[#23232f] !text-gray-500 hover:bg-[#23232f]/80 border border-transparent"
                      }`}
                    style={{ transition: "background 0.2s, color 0.2s" }}
                    onClick={() =>
                      setActiveTab(
                        tab.key as "processing" | "completed" | "failed"
                      )
                    }
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {visibleTransactions.length > 0 ? (
                <div className="space-y-5">
                  {visibleTransactions.map((tx) => (
                    <TransactionCard
                      key={tx.id}
                      tx={tx}
                      isExpanded={expandedTransactions.has(tx.id)}
                      onToggle={() => {
                        const newExpanded = new Set(expandedTransactions);
                        if (newExpanded.has(tx.id)) {
                          newExpanded.delete(tx.id);
                        } else {
                          newExpanded.add(tx.id);
                        }
                        setExpandedTransactions(newExpanded);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-gray-400 text-center">
                    Your transaction history will appear here once you make your
                    first trade.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionsModal;
