import { Header } from "./components/Header";
import { SwapBuyTabs } from "./components/SwapBuyTabs";
import StateContextProvider from "./providers/StateContextProvider";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <div className="h-full min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full min-h-screen">
          {/* Left section - Logo */}
          <div className="hidden md:flex p-4">
            <Header logoOnly />
          </div>

          {/* Mobile header - Only shown on mobile */}
          <div className="flex md:hidden w-full p-4">
            <Header logoOnly />
          </div>

          {/* Center section - Main content */}
          <div className="flex flex-col items-center justify-start md:justify-center w-full px-4 py-2 md:py-4">
            <StateContextProvider />
            <SwapBuyTabs />
          </div>

          {/* Right section */}
          <div className="hidden md:flex relative">
            <div className="w-full flex flex-row justify-between py-6 px-4">
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
