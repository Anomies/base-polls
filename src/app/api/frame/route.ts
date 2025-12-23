import { NextRequest, NextResponse } from 'next/server';

const appUrl = "https://base-polls.vercel.app";
// Cache temizliği için v=5
const imageUrl = `${appUrl}/opengraph-image.png?v=5`;

async function getResponse(req: NextRequest): Promise<NextResponse> {
  
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

  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Base Polls</title>
        <meta property="og:title" content="Base Polls" />
        <meta property="og:image" content="${imageUrl}" />
        
        <meta name="fc:frame" content='${miniAppMetadata}' />
        <!-- YENİ: Kare görünüm ayarı -->
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
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