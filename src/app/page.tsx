'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  useAccount, 
  useConnect, 
  useReadContract, 
  useReadContracts, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useDisconnect 
} from 'wagmi';
import { contractAddress, contractAbi } from '../lib/abi'; 
import { Address } from 'viem';
import { Connector } from '@wagmi/core';
import { getDailyPoll, PollData } from '../lib/polls';

// Bileşenleri import ediyoruz
import LoadingScreen from '../components/ui/LoadingScreen';
import ProfileMenu from '../components/ui/ProfileMenu';
import SuggestionModal from '../components/ui/SuggestionModal';

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
    votes: 'votes',
    shareResult: 'Share on Warpcast',
    shareText: 'I just voted on Base Polls! Check it out:',
    suggestPoll: 'Suggest a Poll',
    suggestTitle: 'Suggest a Question',
    suggestDesc: 'Have a great idea? Send it to us!',
    questionLabel: 'Question',
    optionsLabel: 'Options (Separate with commas)',
    sendSuggestion: 'Send Suggestion',
    cancel: 'Cancel',
    placeholderQuestion: 'Ex: What is your favorite L2?',
    placeholderOptions: 'Ex: Optimism, Arbitrum, Base, ZkSync'
  },
  tr: {
    title: 'Base Polls',
    subtitle: 'Günlük Kripto ve Base Ekosistem Anketleri',
    votedMessage: 'Oyunuz alındı, teşekkürler! İşte sonuçlar:',
    langToggle: 'EN',
    connectWallet: 'Cüzdan Bağlanıyor...',
    walletConnected: 'Cüzdan Bağlandı',
    walletDisconnected: 'Cüzdan Bağlı Değil. Menüden bağlanın.', 
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
    disconnect: 'Çıkış Yap',
    connectWalletButton: 'Cüzdan Bağla',
    loadingPoll: "Günün anketi yükleniyor...",
    votes: 'oy',
    shareResult: 'Warpcast\'te Paylaş',
    shareText: 'Base Polls\'da oyumu kullandım! Göz at:',
    suggestPoll: 'Anket Öner',
    suggestTitle: 'Bir Soru Önerin',
    suggestDesc: 'Harika bir fikriniz mi var? Bize gönderin!',
    questionLabel: 'Soru',
    optionsLabel: 'Seçenekler (Virgülle ayırın)',
    sendSuggestion: 'Öneriyi Gönder',
    cancel: 'İptal',
    placeholderQuestion: 'Örn: Favori L2 ağınız hangisi?',
    placeholderOptions: 'Örn: Optimism, Arbitrum, Base, ZkSync'
  }
};

type Language = 'en' | 'tr';
const CURRENT_POLL_ID = 1;
type VoteStatus = 'idle' | 'loading' | 'success' | 'failed' | 'confirming' | 'processing';

export default function BasePollsPage() {
  const [appLoading, setAppLoading] = useState(true); 
  const [lang, setLang] = useState<Language>('en');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>('idle');
  const [initialAutoConnectAttempted, setInitialAutoConnectAttempted] = useState(false);
  const [manualDisconnect, setManualDisconnect] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [dailyPoll, setDailyPoll] = useState<PollData | null>(null);

  const t = translations[lang];

  useEffect(() => {
    const poll = getDailyPoll();
    setDailyPoll(poll);
  }, []);

  const { connect, connectors } = useConnect();
  const { address, isConnected, isConnecting } = useAccount(); 

  const pollId = dailyPoll ? BigInt(dailyPoll.id) : BigInt(0);

  const { data: hasVotedData, isLoading: isLoadingHasVoted, refetch: refetchHasVoted } = useReadContract({
    address: contractAddress as Address,
    abi: contractAbi,
    functionName: 'hasVoted',
    args: [pollId, address as Address],
    query: { enabled: !!address && !!dailyPoll },
  });

  const { data: hash, writeContract, isPending: isVoteProcessing } = useWriteContract();
  const { isLoading: isVoteConfirming, isSuccess: isVoteSuccess } = useWaitForTransactionReceipt({ hash });

  const hasVoted = hasVotedData || isVoteSuccess;

  const { data: voteCountsData, refetch: refetchVotes } = useReadContracts({
    contracts: dailyPoll?.options[lang].map((_, index) => ({
      address: contractAddress as Address,
      abi: contractAbi,
      functionName: 'getVoteCount',
      args: [pollId, BigInt(index)],
    })) || [], 
    query: { enabled: !!dailyPoll },
  });

  const results = useMemo(() => {
    if (!voteCountsData || !dailyPoll) return null;

    let counts = voteCountsData.map((res) => (res.status === 'success' ? Number(res.result) : 0));
    
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

  const handleShare = () => {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://base-polls.vercel.app';
    const text = encodeURIComponent(t.shareText);
    const url = encodeURIComponent(appUrl);
    const shareLink = `https://warpcast.com/~/compose?text=${text}&embeds[]=${url}`;
    window.open(shareLink, '_blank');
  };

  const showResults = isConnected && hasVoted;
  const hasAlreadyVotedOrIsProcessing = !isConnected || isLoadingHasVoted || isVoteProcessing || isVoteConfirming || isVoteSuccess || hasVoted;
  const submitButtonDisabled = hasAlreadyVotedOrIsProcessing || selectedOption === null;

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
    return <LoadingScreen text={lang === 'en' ? translations.en.loadingPoll : translations.tr.loadingPoll} />;
  }

  if (!dailyPoll) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground relative">
      
      {/* Soru Öneri Modalı (Ayrı Bileşen) */}
      <SuggestionModal 
        isOpen={isSuggestModalOpen} 
        onClose={() => setIsSuggestModalOpen(false)} 
        translations={t} 
      />

      <div className="w-full max-w-md p-6 bg-card rounded-lg border border-border shadow-xl relative">
        
        {/* Profil Menüsü (Ayrı Bileşen) */}
        <ProfileMenu 
          lang={lang} 
          setLang={setLang} 
          translations={t} 
          onOpenSuggestionModal={() => setIsSuggestModalOpen(true)}
        />

        <div className="text-center mb-6 pt-12"> 
          <h1 className="text-3xl font-bold text-base-blue-600">{t.title}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          <p className="text-xs text-muted-foreground mt-2 opacity-60">Poll ID: {dailyPoll.id}</p>
        </div>

        <div className="text-center p-3 mb-4 bg-secondary rounded-lg border border-border">
          <StatusMessage />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            {dailyPoll.question[lang]}
          </h2>
          
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

              <button
                onClick={handleShare}
                className="w-full p-3 mt-2 flex items-center justify-center space-x-2 bg-[#8a63d2] text-white font-medium rounded-lg hover:bg-[#7c55c3] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{t.shareResult}</span>
              </button>

            </div>
          ) : (
            <>
              <div className="flex flex-col space-y-3">
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}