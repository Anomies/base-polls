import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, options, user } = body;

    // Discord Webhook URL'nizi .env dosyasından alacağız
    const DISCORD_WEBHOOK_SUGGEST_URL = process.env.DISCORD_WEBHOOK_SUGGEST_URL;

    if (!DISCORD_WEBHOOK_SUGGEST_URL) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Discord'a gönderilecek mesaj formatı
    const discordPayload = {
      embeds: [
        {
          title: "🗳️ Yeni Anket Önerisi!",
          color: 3447003, // Mavi renk
          fields: [
            {
              name: "Soru",
              value: question,
            },
            {
              name: "Seçenekler",
              value: options,
            },
            {
              name: "Gönderen",
              value: user || "Anonim",
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Discord'a isteği gönder
    const response = await fetch(DISCORD_WEBHOOK_SUGGEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) {
      throw new Error('Discord API error');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}