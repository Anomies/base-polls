import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "~/app/providers";

const inter = Inter({ subsets: ["latin"] });

// 1. URL Ayarları
const appUrl = "https://base-polls.vercel.app";
const imageUrl = `${appUrl}/opengraph-image.png`;

// 2. Farcaster Mini App Yapılandırması (JSON Formatı)
// Dökümana göre bu obje stringify edilip meta etiketine konulmalı.
const miniAppConfig = {
  version: "1",
  imageUrl: imageUrl,
  button: {
    title: "Anketi Başlat 🗳️",
    action: {
      type: "launch_frame", // "launch_miniapp" yerine "launch_frame" kullanılması öneriliyor (v2 için)
      name: "Base Polls",
      url: appUrl,
      splashImageUrl: `${appUrl}/icon.png`, // Varsa ikonunuz
      splashBackgroundColor: "#0052FF" // Base Mavisi
    }
  }
};

// JSON objesini string'e çeviriyoruz
const miniAppMetadata = JSON.stringify(miniAppConfig);

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Base Polls",
  description: "Daily polls for the Base ecosystem.",
  
  // Standart Sosyal Medya
  openGraph: {
    title: "Base Polls",
    description: "Daily polls for the Base ecosystem.",
    url: appUrl,
    siteName: "Base Polls",
    images: [{ url: imageUrl, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Base Polls",
    images: [imageUrl],
  },

  // Farcaster & Base Özel Etiketleri
  other: {
    // Base App ID (Manifest doğrulama için)
    'base:app_id': '694117afd77c069a945bdf4d', 
    
    // Farcaster Mini App Etiketi (YENİ STANDART)
    "fc:frame": miniAppMetadata,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Next.js metadata API bazen custom tag'lerde sorun çıkarırsa diye manuel yedek */}
        <meta property="fc:frame" content={miniAppMetadata} />
      </head>
      <body className={inter.className}> 
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}