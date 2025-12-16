"use client";

import dynamic from "next/dynamic";
import FrameProvider from "~/components/providers/FrameProvider";

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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <FrameProvider>
        {/* DÜZELTME: Eruda'yı sadece geliştirme (development) ortamında göster.
          Canlı (production) ortamda bu kod çalışmaz ve kullanıcılar konsolu görmez.
        */}
        {process.env.NODE_ENV === 'development' && <ErudaProvider />}
        {children}
      </FrameProvider>
    </WagmiProvider>
  );
}