'use client';

import React, { useState, useEffect } from 'react';

// Gerekli tüm importlar
import { useAccount, useConnect, useReadContract, useWriteContract, useWaitForTransactionReceipt, useDisconnect } from 'wagmi';
import { useProfile } from '@farcaster/auth-kit';
import { contractAddress, contractAbi } from '~/lib/abi'; 
import { Address } from 'viem';
import { Connector } from '@wagmi/core';

// Dil çevirileri (Aynı kaldı)
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
    // Cüzdan Durumları
    connectWallet: 'Connecting Wallet...',
    walletConnected: 'Wallet Connected',
    walletDisconnected: 'Wallet Disconnected. Connect via menu.', 
    checkVoteStatus: 'Loading poll status...',
    alreadyVoted: 'You have already voted in this poll.',
    notVoted: 'You have not voted in this poll yet.',
    voteSuccess: 'Vote recorded on-chain!',
    voteConfirming: 'Confirming vote on-chain...',
    voteFailed: 'Vote failed. Please try again.',
    voteProcessing: 'Submitting vote...',
    submitVoteButton: 'Submit Vote',
    // Menü
    profile: 'Profile',
    fid: 'FID',
    disconnect: 'Disconnect',
    connectWalletButton: 'Connect Wallet',
    // YENİ: Yükleme ekranı
    loadingPoll: "Loading today's poll...", 
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
    // Cüzdan Durumları
    connectWallet: 'Cüzdan Bağlanıyor...',
    walletConnected: 'Cüzdan Bağlandı',
    walletDisconnected: 'Cüzdan bağlı değil. Menüden bağlanın.', 
    checkVoteStatus: 'Anket durumu yükleniyor...',
    alreadyVoted: 'Bu ankete zaten oy verdiniz.',
    notVoted: 'Bu ankete henüz oy vermediniz.',
    voteSuccess: 'Oy zincire kaydedildi!',
    voteConfirming: 'Oy zincirde onaylanıyor...',
    voteFailed: 'Oylama başarısız. Lütfen tekrar deneyin.',
    voteProcessing: 'Oy gönderiliyor...',
    submitVoteButton: 'Oy Ver',
    // Menü
    profile: 'Profil',
    fid: 'FID',
    disconnect: 'Bağlantıyı Kes',
    connectWalletButton: 'Cüzdan Bağla',
    // YENİ: Yükleme ekranı
    loadingPoll: "Günün anketini yüklüyor...",
  }
};

type Language = 'en' | 'tr';
const CURRENT_POLL_ID = 1;
type VoteStatus = 'idle' | 'loading' | 'success' | 'failed' | 'confirming' | 'processing';


// --- YENİ: Yükleme Ekranı Bileşeni ---
// 'lang' prop'u alarak yükleme metnini de çevirebilir
const LoadingScreen = ({ lang }: { lang: Language }) => (
  <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
    {/* Basit bir 'pulse' (atma) animasyonu */}
    <div className="animate-pulse"> 
      <h1 className="text-5xl font-bold text-base-blue-600">Base Polls</h1>
    </div>
    <p className="text-muted-foreground mt-4">
      {lang === 'en' ? translations.en.loadingPoll : translations.tr.loadingPoll}
    </p>
  </main>
);
// --- Yükleme Ekranı Sonu ---


