import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Orijinal şablonun kullandığı Providers importu
import { Providers } from "~/app/providers";

const inter = Inter({ subsets: ["latin"] });

// Base'in istediği metadata ve OG Image ayarları
export const metadata: Metadata = {
  title: "Base Polls",
  description: "Daily polls for the Base ecosystem.",
  other: {
    'base:app_id': '694117afd77c069a945bdf4d', 
  },
  // YENİ: Open Graph (Facebook, Discord, LinkedIn vb.) ayarları
  openGraph: {
    title: "Base Polls",
    description: "Daily polls for the Base ecosystem.",
    url: "https://base-polls.vercel.app", // Kendi canlı URL'inizi buraya yazın
    siteName: "Base Polls",
    images: [
      {
        url: "/opengraph-image.png", // Dosya yolunu açıkça belirtiyoruz
        width: 1200,
        height: 630,
        alt: "Base Polls Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // YENİ: Twitter Card ayarları
  twitter: {
    card: "summary_large_image",
    title: "Base Polls",
    description: "Daily polls for the Base ecosystem.",
    images: ["/opengraph-image.png"], // Dosya yolunu açıkça belirtiyoruz
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