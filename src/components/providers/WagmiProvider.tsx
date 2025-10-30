// WagmiProvider.tsx - Harici Cüzdan Desteği Eklendi

import { createConfig, http, WagmiProvider } from "wagmi";
// 1. baseSepolia'yı ve diğer ağları import etmeye devam ediyoruz
import { base, optimism, baseSepolia } from "wagmi/chains";
// 2. YENİ: 'injected' (MetaMask vb.) ve 'coinbaseWallet'ı import ediyoruz
import { injected, coinbaseWallet } from "@wagmi/connectors"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { METADATA } from "../../lib/utils";

export const config = createConfig({
  chains: [base, optimism, baseSepolia],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
    [baseSepolia.id]: http(),
  },
  // 3. YENİ: connectors dizimizi güncelliyoruz
  connectors: [
    farcasterMiniApp(), // Farcaster uygulamasının içindeyken bu kullanılır
    injected(),         // Harici tarayıcılar için MetaMask vb.
    coinbaseWallet({    // Harici tarayıcılar için Coinbase Wallet
      appName: METADATA.name || "Base Polls",
      appLogoUrl: METADATA.iconImageUrl,
    }),
  ],
});

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}