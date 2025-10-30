'use client';

// 1. GEREKLİ IMPORT'LARI EKLEME
import React, { useState, useEffect } from 'react';
// Wagmi hook'larını (araçlarını) import ediyoruz
// HATA DÜZELTMESİ: Projenizin wagmi v2 yapısında olduğunu varsayarak,
// hook'ların 'wagmi/react' yolundan gelmesi gerekir.
// Bir önceki denemelerde 'wagmi' ve 'wagmi/react' yolları arasında
// bir çözümleme hatası döngüsüne girdik. Bu, projenizin 'wagmi'
// kurulumunun v1 ve v2 arasında bir yapıda olduğunu gösteriyor olabilir.
// Tekrar 'wagmi' ana paketini deniyoruz.
import { useAccount, useConnect } from 'wagmi';


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
    langToggle: 'TR',
    // Yeni eklenen cüzdan durumları
    walletConnected: 'Wallet Connected',
    walletConnecting: 'Connecting Wallet...',
    walletDisconnected: 'Wallet Disconnected. Please connect in Farcaster.',
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
    langToggle: 'EN',
    // Yeni eklenen cüzdan durumları
    walletConnected: 'Cüzdan Bağlandı',
    walletConnecting: 'Cüzdan Bağlanıyor...',
    walletDisconnected: 'Cüzdan Bağlı Değil. Lütfen Farcaster\'dan bağlayın.',
  }
};

type Language = 'en' | 'tr';

export default function BasePollsPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');

  const t = translations[lang];

  // 3. WAGMI HOOK'LARINI KULLANMA
  const { address, status } = useAccount(); // Cüzdan adresini ve bağlantı durumunu alır
  const { connectors, connect } = useConnect(); // Bağlantı fonksiyonunu ve mevcut bağlayıcıları alır

  // 4. OTOMATİK CÜZDAN BAĞLAMA
  useEffect(() => {
    // Eğer cüzdan bağlı değilse ve bağlayıcılar yüklendiyse
    if (status === 'disconnected' && connectors.length > 0) {
      // Farcaster'ın sağladığı bağlayıcıyı (connector) bul
      const farcasterConnector = connectors.find(c => c.id === 'farcaster');

      if (farcasterConnector) {
        // Otomatik olarak bağlanmayı dene
        connect({ connector: farcasterConnector });
      }
    }
  }, [status, connectors, connect]); // Bu hook, durum değiştikçe tekrar çalışır


  const handleVote = (optionId: string) => {
    // Cüzdan bağlı değilse oylama yapma
    if (status !== 'connected') {
      console.error("Cüzdan bağlı değil!");
      return;
    }
    
    setSelectedOption(optionId);
    console.log("Voted:", optionId, "by address:", address);
    // TODO: AŞAMA 8'de buraya on-chain oylama fonksiyonu gelecek
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'tr' : 'en');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="w-full max-w-md p-6 bg-card rounded-lg border border-border shadow-xl relative">
        
        <button
          onClick={toggleLanguage}
          className="absolute top-4 right-4 bg-secondary text-secondary-foreground hover:bg-muted font-semibold py-1 px-3 rounded-md text-sm"
        >
          {t.langToggle}
        </button>

        <div className="text-center mb-6 pt-4">
          <h1 className="text-3xl font-bold text-base-blue-600">{t.title}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle}</p>
        </div>

        {/* 5. CÜZDAN DURUMUNU GÖSTEREN BÖLÜM */}
        <div className="text-center mb-4 p-3 rounded-lg border border-border bg-secondary">
          {status === 'connected' && (
            <div className="text-green-400">
              <p className="font-semibold">{t.walletConnected}</p>
              {/* Cüzdan adresini göster */}
              <p className="text-xs text-muted-foreground truncate" title={address}>{address}</p>
            </div>
          )}
          {status === 'connecting' && (
            <p className="text-yellow-400">{t.walletConnecting}</p>
          )}
          {status === 'disconnected' && (
            <p className="text-red-400">{t.walletDisconnected}</p>
          )}
        </div>

        {/* Anket Bölümü */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-card-foreground">{t.question}</h2>
          
          <div className="flex flex-col space-y-3">
            {t.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                // 6. CÜZDAN BAĞLI DEĞİLSE VEYA OY KULLANILDIYSA BUTONLARI DEVRE DIŞI BIRAK
                disabled={status !== 'connected' || !!selectedOption}
                className={`w-full p-4 text-left font-medium border rounded-lg transition-all
                           ${selectedOption === option.id 
                             ? 'bg-base-blue-600 text-white border-base-blue-600 ring-2 ring-base-blue-400' 
                             : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'}
                           focus:outline-none focus:ring-2 focus:ring-base-blue-400
                           ${(status !== 'connected' || !!selectedOption) ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
              >
                {option.text}
              </button>
            ))}
          </div>

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


