import { assets } from "@/data/currencies";
import Image from "next/image";
import React from "react";

const AssetAvator = ({
  cryptoType,
  cryptoAmount,
}: {
  cryptoType: string;
  cryptoAmount: string;
}) => {
  const cryptoLogo = assets.find((asset) => asset.symbol === cryptoType)?.logo;
  return (
    <div className="flex items-center gap-2">
      <div className="size-12 rounded-full relative">
        <Image src={cryptoLogo!} alt={cryptoType} fill />
      </div>
      <span className="text-white text-lg font-medium">
        {cryptoAmount} {cryptoType}
      </span>
    </div>
  );
};

export default AssetAvator;
