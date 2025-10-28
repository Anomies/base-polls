import { createConfig, http, WagmiProvider } from "wagmi";
import { base, optimism } from "wagmi/chains";
// baseAccount'u KULLANMAYACAĞIZ, bu yüzden import'u silebiliriz veya bırakabiliriz.
// import { baseAccount } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
// METADATA'ya da artık ihtiyacımız yok, çünkü baseAccount'u kaldırdık.
// import { METADATA } from "../../lib/utils";

export const config = createConfig({
  chains: [base, optimism],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
  },
  connectors: [
    // Sadece Farcaster Mini App bağlayıcısı kalıyor.
    farcasterMiniApp(), 
    
    // HATAYA NEDEN OLAN KISMI DEVRE DIŞI BIRAKIYORUZ:
    /*
    baseAccount({
      appName: METADATA.name,
      appLogoUrl: METADATA.iconImageUrl,
    })
    */
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
