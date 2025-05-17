"use client";
import { useState } from "react";
import { SwapPanel } from "./SwapPanel";
import { BuyPanel } from "./BuyPanel";

const tabs = ["Swap", "Buy"];

export function SwapBuyTabs() {
  const [active, setActive] = useState("Swap");

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-4 mb-8 mt-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-6 py-2 rounded-full text-lg font-medium transition-colors focus:outline-none ${
              active === tab
                ? "bg-[#232323] text-white shadow"
                : "bg-transparent text-neutral-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="w-full flex justify-center">
        {active === "Swap" && <SwapPanel />}
        {active === "Buy" && <BuyPanel />}
        {/* app panels here later */}
      </div>
    </div>
  );
} 