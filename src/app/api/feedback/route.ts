import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, user } = body;

    // .env dosyanızda DISCORD_WEBHOOK_URL tanımlı olmalı
    // İsterseniz farklı bir kanal için DISCORD_WEBHOOK_FEEDBACK_URL de tanımlayabilirsiniz
    const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_FEEDBACK_URL || process.env.DISCORD_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const discordPayload = {
      embeds: [
        {
          title: "📢 Yeni Geri Dönüt / Hata Bildirimi",
          color: 15158332, // Kırmızımsı renk (Dikkat çekici)
          fields: [
            {
              name: "Mesaj",
              value: message,
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

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) throw new Error('Discord API error');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}