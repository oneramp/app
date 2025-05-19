import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import EVMProvider from "./providers/EVMProvider";
import StarknetProvider from "./providers/StarknetProvider";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneRamp | Swap your stablecoins for fiat money",
  description:
    "Swap your stablecoins for fiat money using mobile money or bank transfer.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // In Next.js 15.x, safely handle cookies without headers()
  // This avoids the headers() Promise issue

  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <StarknetProvider>
          <EVMProvider cookies={cookies}>{children}</EVMProvider>
        </StarknetProvider>
      </body>
    </html>
  );
}
