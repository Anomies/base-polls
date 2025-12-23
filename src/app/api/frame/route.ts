import { NextRequest, NextResponse } from 'next/server';

const appUrl = "https://base-polls.vercel.app";
const imageUrl = `${appUrl}/opengraph-image.png`;

async function getResponse(req: NextRequest): Promise<NextResponse> {
  
  // JSON konfigürasyonunu burada da oluşturuyoruz
  const miniAppConfig = {
    version: "1",
    imageUrl: imageUrl,
    button: {
      title: "Anketi Başlat 🗳️",
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

  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Base Polls</title>
        <meta property="og:title" content="Base Polls" />
        <meta property="og:image" content="${imageUrl}" />
        
        <!-- YENİ STANDART -->
        <meta name="fc:frame" content='${miniAppMetadata}' />
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