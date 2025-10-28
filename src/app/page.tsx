'use client';
// Bu, "Base Polls" uygulamanızın ana sayfası olacak.
// Şablonun demo içeriğini tamamen kaldırıp
// yerine kendi anket arayüzümüzü koyuyoruz.

import React, { useState } from 'react';

// Anket verisi (şimdilik statik)
const poll = {
  id: 1,
  question: 'Sizce 2025\'te Base ekosistemi için en önemli gelişme ne olacak?',
  options: [
    { id: 'a', text: 'Merkeziyetsiz Sosyal Medya (SocialFi)' },
    { id: 'b', text: 'Zincir Üstü Oyun (On-chain Gaming)' },
    { id: 'c', text: 'Layer 3 Çözümleri' },
    { id: 'd', text: 'Gerçek Dünya Varlıkları (RWA)' },
  ],
};

export default function BasePollsPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Butona tıklandığında seçimi yöneten basit bir fonksiyon
  const handleVote = (optionId: string) => {
    setSelectedOption(optionId);
    // TODO: Sonraki aşamada bu oyu zincire (veya Farcaster'a) kaydet
    console.log("Oylandı:", optionId);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 text-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        
        {/* Başlık */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Base Polls</h1>
          <p className="text-gray-500 mt-1">Günün anketine katılın!</p>
        </div>

        {/* Anket Bölümü */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">{poll.question}</h2>
          
          {/* Anket Seçenekleri */}
          <div className="flex flex-col space-y-3">
            {poll.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                // Seçilen butonu vurgulamak için stil
                className={`w-full p-4 text-left font-medium border rounded-lg transition-all
                           ${selectedOption === option.id 
                             ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-500' 
                             : 'bg-white hover:bg-gray-50 hover:border-blue-500 text-gray-700'}
                           focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {option.text}
              </button>
            ))}
          </div>

          {/* Oylama sonrası mesaj */}
          {selectedOption && (
            <div className="text-center p-3 mt-4 bg-green-100 text-green-800 rounded-lg">
              Oyunuz alındı, teşekkürler!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}