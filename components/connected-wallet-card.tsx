import { Button } from "@/app/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useWalletGetInfo from "@/hooks/useWalletGetInfo";
import { ChainTypes } from "@/types";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

const ConnectedWalletCard = ({
  disconnect,
  network,
}: {
  disconnect: () => void;
  network: ChainTypes;
}) => {
  const { address } = useWalletGetInfo();

  if (!address) {
    return null;
  }

  const networkLogo =
    network === "evm" ? "/logos/ethereum.png" : "/logos/starknet.png";

  return (
    <Card className="bg-transparent border-neutral-800 text-white">
      <CardHeader>
        <CardTitle className="flex flex-row w-full items-center gap-3">
          <div className="size-12 bg-neutral-600 rounded-full relative overflow-hidden">
            <Image
              src={networkLogo}
              alt="Ethereum"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-base font-medium">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <span className="text-neutral-400 text-sm">
              {network === "evm" ? "EVM" : "Starknet"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex w-full">
        <Button
          variant="outline"
          onClick={disconnect}
          className="w-full rounded-md flex flex-row items-center bg-neutral-900 text-sm"
        >
          <ArrowLeft className="size-3 mr-2" />
          Disconnect
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectedWalletCard;
