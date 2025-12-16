'use client';

import React, { useState, useEffect, useMemo } from 'react';

// Gerekli tüm importlar
import { 
  useAccount, 
  useConnect, 
  useReadContract, 
  useReadContracts, 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  useDisconnect 
} from 'wagmi';

// Göreceli yollar kullanıyoruz
import { useFrameContext } from '../components/providers/FrameProvider';
import { contractAddress, contractAbi } from '../lib/abi'; 
import { Address } from 'viem';
import { Connector } from '@wagmi/core';
import Image from 'next/image';

// Anket verilerini import ediyoruz
import { getDailyPoll, PollData } from '../lib/polls';

// Dil çevirileri
const translations = {
  en: {
    title: 'Base Polls',
    subtitle: 'Daily Crypto & Base Ecosystem Polls',
    votedMessage: 'Thank you for voting! Here are the results:',
    langToggle: 'TR',
    connectWallet: 'Connecting Wallet...',
    walletConnected: 'Wallet Connected',
    walletDisconnected: 'Wallet Disconnected. Connect via menu.', 
    checkVoteStatus: 'Loading poll status...',
    alreadyVoted: 'You have already voted. Results below:',
    notVoted: 'You have not voted in this poll yet.',
    voteSuccess: 'Vote recorded on-chain!',
    voteConfirming: 'Confirming vote on-chain...',
    voteFailed: 'Vote failed. Please try again.',
    voteProcessing: 'Submitting vote...',
    submitVoteButton: 'Submit Vote',
    profile: 'Profile',
    fid: 'FID',
    disconnect: 'Disconnect',
    connectWalletButton: 'Connect Wallet', 
    loadingPoll: "Loading today's poll...",
    votes: 'votes'
  },
  tr: {
    title: 'Base Polls',
    subtitle: 'Günlük Kripto ve Base Ekosistem Anketleri',
    votedMessage: 'Oyunuz alındı, teşekkürler! İşte sonuçlar:',
    langToggle: 'EN',
    connectWallet: 'Cüzdan Bağlanıyor...',
    walletConnected: 'Cüzdan Bağlandı',
    walletDisconnected: 'Cüzdan bağlı değil. Menüden bağlanın.', 
    checkVoteStatus: 'Anket durumu yükleniyor...',
    alreadyVoted: 'Zaten oy verdiniz. Sonuçlar aşağıda:',
    notVoted: 'Bu ankete henüz oy vermediniz.',
    voteSuccess: 'Oy zincire kaydedildi!',
    voteConfirming: 'Oy zincirde onaylanıyor...',
    voteFailed: 'Oylama başarısız. Lütfen tekrar deneyin.',
    voteProcessing: 'Oy gönderiliyor...',
    submitVoteButton: 'Oy Ver',
    profile: 'Profil',
    fid: 'FID',
    disconnect: 'Bağlantıyı Kes',
    connectWalletButton: 'Cüzdan Bağla',
    loadingPoll: "Günün anketini yüklüyor...",
    votes: 'oy'
  }
};

type Language = 'en' | 'tr';
type VoteStatus = 'idle' | 'loading' | 'success' | 'failed' | 'confirming' | 'processing';

// Yükleme Ekranı
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

