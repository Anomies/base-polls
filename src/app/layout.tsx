import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "~/app/providers";

const inter = Inter({ subsets: ["latin"] });

// Canlı URL'nizi buraya yazın (sonunda / olmasın)
const appUrl = "https://base-polls.vercel.app";

export const metadata: Metadata = {
  title: "Base Polls",
  description: "Daily polls for the Base ecosystem.",
  openGraph: {
    title: "Base Polls",
    description: "Daily polls for the Base ecosystem.",
    url: appUrl,
    siteName: "Base Polls",
    images: [
      {
        url: `${appUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Base Polls Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  other: {
    // Base App ID
    'base:app_id': '694117afd77c069a945bdf4d',
    
    // Farcaster Frame Meta Etiketleri (Ana sayfa için)
    "fc:frame": "vNext",
    "fc:frame:image": `${appUrl}/opengraph-image.png`,
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:button:1": "Anketi Başlat 🗳️",
    "fc:frame:button:1:action": "link", // Mini App başlatmak için 'link' kullanılır
    "fc:frame:button:1:target": appUrl, // Mini App'in açılacağı URL
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