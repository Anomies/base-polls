import { NextRequest, NextResponse } from 'next/server';

/**
 * Bu dosya, Farcaster'da paylaşılan linkin nasıl görüneceğini tanımlar.
 * Bu bir "Frame"dir ve Mini App'i başlatmak için bir buton içerir.
 */
async function getResponse(req: NextRequest): Promise<NextResponse> {
  // .env dosyamızdan host'u alıyoruz.
  // Vercel'de NEXT_PUBLIC_HOST otomatik tanımlanmazsa, manuel eklemek gerekebilir.
  // Güvenlik için 'https://' protokolünü garantiye alıyoruz.
  const host = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

  // Bu, Mini App'imizin ana URL'sidir (src/app/page.tsx'in sunulduğu yer)
  const miniAppUrl = `${host}/`;

  // Frame Görseli: Projenizin kök dizinindeki opengraph-image.png dosyasını kullanır.
  // Not: Eğer dosyanız 'public' klasöründeyse yine aynı yoldan erişilebilir.
  // Tam URL olması zorunludur (örn: https://base-polls.vercel.app/opengraph-image.png)
  const imageUrl = `${host}/opengraph-image.png`;

  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Base Polls</title>
        <meta property="og:title" content="Base Polls" />
        <meta property="og:image" content="${imageUrl}" />
        
        <!-- Farcaster Frame Meta Etiketleri -->
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />

        <!-- Mini App Başlatma Butonu -->
        <meta property="fc:frame:button:1" content="Anketi Başlat 🗳️" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${miniAppUrl}" />
      </head>
      <body>
        <h1>Base Polls Farcaster Frame</h1>
      </body>
    </html>
  `;

  return new NextResponse(frameHtml, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export async function GET(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';