import { NextRequest, NextResponse } from 'next/server';

// URL'i güvenli bir şekilde oluşturma
const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_HOST || 'https://base-polls.vercel.app';
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

const appUrl = getBaseUrl();

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const imageUrl = `${appUrl}/opengraph-image.png`;

  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Base Polls</title>
        <meta property="og:title" content="Base Polls" />
        <meta property="og:image" content="${imageUrl}" />
        
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />

        <meta property="fc:frame:button:1" content="Anketi Başlat 🗳️" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${appUrl}" />
      </head>
      <body>
        <h1>Base Polls</h1>
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