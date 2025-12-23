import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "~/app/providers";

const inter = Inter({ subsets: ["latin"] });

// URL oluşturma fonksiyonu
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_HOST) return process.env.NEXT_PUBLIC_HOST;
  return "https://base-polls.vercel.app";
};

const appUrl = getBaseUrl();
const imageUrl = `${appUrl}/opengraph-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  
  title: "Base Polls",
  description: "Daily polls for the Base ecosystem.",
  
  // Facebook, Discord, vb. için Open Graph
  openGraph: {
    title: "Base Polls",
    description: "Daily polls for the Base ecosystem.",
    url: appUrl,
    siteName: "Base Polls",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "Base Polls Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // YENİ: Twitter Kartı Ayarları (Embed Sorununu Çözer)
  twitter: {
    card: "summary_large_image",
    title: "Base Polls",
    description: "Daily polls for the Base ecosystem.",
    images: [imageUrl],
  },
  
  // Farcaster Frame ve App ID Ayarları
  other: {
    'base:app_id': '694117afd77c069a945bdf4d',
    
    // Farcaster Frame (Mini App Başlatıcı)
    "fc:frame": "vNext",
    "fc:frame:image": imageUrl,
    "fc:frame:image:aspect_ratio": "1.91:1",
    
    // Buton
    "fc:frame:button:1": "Anketi Başlat 🗳️",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": appUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}> 
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}