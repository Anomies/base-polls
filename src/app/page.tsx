'use client';

import React, { useState, useEffect } from 'react';

// HATA 1 DÜZELTME: Sizin de belirttiğiniz gibi, hook'lar 'wagmi' den geliyor
import { useAccount, useConnect, useReadContract, useWriteContract, useWaitForTransactionReceipt, useDisconnect } from 'wagmi';

// HATA 2 DÜZELTME: Doğru hook 'useProfile' (auth-kit'ten)
import { useProfile } from '@farcaster/auth-kit';

// HATA 3 DÜZELTME: Projenin 'tsconfig.json' dosyasında tanımlı olan alias ('~/') yolunu kullanıyoruz
import { contractAddress, contractAbi } from '~/lib/abi'; 
import { Address } from 'viem';

// HATA 4 DÜZELTME: Connector tipi '@wagmi/core' dan gelir
import { Connector } from '@wagmi/core';

// Dil çevirileri
const translations = {
  en: {
    title: 'Base Polls',
    subtitle: 'Vote on today\'s poll!',
    question: 'What do you think will be the most important trend for the Base ecosystem in 2025?',
    options: [
      { id: 0, text: 'Decentralized Social (SocialFi)' },
      { id: 1, text: 'On-chain Gaming' },
      { id: 2, text: 'Layer 3 Solutions' },
      { id: 3, text: 'Real World Assets (RWA)' },
    ],
    votedMessage: 'Thank you for voting!',
    langToggle: 'TR',
    // Cüzdan ve Oylama Durumları
    connectWallet: 'Connecting Wallet...',
    walletConnected: 'Wallet Connected',
    checkVoteStatus: 'Loading poll status...',
    alreadyVoted: 'You have already voted in this poll.',
    notVoted: 'You have not voted in this poll yet.',
    voteSuccess: 'Vote recorded on-chain!',
    voteConfirming: 'Confirming vote on-chain...',
    voteFailed: 'Vote failed. Please try again.',
    voteProcessing: 'Submitting vote...',
    submitVoteButton: 'Submit Vote',
    profile: 'Profile',
    fid: 'FID',
    disconnect: 'Disconnect',
  },
  tr: {
    title: 'Base Polls',
    subtitle: 'Günün anketine katılın!',
    question: 'Sizce 2025\'te Base ekosistemi için en önemli gelişme ne olacak?',
    options: [
      { id: 0, text: 'Merkeziyetsiz Sosyal Medya (SocialFi)' },
      { id: 1, text: 'Zincir Üstü Oyun (On-chain Gaming)' },
      { id: 2, text: 'Layer 3 Çözümleri' },
      { id: 3, text: 'Gerçek Dünya Varlıkları (RWA)' },
    ],
    votedMessage: 'Oyunuz alındı, teşekkürler!',
    langToggle: 'EN',
    // Cüzdan ve Oylama Durumları
    connectWallet: 'Cüzdan Bağlanıyor...',
    walletConnected: 'Cüzdan Bağlandı',
    checkVoteStatus: 'Anket durumu yükleniyor...',
    alreadyVoted: 'Bu ankete zaten oy verdiniz.',
    notVoted: 'Bu ankete henüz oy vermediniz.',
    voteSuccess: 'Oy zincire kaydedildi!',
    voteConfirming: 'Oy zincirde onaylanıyor...',
    voteFailed: 'Oylama başarısız. Lütfen tekrar deneyin.',
    voteProcessing: 'Oy gönderiliyor...',
    submitVoteButton: 'Oy Ver',
    profile: 'Profil',
    fid: 'FID',
    disconnect: 'Bağlantıyı Kes',
  }
};

type Language = 'en' | 'tr';
const CURRENT_POLL_ID = 1;
// 'processing' durumunu ekliyoruz (Aşama 8'deki hatayı çözmek için)
type VoteStatus = 'idle' | 'loading' | 'success' | 'failed' | 'confirming' | 'processing';