export default function BasePollsPage() {
  // YENİ: Ana uygulama yükleme durumu
  const [appLoading, setAppLoading] = useState(true); 
  
  const [lang, setLang] = useState<Language>('en');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>('idle');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [manualDisconnect, setManualDisconnect] = useState(false);

  const t = translations[lang];

  // --- Cüzdan Hook'ları ---
  const { connect, connectors } = useConnect();
  // 'isConnecting' cüzdanın bağlanma durumunu izlemek için
  const { address, isConnected, isConnecting } = useAccount(); 
  const { disconnect } = useDisconnect();
  const { isAuthenticated, profile } = useProfile();

  // --- Sözleşme Hook'ları ---
  // 'isLoadingHasVoted' anket durumunun yüklenmesini izlemek için
  const { data: hasVoted, isLoading: isLoadingHasVoted } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'hasVoted',
    args: [BigInt(CURRENT_POLL_ID), address as Address],
    query: { enabled: !!address },
  });

  // --- YENİ: Ana Yükleme Durumu Effect'i ---
  useEffect(() => {
    // Cüzdanın bağlanmasını VE ilk anket durumunun yüklenmesini bekliyoruz
    // (veya cüzdan bağlı değilse 'isConnecting' false olur)
    const dataLoaded = !isConnecting && !isLoadingHasVoted;

    if (dataLoaded) {
      // Veri yüklendi, ancak animasyonun pürüzsüz görünmesi için 
      // en az 1.5 saniye bekleyelim.
      const timer = setTimeout(() => {
        setAppLoading(false);
      }, 1500); // Minimum 1.5 saniye yükleme ekranı

      return () => clearTimeout(timer);
    }
    // Veri yüklenmediyse 'appLoading' true kalır
  }, [isConnecting, isLoadingHasVoted]);
  // --- Yükleme Effect'i Sonu ---


  // Cüzdan bağlama useEffect'i
  useEffect(() => {
    const connectWallet = async () => {
      // YALNIZCA KULLANICI MANUEL ÇIKIŞ YAPMADIYSA OTOMATİK BAĞLAN
      if (!isConnected && !isConnecting && !manualDisconnect && connectors.length > 0) {
        const farcasterConnector = connectors.find((c: Connector) => c.id === 'farcasterMiniApp');
        if (farcasterConnector) {
          await connect({ connector: farcasterConnector });
        }
      }
    };
    connectWallet();
  }, [isConnected, isConnecting, connect, connectors, manualDisconnect]); // 'isConnecting' eklendi

  // ... (Diğer tüm fonksiyonlar aynı kalır) ...
  const { data: hash, writeContract, isPending: isVoteProcessing } = useWriteContract();
  const { isLoading: isVoteConfirming, isSuccess: isVoteSuccess } = useWaitForTransactionReceipt({ hash });

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

  useEffect(() => {
    if (isVoteProcessing) setVoteStatus('processing');
    else if (isVoteConfirming) setVoteStatus('confirming');
    else if (isVoteSuccess) setVoteStatus('success');
  }, [isVoteProcessing, isVoteConfirming, isVoteSuccess]);

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'tr' : 'en');
  };
  
  const handleDisconnect = () => {
    disconnect();
    setManualDisconnect(true); 
    setIsDropdownOpen(false);
  };

  const handleConnect = async () => {
    const farcasterConnector = connectors.find((c: Connector) => c.id === 'farcasterMiniApp');
    if (farcasterConnector) {
      await connect({ connector: farcasterConnector });
      setManualDisconnect(false); 
      setIsDropdownOpen(false);
    }
  };

  const hasAlreadyVotedOrIsProcessing = !isConnected || isLoadingHasVoted || isVoteProcessing || isVoteConfirming || isVoteSuccess || hasVoted;
  const submitButtonDisabled = hasAlreadyVotedOrIsProcessing || selectedOption === null;

  const StatusMessage = () => {
    // YENİ: Yükleme ekranı bittikten sonraki ara durumlar
    if (isConnecting) return <p className="text-amber-400">{t.connectWallet}</p>; 
    if (!isConnected && manualDisconnect) return <p className="text-red-400">{t.walletDisconnected}</p>;
    
    // Yükleme ekranı bittiğinde cüzdan bağlı değilse (otomatik bağlanma başarısız olduysa)
    if (!isConnected && !manualDisconnect && !isConnecting) return <p className="text-red-400">{t.walletDisconnected}</p>;

    // Cüzdan bağlandıktan sonraki durumlar
    if (isLoadingHasVoted) return <p className="text-gray-400">{t.checkVoteStatus}</p>;
    if (isVoteProcessing) return <p className="text-blue-400">{t.voteProcessing}</p>;
    if (isVoteConfirming) return <p className="text-blue-400">{t.voteConfirming}</p>;
    if (isVoteSuccess) return <p className="text-green-400">{t.voteSuccess}</p>;
    if (hasVoted === true) return <p className="text-green-400">{t.alreadyVoted}</p>;
    if (hasVoted === false) return <p className="text-gray-300">{t.notVoted}</p>;
    
    return <p className="text-green-400">{t.walletConnected}</p>;
  };

  // --- YENİ: Ana Render Mantığı ---
  if (appLoading) {
    return <LoadingScreen lang={lang} />; // Dil prop'unu yükleme ekranına iletiyoruz
  }
  // --- Yükleme Ekranı Render Sonu ---

  // appLoading 'false' ise, ana anket sayfasını göster
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="w-full max-w-md p-6 bg-card rounded-lg border border-border shadow-xl relative">
        
        {/* --- Profil Menüsü (Aynı kaldı) --- */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-base-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-12 right-0 w-64 bg-card border border-border rounded-lg shadow-lg z-10 py-2">
              
              {isConnected && isAuthenticated && (
                <>
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-bold text-base-blue-600 truncate">{profile?.displayName || t.profile}</p>
                    {profile?.fid && (
                      <p className="text-sm text-muted-foreground">{t.fid}: {profile.fid}</p>
                    )}
                    <p className="text-xs text-muted-foreground break-all mt-1">{address}</p>
                  </div>
                </>
              )}

              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">Language</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setLang('en'); setIsDropdownOpen(false); }}
                    className={`flex-1 p-2 rounded-md text-sm ${lang === 'en' ? 'bg-base-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLang('tr'); setIsDropdownOpen(false); }}
                    className={`flex-1 p-2 rounded-md text-sm ${lang === 'tr' ? 'bg-base-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    Türkçe
                  </button>
                </div>
              </div>
              
              {isConnected ? (
                <button
                  onClick={handleDisconnect}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-muted"
                >
                  {t.disconnect}
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  className="w-full text-left px-4 py-3 text-sm text-green-500 hover:bg-muted"
                >
                  {t.connectWalletButton}
                </button>
              )}
            </div>
          )}
        </div>
        {/* --- Profil Menüsü Sonu --- */}

        <div className="text-center mb-6 pt-12"> 
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