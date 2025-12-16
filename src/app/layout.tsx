import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Orijinal şablonun kullandığı Providers importu
import { Providers } from "~/app/providers";

const inter = Inter({ subsets: ["latin"] });

// Base'in istediği metadata ayarlarını buraya ekliyoruz
export const metadata: Metadata = {
  title: "Base Polls",
  description: "Daily polls for the Base ecosystem.",
  other: {
    'base:app_id': '694117afd77c069a945bdf4d', // Sizin App ID'niz
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. Dili 'en' olarak ayarlıyoruz
    // 2. Karanlık modu zorunlu kılmak için <html> etiketine 'dark' class'ını ekliyoruz
    <html lang="en" className="dark">
      {/* 3. <body> etiketi, tailwind.config.js'deki 'bg-background' 
           CSS değişkenini otomatik olarak alacaktır. 
      */}
      <body className={inter.className}> 
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}