export default function BasePollsPage() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>('idle');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const t = translations[lang];

  // --- Cüzdan Hook'ları ---
  const { connect, connectors } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  
  // Farcaster kimliğini almak için DOĞRU hook'u kullanıyoruz
  // 'isAuthenticated' (kullanıcı profili yüklendi mi) ve 'profile' (kullanıcı verisi)
  const { isAuthenticated, profile } = useProfile();

  // Cüzdan bağlama useEffect'i
  useEffect(() => {
    const connectWallet = async () => {
      if (!isConnected && connectors.length > 0) {
        // 'c' parametresine 'Connector' tipini veriyoruz
        const farcasterConnector = connectors.find((c: Connector) => c.id === 'farcasterMiniApp');
        if (farcasterConnector) {
          await connect({ connector: farcasterConnector });
        }
      }
    };
    connectWallet();
  }, [isConnected, connect, connectors]);

  // --- Sözleşme Hook'ları ---
  const { data: hasVoted, isLoading: isLoadingHasVoted } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'hasVoted',
    args: [BigInt(CURRENT_POLL_ID), address as Address],
    query: { enabled: !!address },
  });

  const { data: hash, writeContract, isPending: isVoteProcessing } = useWriteContract();
  const { isLoading: isVoteConfirming, isSuccess: isVoteSuccess } = useWaitForTransactionReceipt({ hash });

  // Oylama Mantığı
  const handleSelectOption = (optionId: number) => {
    if (hasVoted || isVoteSuccess || isVoteProcessing || isVoteConfirming) return;
    setSelectedOption(optionId);
  };

  const handleSubmitVote = () => {
    if (selectedOption === null || !address) return;
    
    setVoteStatus('loading');
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'vote',
      args: [BigInt(CURRENT_POLL_ID), BigInt(selectedOption)],
    });
  };

  // Oylama durumunu izle
  useEffect(() => {
    if (isVoteProcessing) setVoteStatus('processing');
    else if (isVoteConfirming) setVoteStatus('confirming');
    else if (isVoteSuccess) setVoteStatus('success');
  }, [isVoteProcessing, isVoteConfirming, isVoteSuccess]);

  // Menü Fonksiyonları
  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'tr' : 'en');
    setIsDropdownOpen(false);
  };
  
  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  // Durum Değişkenleri
  const hasAlreadyVotedOrIsProcessing = !isConnected || isLoadingHasVoted || isVoteProcessing || isVoteConfirming || isVoteSuccess || hasVoted;
  const submitButtonDisabled = hasAlreadyVotedOrIsProcessing || selectedOption === null;

  // Durum Mesajı Bileşeni
  const StatusMessage = () => {
    if (!isConnected) return <p className="text-amber-400">{t.connectWallet}</p>;
    if (isLoadingHasVoted) return <p className="text-gray-400">{t.checkVoteStatus}</p>;
    if (isVoteProcessing) return <p className="text-blue-400">{t.voteProcessing}</p>;
    if (isVoteConfirming) return <p className="text-blue-400">{t.voteConfirming}</p>;
    if (isVoteSuccess) return <p className="text-green-400">{t.voteSuccess}</p>;
    if (hasVoted === true) return <p className="text-green-400">{t.alreadyVoted}</p>;
    if (hasVoted === false) return <p className="text-gray-300">{t.notVoted}</p>;
    return <p className="text-green-400">{t.walletConnected}</p>;
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="w-full max-w-md p-6 bg-card rounded-lg border border-border shadow-xl relative">
        
        {/* --- Profil Menüsü --- */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-base-blue-500"
          >
            {/* Profil İkonu (SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          
          {/* Açılır Menü (Tam kod) */}
          {isDropdownOpen && (
            <div className="absolute top-12 right-0 w-64 bg-card border border-border rounded-lg shadow-lg z-10 py-2">
              <div className="px-4 py-2 border-b border-border">
                {/* 'profile' hook'undan gelen veriyi kullan */}
                <p className="font-bold text-base-blue-600">{profile?.displayName || t.profile}</p>
                {profile?.fid && (
                  <p className="text-sm text-muted-foreground">{t.fid}: {profile.fid}</p>
                )}
              </div>
              <div className="px-4 py-2">
                <p className="text-xs text-muted-foreground break-all">{address}</p>
              </div>
              <button
                onClick={toggleLanguage}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
              >
                {t.langToggle === 'TR' ? 'Türkçe' : 'English'}
              </button>
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted"
              >
                {t.disconnect}
              </button>
            </div>
          )}
        </div>
        {/* --- Profil Menüsü Sonu --- */}

        <div className="text-center mb-6 pt-12"> {/* Menüye yer açmak için pt-12 */}
          <h1 className="text-3xl font-bold text-base-blue-600">{t.title}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle}</p>
        </div>

        {/* Durum Mesajları */}
        <div className="text-center p-3 mb-4 bg-secondary rounded-lg border border-border">
          <StatusMessage />
        </div>

        {/* Anket Bölümü */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-card-foreground">{t.question}</h2>
          
          <div className="flex flex-col space-y-3">
            {t.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={hasAlreadyVotedOrIsProcessing} 
                className={`w-full p-4 text-left font-medium border rounded-lg transition-all
                           ${selectedOption === option.id 
                             ? 'bg-base-blue-600 text-white border-base-blue-600 ring-2 ring-base-blue-400' 
                             : 'bg-secondary text-secondary-foreground border-border'}
                           ${hasAlreadyVotedOrIsProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}
                           focus:outline-none focus:ring-2 focus:ring-base-blue-400`}
              >
                {option.text}
              </button>
            ))}
          </div>

          {/* --- OY VER BUTONU --- */}
          <button
            onClick={handleSubmitVote}
            disabled={submitButtonDisabled}
            className={`w-full p-4 mt-4 font-bold text-lg rounded-lg transition-all
                       ${submitButtonDisabled 
                         ? 'bg-muted text-muted-foreground cursor-not-allowed'
                         : 'bg-base-blue-600 text-white hover:bg-base-blue-700'
                       }
                       focus:outline-none focus:ring-2 focus:ring-base-blue-400`}
          >
            {(isVoteProcessing || isVoteConfirming) 
              ? t.voteConfirming 
              : t.submitVoteButton
            }
          </button>
          
          {/* Oylama Başarılı Mesajı */}
          {isVoteSuccess && (
            <div className="text-center p-3 mt-4 bg-green-900 text-green-100 border border-green-700 rounded-lg">
              {t.votedMessage}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}