export default function BasePollsPage() {
  const [appLoading, setAppLoading] = useState(true); 
  const [lang, setLang] = useState<Language>('en');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>('idle');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [initialAutoConnectAttempted, setInitialAutoConnectAttempted] = useState(false);
  const [manualDisconnect, setManualDisconnect] = useState(false);

  // YENİ STATE: Günlük anket verisini tutacak
  const [dailyPoll, setDailyPoll] = useState<PollData | null>(null);

  const t = translations[lang];

  // Sayfa yüklendiğinde bugünün anketini getir
  useEffect(() => {
    const poll = getDailyPoll();
    setDailyPoll(poll);
  }, []);

  const { connect, connectors } = useConnect();
  const { address, isConnected, isConnecting } = useAccount(); 
  const { disconnect } = useDisconnect();
  
  const frameContext = useFrameContext();

  // 1. KULLANICININ OY DURUMU
  const pollId = dailyPoll ? BigInt(dailyPoll.id) : BigInt(0);

  const { data: hasVotedData, isLoading: isLoadingHasVoted, refetch: refetchHasVoted } = useReadContract({
    address: contractAddress as Address,
    abi: contractAbi,
    functionName: 'hasVoted',
    args: [pollId, address as Address],
    query: { enabled: !!address && !!dailyPoll },
  });

  // Oylama işlemi durumu
  const { data: hash, writeContract, isPending: isVoteProcessing } = useWriteContract();
  const { isLoading: isVoteConfirming, isSuccess: isVoteSuccess } = useWaitForTransactionReceipt({ hash });

  // İyimser Oy Kontrolü
  const hasVoted = hasVotedData || isVoteSuccess;

  // 2. TÜM SEÇENEKLERİN OY SAYILARINI ÇEKME
  const { data: voteCountsData, refetch: refetchVotes } = useReadContracts({
    contracts: dailyPoll?.options[lang].map((_, index) => ({
      address: contractAddress as Address,
      abi: contractAbi,
      functionName: 'getVoteCount',
      args: [pollId, BigInt(index)],
    })) || [], 
    query: { enabled: !!dailyPoll },
  });

  // 3. YÜZDE HESAPLAMA MANTIĞI
  const results = useMemo(() => {
    if (!voteCountsData || !dailyPoll) return null;

    let counts = voteCountsData.map((res) => (res.status === 'success' ? Number(res.result) : 0));
    
    // OPTIMISTIC UPDATE
    if (isVoteSuccess && selectedOption !== null && !hasVotedData) {
      counts[selectedOption] = (counts[selectedOption] || 0) + 1;
    }

    const totalVotes = counts.reduce((a, b) => a + b, 0);

    return dailyPoll.options[lang].map((text, index) => {
      const count = counts[index] || 0;
      const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
      return {
        id: index,
        text,
        count,
        percentage,
      };
    });
  }, [voteCountsData, dailyPoll, lang, isVoteSuccess, selectedOption, hasVotedData]);


  // Yükleme Durumu
  useEffect(() => {
    if (!dailyPoll) return;
    const isLoading = isConnecting || (isConnected && isLoadingHasVoted);
    if (!isLoading) {
      const timer = setTimeout(() => {
        setAppLoading(false);
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [isConnecting, isConnected, isLoadingHasVoted, dailyPoll]);

  // Cüzdan Bağlama
  useEffect(() => {
    const autoConnect = async () => {
      if (!isConnected && !isConnecting && !initialAutoConnectAttempted && !manualDisconnect && connectors.length > 0) {
        setInitialAutoConnectAttempted(true); 
        const farcasterConnector = connectors.find((c: Connector) => c.id === 'farcasterMiniApp');
        if (farcasterConnector) {
          await connect({ connector: farcasterConnector });
        }
      }
    };
    autoConnect();
  }, [connect, connectors, initialAutoConnectAttempted, isConnected, isConnecting, manualDisconnect]); 

  // Oylama Buton İşlemleri
  const handleSelectOption = (optionId: number) => {
    if (hasVoted || isVoteSuccess || isVoteProcessing || isVoteConfirming) return;
    setSelectedOption(optionId);
  };

  const handleSubmitVote = () => {
    if (selectedOption === null || !address || !dailyPoll) return;
    setVoteStatus('loading');
    writeContract({
      address: contractAddress as Address,
      abi: contractAbi,
      functionName: 'vote',
      args: [BigInt(dailyPoll.id), BigInt(selectedOption)],
    });
  };

  // İşlem Durumu İzleme
  useEffect(() => {
    if (isVoteProcessing) setVoteStatus('processing');
    else if (isVoteConfirming) setVoteStatus('confirming');
    else if (isVoteSuccess) {
      setVoteStatus('success');
      refetchHasVoted();
      refetchVotes();
      
      const timer1 = setTimeout(() => { refetchHasVoted(); refetchVotes(); }, 2000);
      const timer2 = setTimeout(() => { refetchHasVoted(); refetchVotes(); }, 5000);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [isVoteProcessing, isVoteConfirming, isVoteSuccess, refetchHasVoted, refetchVotes]);

  // Menü Fonksiyonları
  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'tr' : 'en');
  };
  
  // DÜZELTME: Bağlantıyı kesince, UI'ın da sıfırlanmasını istiyoruz.
  const handleDisconnect = () => {
    disconnect();
    setManualDisconnect(true); 
    setIsDropdownOpen(false);
    setSelectedOption(null); // Seçimi temizle
    setVoteStatus('idle');   // Oy durumunu temizle
  };

  const handleConnect = async () => {
    setIsDropdownOpen(false);
    let connector = connectors.find((c: Connector) => c.id === 'injected');
    if (!connector) connector = connectors.find((c: Connector) => c.id === 'coinbaseWallet'); 
    if (!connector) connector = connectors.find((c: Connector) => c.id === 'farcasterMiniApp');
    
    if (connector) {
      await connect({ connector }); 
      setManualDisconnect(false); 
    }
  };

  // Profil verileri (FrameProvider'dan)
  const user = (frameContext?.context as any)?.user; 
  const pfpUrl = user?.pfpUrl;
  const displayName = user?.displayName;
  const fid = user?.fid;

  // --- RENDER ---
  // Cüzdan bağlı değilse (isConnected: false), sonuçları ASLA gösterme.
  const showResults = isConnected && (hasVoted);

  const StatusMessage = () => {
    if (isConnecting) return <p className="text-amber-400">{t.connectWallet}</p>; 
    if (!isConnected) return <p className="text-red-400">{t.walletDisconnected}</p>;
    if (isLoadingHasVoted) return <p className="text-gray-400">{t.checkVoteStatus}</p>;
    if (isVoteProcessing) return <p className="text-blue-400">{t.voteProcessing}</p>;
    if (isVoteConfirming) return <p className="text-blue-400">{t.voteConfirming}</p>;
    if (isVoteSuccess) return <p className="text-green-400">{t.voteSuccess}</p>;
    if (hasVoted === true) return <p className="text-green-400">{t.alreadyVoted}</p>;
    return <p className="text-green-400">{t.walletConnected}</p>;
  };
  
  if (appLoading && !initialAutoConnectAttempted) { 
    return <LoadingScreen lang={lang} />;
  }

  // Eğer anket verisi yüklenmediyse
  if (!dailyPoll) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="w-full max-w-md p-6 bg-card rounded-lg border border-border shadow-xl relative">
        
        {/* --- Menü --- */}
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
            <div className="absolute top-12 right-0 w-72 bg-card border border-border rounded-lg shadow-lg z-10 py-2">
              {isConnected && fid && (
                <div className="px-4 py-3 border-b border-border flex items-center space-x-3">
                  {pfpUrl && (
                    <Image src={pfpUrl} alt="PFP" width={40} height={40} className="rounded-full" />
                  )}
                  <div>
                    <p className="font-bold text-base-blue-600 truncate">{displayName || t.profile}</p>
                    <p className="text-sm text-muted-foreground">{t.fid}: {fid}</p>
                  </div>
                </div>
              )}
              <div className="px-4 py-3 border-b border-border">
                <div className="flex space-x-2">
                  <button onClick={() => { setLang('tr'); setIsDropdownOpen(false); }} className={`flex-1 p-2 rounded-md text-sm font-medium ${lang === 'tr' ? 'bg-base-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}>TR Türkçe</button>
                  <button onClick={() => { setLang('en'); setIsDropdownOpen(false); }} className={`flex-1 p-2 rounded-md text-sm font-medium ${lang === 'en' ? 'bg-base-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}>EN English</button>
                </div>
              </div>
              {isConnected ? (
                <button onClick={handleDisconnect} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-muted flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  <span>{t.disconnect}</span>
                </button>
              ) : (
                <button onClick={handleConnect} className="w-full text-left px-4 py-3 text-sm text-green-500 hover:bg-muted">{t.connectWalletButton}</button>
              )}
            </div>
          )}
        </div>

        <div className="text-center mb-6 pt-12"> 
          <h1 className="text-3xl font-bold text-base-blue-600">{t.title}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          {/* <p className="text-xs text-muted-foreground mt-2 opacity-60">Poll ID: {dailyPoll.id}</p> */}
        </div>

        <div className="text-center p-3 mb-4 bg-secondary rounded-lg border border-border">
          <StatusMessage />
        </div>

        {/* --- DİNAMİK ANKET SORUSU VE SEÇENEKLER --- */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            {/* Soruyu dailyPoll verisinden alıyoruz */}
            {dailyPoll.question[lang]}
          </h2>
          
          {/* EKRAN KONTROLÜ: Cüzdan bağlıysa ve oy verdiyse sonuçları göster */}
          {showResults && results ? (
            <div className="flex flex-col space-y-4">
              {results.map((result) => (
                <div key={result.id} className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{result.text}</span>
                    <span className="text-muted-foreground">{result.percentage}% ({result.count} {t.votes})</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-base-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${result.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="text-center p-3 mt-4 bg-green-900/20 text-green-400 border border-green-900/50 rounded-lg text-sm">
                {t.votedMessage}
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col space-y-3">
                {/* Seçenekleri dailyPoll verisinden alıyoruz */}
                {dailyPoll.options[lang].map((optionText, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    disabled={!isConnected || isVoteProcessing || isVoteConfirming}
                    className={`w-full p-4 text-left font-medium border rounded-lg transition-all
                              ${selectedOption === index 
                                ? 'bg-base-blue-600 text-white border-base-blue-600 ring-2 ring-base-blue-400' 
                                : 'bg-secondary text-secondary-foreground border-border'}
                              ${(!isConnected || isVoteProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}
                              focus:outline-none focus:ring-2 focus:ring-base-blue-400`}
                  >
                    {optionText}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmitVote}
                disabled={!isConnected || selectedOption === null || isVoteProcessing || isVoteConfirming}
                className={`w-full p-4 mt-4 font-bold text-lg rounded-lg transition-all
                          ${(!isConnected || selectedOption === null || isVoteProcessing || isVoteConfirming)
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}