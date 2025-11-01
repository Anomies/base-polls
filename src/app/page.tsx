'use client';

import React, { useState, useEffect } from 'react';

// Gerekli tüm importlar
import { useAccount, useConnect, useReadContract, useWriteContract, useWaitForTransactionReceipt, useDisconnect } from 'wagmi';
import { useProfile } from '@farcaster/auth-kit';
import { contractAddress, contractAbi } from '~/lib/abi'; 
import { Address } from 'viem';
import { Connector } from '@wagmi/core';
import Image from 'next/image'; // Profil resmi için

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
    loadingPoll: "Günün anketini yüklüyor...",
  }
};

type Language = 'en' | 'tr';
const CURRENT_POLL_ID = 1;
type VoteStatus = 'idle' | 'loading' | 'success' | 'failed' | 'confirming' | 'processing';


// --- Yükleme Ekranı Bileşeni ---
const LoadingScreen = ({ lang }: { lang: Language }) => (
  <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
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
  const [appLoading, setAppLoading] = useState(true); 
  const [lang, setLang] = useState<Language>('en');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>('idle');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // HATA DÜZELTME: Bu state'i kaldırıyoruz, 'useEffect'i basitleştiriyoruz
  // const [manualDisconnect, setManualDisconnect] = useState(false);
  
  // YENİ STATE: İlk otomatik bağlantı denemesi yapıldı mı?
  const [initialAutoConnectAttempted, setInitialAutoConnectAttempted] = useState(false);

  const t = translations[lang];

  // --- Cüzdan Hook'ları ---
  const { connect, connectors } = useConnect();
  const { address, isConnected, isConnecting } = useAccount(); 
  const { disconnect } = useDisconnect();
  const { isAuthenticated, profile } = useProfile();

  // --- Sözleşme Hook'ları ---
  const { data: hasVoted, isLoading: isLoadingHasVoted } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'hasVoted',
    args: [BigInt(CURRENT_POLL_ID), address as Address],
    query: { enabled: !!address },
  });

  // --- Yükleme Durumu Effect'i ---
  useEffect(() => {
    // isConnecting (cüzdan bağlanıyor) VEYA isLoadingHasVoted (oy durumu yükleniyor)
    const isLoading = isConnecting || (isConnected && isLoadingHasVoted);
    
    if (!isLoading) {
      // Veri yüklendi, ancak animasyonun pürüzsüz görünmesi için 
      // en az 1.5 saniye bekleyelim.
      const timer = setTimeout(() => {
        setAppLoading(false);
      }, 1500); 

      return () => clearTimeout(timer);
    }
  }, [isConnecting, isConnected, isLoadingHasVoted]);


  // --- GÜNCELLENMİŞ Cüzdan Bağlama useEffect'i ---
  useEffect(() => {
    const autoConnect = async () => {
      // Sadece bir kez, sayfa ilk yüklendiğinde
      if (!isConnected && !isConnecting && !initialAutoConnectAttempted && connectors.length > 0) {
        setInitialAutoConnectAttempted(true); // Denemeyi işaretle
        
        // Sadece Farcaster cüzdanını (in-app) otomatik bağlamayı dene
        const farcasterConnector = connectors.find((c: Connector) => c.id === 'farcasterMiniApp');
        if (farcasterConnector) {
          await connect({ connector: farcasterConnector });
        }
      }
    };
    autoConnect();
  // 'isConnected' ve 'isConnecting'i dependency'lerden kaldırıyoruz
  // Bu sayede sadece 'connectors' dizisi hazır olduğunda 1 kez çalışır
  }, [connect, connectors, initialAutoConnectAttempted]); 
  // --- Cüzdan Bağlama useEffect'i SONU ---


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
  useEffect(() => {
    if (isVoteProcessing) setVoteStatus('processing');
    else if (isVoteConfirming) setVoteStatus('confirming');
    else if (isVoteSuccess) setVoteStatus('success');
  }, [isVoteProcessing, isVoteConfirming, isVoteSuccess]);

  // --- GÜNCELLENMİŞ MENÜ FONKSİYONLARI ---
  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'tr' : 'en');
  };
  
  const handleDisconnect = () => {
    disconnect();
    // 'manualDisconnect' state'ini artık kullanmıyoruz
    setIsDropdownOpen(false);
  };

  // BU FONKSİYON ARTIK 'useEffect' İLE ÇAKIŞMAYACAK
  const handleConnect = async () => {
    setIsDropdownOpen(false);
    
    // Tarayıcıda olduğumuzu varsayarak, harici cüzdanları (tarayıcı eklentileri) ara
    let connector = connectors.find((c: Connector) => c.id === 'injected'); // MetaMask, Rabby vb.
    
    if (!connector) {
      connector = connectors.find((c: Connector) => c.id === 'coinbaseWallet'); 
    }
    
    // Harici cüzdan bulamazsa, son çare Farcaster'ı (in-app) tekrar dene
    if (!connector) {
      connector = connectors.find((c: Connector) => c.id === 'farcasterMiniApp');
    }

    if (connector) {
      await connect({ connector }); 
    } else {
      console.error("Bağlanacak uygun bir cüzdan konektörü bulunamadı.");
    }
  };
  // --- MENÜ FONKSİYONLARI SONU ---

  const hasAlreadyVotedOrIsProcessing = !isConnected || isLoadingHasVoted || isVoteProcessing || isVoteConfirming || isVoteSuccess || hasVoted;
  const submitButtonDisabled = hasAlreadyVotedOrIsProcessing || selectedOption === null;

  // Durum Mesajı Bileşeni
  const StatusMessage = () => {
    if (isConnecting) return <p className="text-amber-400">{t.connectWallet}</p>; 
    if (!isConnected) return <p className="text-red-400">{t.walletDisconnected}</p>; // Artık 'manualDisconnect'e bakmıyoruz
    if (isLoadingHasVoted) return <p className="text-gray-400">{t.checkVoteStatus}</p>;
    if (isVoteProcessing) return <p className="text-blue-400">{t.voteProcessing}</p>;
    if (isVoteConfirming) return <p className="text-blue-400">{t.voteConfirming}</p>;
    if (isVoteSuccess) return <p className="text-green-400">{t.voteSuccess}</p>;
    if (hasVoted === true) return <p className="text-green-400">{t.alreadyVoted}</p>;
    if (hasVoted === false) return <p className="text-gray-300">{t.notVoted}</p>;
    return <p className="text-green-400">{t.walletConnected}</p>;
  };
  
  if (appLoading && !initialAutoConnectAttempted) { // 'initialAutoConnectAttempted' kontrolü eklendi
    return <LoadingScreen lang={lang} />;
  }

  // --- ANA RENDER (Menü Güncellendi) ---
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="w-full max-w-md p-6 bg-card rounded-lg border border-border shadow-xl relative">
        
        {/* --- Profil Menüsü --- */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-base-blue-500"
          >
            {/* Hamburger İkonu (SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-12 right-0 w-72 bg-card border border-border rounded-lg shadow-lg z-10 py-2">
              
              {isConnected && isAuthenticated && (
                <div className="px-4 py-3 border-b border-border flex items-center space-x-3">
                  {/* Profil Resmi */}
                  {profile?.pfpUrl && (
                    <Image 
                      src={profile.pfpUrl}
                      alt="PFP"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  {/* İsim ve FID */}
                  <div>
                    <p className="font-bold text-base-blue-600 truncate">{profile?.displayName || t.profile}</p>
                    {profile?.fid && (
                      <p className="text-sm text-muted-foreground">{t.fid}: {profile.fid}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Dil Değiştirme */}
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">Language</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setLang('tr'); setIsDropdownOpen(false); }}
                    className={`flex-1 p-2 rounded-md text-sm font-medium ${lang === 'tr' ? 'bg-base-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    TR Türkçe
                  </button>
                  <button
                    onClick={() => { setLang('en'); setIsDropdownOpen(false); }}
                    className={`flex-1 p-2 rounded-md text-sm font-medium ${lang === 'en' ? 'bg-base-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    EN English
                  </button>
                </div>
              </div>
              
              {/* Cüzdan durumuna göre buton */}
              {isConnected ? (
                <button
                  onClick={handleDisconnect}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-muted flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  <span>{t.disconnect}</span>
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

        <div className="text-center p-3 mb-4 bg-secondary rounded-lg border border-border">
          <StatusMessage />
        </div>

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