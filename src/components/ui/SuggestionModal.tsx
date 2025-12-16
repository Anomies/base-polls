'use client';

import React from 'react';
import { useAccount } from 'wagmi';
// FrameProvider yolunu düzeltiyoruz
import { useFrameContext } from '../providers/FrameProvider';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: any;
}

export default function SuggestionModal({ isOpen, onClose, translations }: SuggestionModalProps) {
  const { address } = useAccount();
  const frameContext = useFrameContext();
  const user = (frameContext?.context as any)?.user;
  const t = translations;

  const handleSendSuggestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question');
    const options = formData.get('options');

    const subject = encodeURIComponent("Base Polls: New Question Suggestion");
    const body = encodeURIComponent(`Question: ${question}\n\nOptions: ${options}\n\nSubmitted by: ${user?.username || address}`);
    // E-posta adresinizi buraya yazın
    window.location.href = `mailto:admin@basepolls.xyz?subject=${subject}&body=${body}`;
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-2xl">
        <h3 className="text-xl font-bold text-base-blue-600 mb-2">{t.suggestTitle}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t.suggestDesc}</p>
        
        <form onSubmit={handleSendSuggestion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.questionLabel}</label>
            <input 
              name="question" 
              required 
              className="w-full p-2 rounded-md bg-secondary border border-border focus:ring-2 focus:ring-base-blue-500 outline-none"
              // DÜZELTME: Placeholder artık çeviri objesinden (t) geliyor
              placeholder={t.placeholderQuestion}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.optionsLabel}</label>
            <textarea 
              name="options" 
              required 
              rows={3}
              className="w-full p-2 rounded-md bg-secondary border border-border focus:ring-2 focus:ring-base-blue-500 outline-none"
              // DÜZELTME: Placeholder artık çeviri objesinden (t) geliyor
              placeholder={t.placeholderOptions}
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2 rounded-md bg-secondary hover:bg-muted transition-colors text-sm font-medium"
            >
              {t.cancel}
            </button>
            <button 
              type="submit" 
              className="flex-1 py-2 rounded-md bg-base-blue-600 hover:bg-base-blue-700 text-white transition-colors text-sm font-medium"
            >
              {t.sendSuggestion}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}