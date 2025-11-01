"use client";

import dynamic from "next/dynamic";

import FrameProvider from "~/components/providers/FrameProvider";

//FID, DName, FImage için AuthKitProvider ekleniyor
import { AuthKitProvider } from "@farcaster/auth-kit";


const WagmiProvider = dynamic(
  () => import("~/components/providers/WagmiProvider"),
  {
    ssr: false,
  }
);

const ErudaProvider = dynamic(
  () => import("~/components/providers/ErudaProvider"),
  {
    ssr: false,
  }
);

// 2. AuthKitProvider için yapılandırmayı (config) oluşturuyoruz
const authKitConfig = {
  // .env dosyamızdan RPC URL'sini okuyoruz
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.base.org',
};


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 3. Tüm uygulamayı eksik olan AuthKitProvider ile sarmalıyoruz
    <AuthKitProvider config={authKitConfig}>
      <WagmiProvider>
        <FrameProvider>
          <ErudaProvider />
          {children}
        </FrameProvider>
      </WagmiProvider>
    </AuthKitProvider>
  );
}