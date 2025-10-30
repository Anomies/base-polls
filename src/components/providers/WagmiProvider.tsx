// Bu dosyayı "Base Sepolia" test ağını eklemek için güncelliyoruz.
import { createConfig, http, WagmiProvider } from "wagmi";
// 1. "baseSepolia"yı wagmi/chains'den import ediyoruz
import { base, optimism, baseSepolia } from "wagmi/chains";
import { baseAccount } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { METADATA } from "../../lib/utils";

export const config = createConfig({
  // 2. 'baseSepolia'yı zincirler listesine ekliyoruz
  chains: [base, optimism, baseSepolia],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
    [baseSepolia.id]: http(), // 3. 'baseSepolia' için bir transport ekliyoruz
  },
  connectors: [
    farcasterMiniApp(),
    // baseAccount konektörünü Aşama 4'te kaldırmıştık,
    // o haliyle (baseAccount olmadan) bırakıyoruz.
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