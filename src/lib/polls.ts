// Bu dosya, anket sorularını ve günlük seçim mantığını içerir.

export interface PollData {
  id: number; // Tarih formatı: YYYYMMDD (Örn: 20251216)
  question: {
    en: string;
    tr: string;
  };
  options: {
    en: string[];
    tr: string[];
  };
}

// 30 GÜNLÜK SORU HAVUZU
// Sistem her gün bu havuzdan sıradaki soruyu seçer ve başa döner.
const questionPool = [
  // 1. Gün
  {
    question: {
      en: "What is your Bitcoin price prediction for end of 2025?",
      tr: "2025 sonu için Bitcoin fiyat tahmininiz nedir?"
    },
    options: {
      en: ["$100k - $150k", "$150k - $250k", "$250k+", "Below $100k"],
      tr: ["$100k - $150k", "$150k - $250k", "$250k Üzeri", "$100k Altı"]
    }
  },
  // 2. Gün
  {
    question: {
      en: "Which sector will lead the next bull run?",
      tr: "Bir sonraki boğa koşusuna hangi sektör öncülük edecek?"
    },
    options: {
      en: ["AI & DePIN", "Gaming & Metaverse", "RWA (Real World Assets)", "Meme Coins"],
      tr: ["Yapay Zeka & DePIN", "Oyun & Metaverse", "RWA (Gerçek Varlıklar)", "Meme Coinler"]
    }
  },
  // 3. Gün
  {
    question: {
      en: "What is the most important feature for a Layer 2?",
      tr: "Bir Layer 2 ağı için en önemli özellik nedir?"
    },
    options: {
      en: ["Low Fees", "High Security", "Decentralization", "Ease of Use"],
      tr: ["Düşük Ücretler", "Yüksek Güvenlik", "Merkeziyetsizlik", "Kullanım Kolaylığı"]
    }
  },
  // 4. Gün
  {
    question: {
      en: "How often do you use Farcaster?",
      tr: "Farcaster'ı ne sıklıkla kullanıyorsunuz?"
    },
    options: {
      en: ["Daily", "Weekly", "Rarely", "Just started"],
      tr: ["Her Gün", "Haftalık", "Nadiren", "Yeni Başladım"]
    }
  },
  // 5. Gün
  {
    question: {
      en: "Which stablecoin do you trust the most?",
      tr: "En çok hangi stablecoin'e güveniyorsunuz?"
    },
    options: {
      en: ["USDC", "USDT", "DAI", "None"],
      tr: ["USDC", "USDT", "DAI", "Hiçbiri"]
    }
  },
  // 6. Gün
  {
    question: {
      en: "Do you hold any NFTs?",
      tr: "Hiç NFT tutuyor musunuz?"
    },
    options: {
      en: ["Yes, many!", "A few", "Sold everything", "Never bought"],
      tr: ["Evet, çok fazla!", "Birkaç tane", "Hepsini sattım", "Hiç almadım"]
    }
  },
  // 7. Gün
  {
    question: {
      en: "What's your preferred wallet type?",
      tr: "Tercih ettiğiniz cüzdan türü nedir?"
    },
    options: {
      en: ["Hardware (Ledger etc.)", "Browser Extension", "Mobile App", "Smart Wallet (AA)"],
      tr: ["Donanım (Ledger vb.)", "Tarayıcı Eklentisi", "Mobil Uygulama", "Akıllı Cüzdan (AA)"]
    }
  },
  // 8. Gün
  {
    question: {
      en: "How much of your portfolio is in ETH?",
      tr: "Portföyünüzün ne kadarı ETH?"
    },
    options: {
      en: ["0-25%", "25-50%", "50-75%", "75-100%"],
      tr: ["%0-25", "%25-50", "%50-75", "%75-100"]
    }
  },
  // 9. Gün
  {
    question: {
      en: "What do you think about Ethereum Gas fees lately?",
      tr: "Son zamanlarda Ethereum Gas ücretleri hakkında ne düşünüyorsunuz?"
    },
    options: {
      en: ["Too High", "Acceptable", "Low (Thanks to L2s)", "Don't Care"],
      tr: ["Çok Yüksek", "Kabul Edilebilir", "Düşük (L2'ler sağ olsun)", "Umrumda Değil"]
    }
  },
  // 10. Gün
  {
    question: {
      en: "Have you ever been airdrop farming?",
      tr: "Hiç airdrop avcılığı yaptınız mı?"
    },
    options: {
      en: ["Yes, actively", "Sometimes", "Once or twice", "Never"],
      tr: ["Evet, aktif olarak", "Bazen", "Bir veya iki kez", "Asla"]
    }
  },
  // 11. Gün
  {
    question: {
      en: "Which social media platform is best for crypto news?",
      tr: "Kripto haberleri için en iyi sosyal medya platformu hangisi?"
    },
    options: {
      en: ["Twitter (X)", "Farcaster", "Discord", "Telegram"],
      tr: ["Twitter (X)", "Farcaster", "Discord", "Telegram"]
    }
  },
  // 12. Gün
  {
    question: {
      en: "Do you stake your assets?",
      tr: "Varlıklarınızı stake ediyor musunuz?"
    },
    options: {
      en: ["Yes, all of them", "Some of them", "No, too risky", "What is staking?"],
      tr: ["Evet, hepsini", "Bazılarını", "Hayır, çok riskli", "Stake etmek nedir?"]
    }
  },
  // 13. Gün
  {
    question: {
      en: "What is your favorite DEX on Base?",
      tr: "Base üzerindeki favori DEX'iniz hangisi?"
    },
    options: {
      en: ["Aerodrome", "Uniswap", "BaseSwap", "SushiSwap"],
      tr: ["Aerodrome", "Uniswap", "BaseSwap", "SushiSwap"]
    }
  },
  // 14. Gün
  {
    question: {
      en: "Do you believe in 'The Flippening' (ETH overtaking BTC)?",
      tr: "'Flippening'e (ETH'nin BTC'yi geçmesi) inanıyor musunuz?"
    },
    options: {
      en: ["Yes, inevitably", "Maybe someday", "Unlikely", "Impossible"],
      tr: ["Evet, kaçınılmaz", "Belki bir gün", "Olası değil", "İmkansız"]
    }
  },
  // 15. Gün
  {
    question: {
      en: "What is your biggest crypto regret?",
      tr: "En büyük kripto pişmanlığınız nedir?"
    },
    options: {
      en: ["Selling too early", "Buying the top", "Not buying enough", "Lost keys/Scammed"],
      tr: ["Erken satmak", "Tepeden almak", "Yeterince almamak", "Kayıp anahtar/Dolandırılmak"]
    }
  },
  // 16. Gün
  {
    question: {
      en: "How do you store your seed phrase?",
      tr: "Seed phrase'inizi (kurtarma kelimeleri) nasıl saklıyorsunuz?"
    },
    options: {
      en: ["Paper/Metal backup", "Password Manager", "In my head", "Cloud Storage (Risky!)"],
      tr: ["Kağıt/Metal yedek", "Şifre Yöneticisi", "Aklımda", "Bulut Depolama (Riskli!)"]
    }
  },
  // 17. Gün
  {
    question: {
      en: "Are you interested in on-chain gaming?",
      tr: "On-chain oyunlarla ilgileniyor musunuz?"
    },
    options: {
      en: ["Yes, playing daily", "Watching closely", "Not interested", "Maybe in future"],
      tr: ["Evet, her gün oynuyorum", "Yakından takip ediyorum", "İlgilenmiyorum", "Belki gelecekte"]
    }
  },
  // 18. Gün
  {
    question: {
      en: "What drives the market most?",
      tr: "Piyasayı en çok ne yönlendiriyor?"
    },
    options: {
      en: ["Tech innovation", "Hype & Memes", "Regulations", "Macro economy"],
      tr: ["Teknolojik yenilik", "Hype & Memeler", "Düzenlemeler", "Makro ekonomi"]
    }
  },
  // 19. Gün
  {
    question: {
      en: "Do you use crypto for payments?",
      tr: "Ödemeler için kripto kullanıyor musunuz?"
    },
    options: {
      en: ["Yes, regularly", "Occasionally", "Only for transfers", "Never"],
      tr: ["Evet, düzenli olarak", "Ara sıra", "Sadece transferler için", "Asla"]
    }
  },
  // 20. Gün
  {
    question: {
      en: "Which blockchain has the best developer experience?",
      tr: "Hangi blok zinciri en iyi geliştirici deneyimine sahip?"
    },
    options: {
      en: ["Ethereum", "Solana", "Base", "Cosmos"],
      tr: ["Ethereum", "Solana", "Base", "Cosmos"]
    }
  },
  // 21. Gün
  {
    question: {
      en: "What is your strategy for the bear market?",
      tr: "Ayı piyasası stratejiniz nedir?"
    },
    options: {
      en: ["Accumulate (DCA)", "Hold (HODL)", "Short/Trade", "Leave the market"],
      tr: ["Toplamak (DCA)", "Tutmak (HODL)", "Short/Trade", "Piyasadan çıkmak"]
    }
  },
  // 22. Gün
  {
    question: {
      en: "Do you think AI agents will dominate DeFi?",
      tr: "Yapay zeka ajanlarının DeFi'ye hükmedeceğini düşünüyor musunuz?"
    },
    options: {
      en: ["Yes, totally", "Partially", "No, humans needed", "Too early to say"],
      tr: ["Evet, tamamen", "Kısmen", "Hayır, insan gerekli", "Söylemek için erken"]
    }
  },
  // 23. Gün
  {
    question: {
      en: "What's the best way to learn crypto?",
      tr: "Kriptoyu öğrenmenin en iyi yolu nedir?"
    },
    options: {
      en: ["Twitter/YouTube", "Official Docs", "Building projects", "Trial and error"],
      tr: ["Twitter/YouTube", "Resmi Dokümanlar", "Proje geliştirmek", "Deneme yanılma"]
    }
  },
  // 24. Gün
  {
    question: {
      en: "How many wallets do you actively use?",
      tr: "Aktif olarak kaç cüzdan kullanıyorsunuz?"
    },
    options: {
      en: ["1", "2-5", "5-10", "10+"],
      tr: ["1", "2-5", "5-10", "10+"]
    }
  },
  // 25. Gün
  {
    question: {
      en: "What is your favorite NFT marketplace?",
      tr: "Favori NFT pazar yeriniz hangisi?"
    },
    options: {
      en: ["OpenSea", "Blur", "Magic Eden", "LooksRare"],
      tr: ["OpenSea", "Blur", "Magic Eden", "LooksRare"]
    }
  },
  // 26. Gün
  {
    question: {
      en: "Do you lend/borrow assets on DeFi?",
      tr: "DeFi'de varlık borç veriyor/alıyor musunuz?"
    },
    options: {
      en: ["Yes, frequently", "Sometimes", "Rarely", "Never (Too risky)"],
      tr: ["Evet, sık sık", "Bazen", "Nadiren", "Asla (Çok riskli)"]
    }
  },
  // 27. Gün
  {
    question: {
      en: "Which region is most crypto-friendly?",
      tr: "Hangi bölge kripto dostu?"
    },
    options: {
      en: ["Asia", "Europe", "Middle East (Dubai)", "North America"],
      tr: ["Asya", "Avrupa", "Orta Doğu (Dubai)", "Kuzey Amerika"]
    }
  },
  // 28. Gün
  {
    question: {
      en: "What is your main goal in crypto?",
      tr: "Kriptodaki ana hedefiniz nedir?"
    },
    options: {
      en: ["Financial Freedom", "Technology Interest", "Community", "Fun/Gambling"],
      tr: ["Finansal Özgürlük", "Teknoloji İlgisi", "Topluluk", "Eğlence/Kumar"]
    }
  },
  // 29. Gün
  {
    question: {
      en: "Will we see a spot Ethereum ETF soon?",
      tr: "Yakında spot Ethereum ETF'si görecek miyiz?"
    },
    options: {
      en: ["Yes, definitely", "Likely", "Unlikely", "No"],
      tr: ["Evet, kesinlikle", "Muhtemel", "Olası değil", "Hayır"]
    }
  },
  // 30. Gün
  {
    question: {
      en: "How bullish are you on Base ecosystem?",
      tr: "Base ekosistemi konusunda ne kadar iyimsersiniz?"
    },
    options: {
      en: ["Maxi (10/10)", "Very (8/10)", "Moderate (5/10)", "Not interested"],
      tr: ["Maxi (10/10)", "Çok (8/10)", "Orta (5/10)", "İlgilenmiyorum"]
    }
  }
];

// BUGÜNÜN ANKETİNİ GETİREN FONKSİYON
export function getDailyPoll(): PollData {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  
  // Tarihi ID'ye çevir: "20251216" gibi
  const dateKeyStr = `${year}${month}${day}`;
  const pollId = parseInt(dateKeyStr);

  // Deterministik Seçim: Tarihi sayıya çevirip soru sayısına mod alıyoruz.
  const questionIndex = pollId % questionPool.length;
  const selectedQuestion = questionPool[questionIndex];

  return {
    id: pollId,
    question: selectedQuestion.question,
    options: selectedQuestion.options
  };
}