import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SwapPanel } from "@/app/components/SwapPanel";
import { BuyPanel } from "@/app/components/BuyPanel";

export function MainTabsSwitch() {
  return (
    <Tabs defaultValue="Swap" className="w-[500px]">
      <TabsList className="grid w-[250px] mx-auto grid-cols-2 p-1 bg-transparent rounded-full mb-2 h-12 ">
        <TabsTrigger
          value="Swap"
          className="data-[state=active]:bg-neutral-800 text-sm data-[state=active]:text-white data-[state=active]:font-bold text-neutral-400 rounded-full transition-all"
        >
          Swap
        </TabsTrigger>
        <TabsTrigger
          value="Buy"
          className="data-[state=active]:bg-neutral-800 text-sm data-[state=active]:text-white data-[state=active]:font-bold text-neutral-400 rounded-full transition-all"
        >
          Buy
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Swap">
        <SwapPanel />
      </TabsContent>
      <TabsContent value="Buy">
        <BuyPanel />
      </TabsContent>
    </Tabs>
  );
}

export default MainTabsSwitch;
