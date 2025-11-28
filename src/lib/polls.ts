export interface PollData {
  id: number; // Tarih formatı: YYYYMMDD (Örn: 20231030)
  question: {
    en: string;
    tr: string;
  };
  options: {
    en: string[];
    tr: string[];
  };
}

// Varsayılan anket (Eğer o gün için özel soru girilmediyse bu gösterilir)
export const defaultPoll: PollData = {
  id: 0,
  question: {
    en: "How are you feeling about the crypto market today?",
    tr: "Bugün kripto piyasası hakkında ne hissediyorsunuz?"
  },
  options: {
    en: ["Bullish 🚀", "Bearish 🐻", "Neutral 😐", "Uncertain 🤷‍♂️"],
    tr: ["Yükseliş Bekliyorum 🚀", "Düşüş Bekliyorum 🐻", "Nötr 😐", "Kararsızım 🤷‍♂️"]
  }
};

// Tarihe göre anket listesi
// BURAYA İSTEDİĞİNİZ KADAR GELECEK TARİHLİ SORU EKLEYEBİLİRSİNİZ
export const polls: Record<string, PollData> = {
  // ÖRNEK: Bugünün tarihi (Test ederken burayı bugünün tarihiyle değiştirin)
  "20251128": { 
    id: 20251128,
    question: {
      en: "Which Layer 2 solution do you use the most?",
      tr: "En çok hangi Layer 2 çözümünü kullanıyorsunuz?"
    },
    options: {
      en: ["Base", "Arbitrum", "Optimism", "Polygon"],
      tr: ["Base", "Arbitrum", "Optimism", "Polygon"]
    }
  },
  // Yarının sorusu
  "20251129": { 
    id: 20251129,
    question: {
      en: "What is your Bitcoin price prediction for end of 2025?",
      tr: "2025 sonu için Bitcoin fiyat tahmininiz nedir?"
    },
    options: {
      en: ["$100k+", "$150k+", "$200k+", "Below $50k"],
      tr: ["$100k Üzeri", "$150k Üzeri", "$200k Üzeri", "$50k Altı"]
    }
  }
};

// BUGÜNÜN ANKETİNİ GETİREN FONKSİYON
export function getDailyPoll(): PollData {
  // UTC zamanına göre bugünün tarihini al (YYYYMMDD formatında)
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  
  const dateKey = `${year}${month}${day}`;
  const pollId = parseInt(dateKey);

  // O tarih için hazırlanmış bir soru var mı?
  const dailyPoll = polls[dateKey];

  if (dailyPoll) {
    return dailyPoll;
  } else {
    // Yoksa, ID'yi yine bugünün tarihi yap ama varsayılan soruyu kullan
    // Böylece her gün yeni bir oylama açılmış olur (soru aynı olsa bile)
    return {
      ...defaultPoll,
      id: pollId 
    };
  }
}