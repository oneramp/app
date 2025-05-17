import { SwapBuyTabs } from "./components/SwapBuyTabs";
import { Header } from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center">
        <div className="max-w-[1000px] w-full px-6">
          <SwapBuyTabs />
        </div>
      </div>
    </div>
  );
}
