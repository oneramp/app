import { Header } from "./components/Header";
import { SwapBuyTabs } from "./components/SwapBuyTabs";
import StateContextProvider from "./providers/StateContextProvider";

export default function Home() {
  return (
    <div className="min-h-screen w-full ">
      <div className="h-full min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full min-h-screen">
          <div className="hidden md:flex p-4">
            <Header logoOnly />
          </div>
          <div className="flex md:items-center md:justify-center py-4">
            <StateContextProvider />
            <SwapBuyTabs />
          </div>
          <div className="hidden md:flex relative">
            <div className="w-full flex flex-row justify-between py-6 px-4 ">
              <div className="flex flex-1" />
              <div className="flex flex-1">
                <Header />
              </div>

              {/* <ActionButtonList /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
