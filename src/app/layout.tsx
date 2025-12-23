import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "~/app/providers";

const inter = Inter({ subsets: ["latin"] });

// 1. URL Ayarları
const appUrl = "https://base-polls.vercel.app";
// Görsel cache'ini temizlemek için versiyonu artırdık (v=4)
const imageUrl = `${appUrl}/opengraph-image.png?v=4`;

// 2. Farcaster Mini App Yapılandırması (JSON)
const miniAppConfig = {
  version: "1",
  imageUrl: imageUrl,
  button: {
    title: "Start Poll 🗳️",
    action: {
      type: "launch_frame",
      name: "Base Polls",
      url: appUrl,
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#0052FF"
    }
  }
};

const miniAppMetadata = JSON.stringify(miniAppConfig);

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Base Polls",
  description: "Daily polls for the Base ecosystem.",
  
  openGraph: {
    title: "Base Polls",
    description: "Daily polls for the Base ecosystem.",
    url: appUrl,
    siteName: "Base Polls",
    images: [{ url: imageUrl, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Base Polls",
    images: [imageUrl],
  },

  other: {
    'base:app_id': '694117afd77c069a945bdf4d', 
    "fc:frame": miniAppMetadata,
    // YENİ: Görsel oranını 1:1 (Kare) yapıyoruz. 
    // Bu, görselin daha büyük görünmesini ve kesilmemesini sağlar.
    "fc:frame:image:aspect_ratio": "1:1",
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
        <meta property="fc:frame" content={miniAppMetadata} />
        {/* Manuel yedekleme etiketi */}
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
      </head>
      <body className={inter.className}> 
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}