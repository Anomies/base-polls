'use client';
// Bu, "Base Polls" uygulamanızın ana sayfası olacak.
// Şablonun demo içeriğini tamamen kaldırıp
// yerine kendi anket arayüzümüzü koyuyoruz.

import React, { useState } from 'react';

// Anket verisi (şimdilik statik)
// 1. Dil (i18n) için çeviri objesi
const translations = {
  en: {
    title: 'Base Polls',
    subtitle: 'Vote on today\'s poll!',
    question: 'What do you think will be the most important trend for the Base ecosystem in 2025?',
    options: [
      { id: 'a', text: 'Decentralized Social (SocialFi)' },
      { id: 'b', text: 'On-chain Gaming' },
      { id: 'c', text: 'Layer 3 Solutions' },
      { id: 'd', text: 'Real World Assets (RWA)' },
    ],
    votedMessage: 'Thank you for voting!',
    langToggle: 'TR', // Şu anki dil EN iken gösterilecek buton
  },
  tr: {
    title: 'Base Polls',
    subtitle: 'Günün anketine katılın!',
    question: 'Sizce 2025\'te Base ekosistemi için en önemli gelişme ne olacak?',
    options: [
      { id: 'a', text: 'Merkeziyetsiz Sosyal Medya (SocialFi)' },
      { id: 'b', text: 'Zincir Üstü Oyun (On-chain Gaming)' },
      { id: 'c', text: 'Layer 3 Çözümleri' },
      { id: 'd', text: 'Gerçek Dünya Varlıkları (RWA)' },
    ],
    votedMessage: 'Oyunuz alındı, teşekkürler!',
    langToggle: 'EN', // Şu anki dil TR iken gösterilecek buton
  }
};

type Language = 'en' | 'tr';

export default function BasePollsPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en'); // Varsayılan dil İngilizce

  const t = translations[lang]; // Aktif dilin çevirilerini al

  const handleVote = (optionId: string) => {
    setSelectedOption(optionId);
    console.log("Voted:", optionId);
    // TODO: AŞAMA 8'de buraya on-chain oylama fonksiyonu gelecek
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'tr' : 'en');
  };

  return (
    // 2. Ana Arkaplan: 'bg-background' (CSS değişkeninden gelir)
    //    Metin Rengi: 'text-foreground' (CSS değişkeninden gelir)
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      
      {/* 3. Kart Arkaplanı: 'bg-card' (CSS değişkeni) */}
      <div className="w-full max-w-md p-6 bg-card rounded-lg border border-border shadow-xl relative">
        
        {/* Dil Değiştirme Butonu: 'bg-secondary' ve 'text-secondary-foreground' */}
        <button
          onClick={toggleLanguage}
          className="absolute top-4 right-4 bg-secondary text-secondary-foreground hover:bg-muted font-semibold py-1 px-3 rounded-md text-sm"
        >
          {t.langToggle}
        </button>

        {/* 4. Başlık: Sizin 'base-blue-600' renginizi kullanıyoruz */}
        <div className="text-center mb-6 pt-4">
          <h1 className="text-3xl font-bold text-base-blue-600">{t.title}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle}</p>
        </div>

        {/* Anket Bölümü */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-card-foreground">{t.question}</h2>
          
          {/* 5. Anket Seçenekleri (Tema Değişkenlerine Uygun) */}
          <div className="flex flex-col space-y-3">
            {t.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                className={`w-full p-4 text-left font-medium border rounded-lg transition-all
                           ${selectedOption === option.id 
                             // Seçili Buton: Sizin 'base-blue-600' renginiz
                             ? 'bg-base-blue-600 text-white border-base-blue-600 ring-2 ring-base-blue-400' 
                             // Seçili Olmayan Buton: 'bg-secondary'
                             : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'}
                           focus:outline-none focus:ring-2 focus:ring-base-blue-400`}
              >
                {option.text}
              </button>
            ))}
          </div>

          {/* 6. Oylama Sonrası Mesaj (Karanlık Mod) */}
          {selectedOption && (
            <div className="text-center p-3 mt-4 bg-green-900 text-green-100 border border-green-700 rounded-lg">
              {t.votedMessage}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}