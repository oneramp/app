"use client";
import { getInstitutions } from "@/actions/institutions";
import { Input } from "@/components/ui/input";
import { Institution } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface InstitutionModalProps {
  open: boolean;
  onClose: () => void;
  selectedInstitution: Institution | null;
  onSelect: (institution: Institution) => void;
  country: string;
  buy?: boolean;
}

export function InstitutionModal({
  open,
  onClose,
  onSelect,
  country,
  buy,
}: InstitutionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["institutions", country],
    queryFn: () => getInstitutions(country, buy ? "buy" : "sell"),
  });

  if (!open) return null;

  // Filter institutions based on search query
  const filteredInstitutions = data?.filter((institution) =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-[#232323] rounded-2xl p-6 max-w-md w-full min-h-[50vh] max-h-[80vh] shadow-2xl relative">
        <button
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
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

        <div className="text-xl text-white font-semibold mb-4">
          Select institution
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="#999"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Input
            type="text"
            placeholder="Search institutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] text-white py-6 pl-10 pr-4 rounded-full border border-[#444] focus:outline-none focus:border-[#666]"
          />
        </div>

        {isLoading && (
          <div className="text-white flex items-center justify-center">
            <Loader className="animate-spin size-4" />
          </div>
        )}

        {error && (
          <div className="text-white text-xs">Error: {error.message}</div>
        )}

        <div className="overflow-y-auto max-h-[55vh]">
          <div className="flex flex-col">
            {filteredInstitutions?.map((institution) => (
              <button
                key={institution.name}
                className={`flex items-center gap-3 w-full px-4 py-5 hover:bg-[#2a2a2a] transition-colors text-left border-b border-[#333] last:border-0`}
                onClick={() => onSelect(institution)}
              >
                {institution.logo ? (
                  <Image
                    src={institution.logo}
                    alt={institution.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#444] flex items-center justify-center text-white">
                    {institution.name.charAt(0)}
                  </div>
                )}
                <span className="text-white text-lg font-medium">
                  {institution.name}
                </span>
              </button>
            ))}

            {filteredInstitutions?.length === 0 && (
              <div className="py-4 text-center text-neutral-400">
                No institutions found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
