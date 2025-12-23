'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { Connector } from '@wagmi/core';
import { useFrameContext } from '../providers/FrameProvider';

interface ProfileMenuProps {
  lang: 'en' | 'tr';
  setLang: (lang: 'en' | 'tr') => void;
  translations: any;
  onOpenSuggestionModal: () => void;
  onOpenFeedbackModal: () => void; // YENİ PROP
}

export default function ProfileMenu({ lang, setLang, translations, onOpenSuggestionModal, onOpenFeedbackModal }: ProfileMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  
  const frameContext = useFrameContext();
  const user = (frameContext?.context as any)?.user; 
  const pfpUrl = user?.pfpUrl;
  const displayName = user?.displayName;
  const fid = user?.fid;

  const t = translations;

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  const handleConnect = async () => {
    setIsDropdownOpen(false);
    let connector = connectors.find((c: Connector) => c.id === 'injected');
    if (!connector) connector = connectors.find((c: Connector) => c.id === 'coinbaseWallet'); 
    if (!connector) connector = connectors.find((c: Connector) => c.id === 'farcasterMiniApp');
    
    if (connector) await connect({ connector }); 
  };

  return (
    <div className="absolute top-4 right-4">
      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-base-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      
      {isDropdownOpen && (
        <div className="absolute top-12 right-0 w-72 bg-card border border-border rounded-lg shadow-lg z-10 py-2">
          {isConnected && fid && (
            <div className="px-4 py-3 border-b border-border flex items-center space-x-3">
              {pfpUrl && <Image src={pfpUrl} alt="PFP" width={40} height={40} className="rounded-full" />}
              <div><p className="font-bold text-base-blue-600 truncate">{displayName || t.profile}</p><p className="text-sm text-muted-foreground">{t.fid}: {fid}</p></div>
            </div>
          )}
          
          {/* BUTONLAR */}
          <div className="px-2 py-2 border-b border-border space-y-1">
             <button onClick={() => { onOpenSuggestionModal(); setIsDropdownOpen(false); }} className="w-full flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-muted text-sm font-medium text-base-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                <span>{t.suggestPoll}</span>
             </button>
             {/* YENİ: Feedback Butonu */}
             <button onClick={() => { onOpenFeedbackModal(); setIsDropdownOpen(false); }} className="w-full flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-muted text-sm font-medium text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>{t.sendFeedback}</span>
             </button>
          </div>

          <div className="px-4 py-3 border-b border-border">
            <div className="flex space-x-2">
              <button onClick={() => { setLang('tr'); setIsDropdownOpen(false); }} className={`flex-1 p-2 rounded-md text-sm font-medium ${lang === 'tr' ? 'bg-base-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}>TR</button>
              <button onClick={() => { setLang('en'); setIsDropdownOpen(false); }} className={`flex-1 p-2 rounded-md text-sm font-medium ${lang === 'en' ? 'bg-base-blue-600 text-white' : 'bg-secondary text-secondary-foreground'}`}>EN</button>
            </div>
          </div>
          {isConnected ? (
            <button onClick={handleDisconnect} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-muted flex items-center space-x-2"><span>{t.disconnect}</span></button>
          ) : (
            <button onClick={handleConnect} className="w-full text-left px-4 py-3 text-sm text-green-500 hover:bg-muted">{t.connectWalletButton}</button>
          )}
        </div>
      )}
    </div>
  );
}