import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "~/app/providers";

const inter = Inter({ subsets: ["latin"] });

// URL'i SABİTLİYORUZ
const appUrl = "https://base-polls.vercel.app";

// Görselin tam adresi
const imageUrl = `${appUrl}/opengraph-image.png`;
// Post URL'si (Frame validasyonu için gerekli olabilir, boş olsa bile bir endpoint göstermeli)
const postUrl = `${appUrl}/api/frame`;

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  
  title: "Base Polls",
  description: "Daily polls for the Base ecosystem.",
  
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

  twitter: {
    card: "summary_large_image",
    title: "Base Polls",
    description: "Daily polls for the Base ecosystem.",
    images: [imageUrl],
  },
  
  // Farcaster Frame Ayarları
  other: {
    'base:app_id': '694117afd77c069a945bdf4d',
    
    "fc:frame": "vNext",
    "fc:frame:image": imageUrl,
    "fc:frame:image:aspect_ratio": "1.91:1",
    // Link butonu olsa bile post_url eklemek validasyonu güçlendirir
    "fc:frame:post_url": postUrl,
    
    // Mini App Başlatma Butonu
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