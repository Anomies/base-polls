import { NextRequest, NextResponse } from 'next/server';

/**
 * Bu dosya, Farcaster'da paylaşılacak linkin nasıl görüneceğini tanımlar.
 * "Base Polls" temamıza uygun şekilde güncelliyoruz.
 */
async function getResponse(req: NextRequest): Promise<NextResponse> {
  // .env dosyamızdan host'u alıyoruz.
  const host = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

  // Bu, Mini App'imizin ana URL'sidir (src/app/page.tsx'in sunulduğu yer)
  const miniAppUrl = `${host}/`;

  // Frame için "Base Polls" temalı bir karşılama görseli.
  const imageUrl = `https://placehold.co/600x400/0000FF/FFFFFF?text=Base+Polls%0A%0AG%C3%BCn%C3%BCn+Anketine+Kat%C4%B1l%21`;

  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Base Polls</title>
        <meta property="og:title" content="Base Polls" />
        
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />

        <meta property="fc:frame:button:1" content="Anketi Başlat" />
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