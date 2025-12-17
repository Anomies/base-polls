import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// DÜZELTME: Garanti olması için göreceli yol kullanıyoruz
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

// URL'i güvenli bir şekilde oluşturma fonksiyonu
const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_HOST || 'https://base-polls.vercel.app';
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

const appUrl = getBaseUrl();
const imageUrl = `${appUrl}/opengraph-image.png`;

export const metadata: Metadata = {
  title: "Base Polls",
  description: "Daily polls for the Base ecosystem.",
  // Sosyal Medya Önizlemeleri (Open Graph)
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
  // Farcaster Frame Ayarları (Kritik Kısım)
  other: {
    'base:app_id': '694117afd77c069a945bdf4d',
    
    "fc:frame": "vNext",
    "fc:frame:image": imageUrl,
    "fc:frame:image:aspect_ratio": "1.91:1",
    // Bu buton "Mini App"i başlatır
    "fc:frame:button:1": "Anketi Başlat 🗳️",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": appUrl, // Butona basınca Ana Sayfa açılır
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