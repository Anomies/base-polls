import type { Metadata } from "next";

import "~/app/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "~/app/providers";
import { METADATA } from "~/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: METADATA.name,
    openGraph: {
      title: METADATA.name,
      description: METADATA.description,
      images: [METADATA.bannerImageUrl],
      url: METADATA.homeUrl,
      siteName: METADATA.name
    },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
