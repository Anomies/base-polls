'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useFrameContext } from '../providers/FrameProvider';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: any;
}

export default function FeedbackModal({ isOpen, onClose, translations }: FeedbackModalProps) {
  const { address } = useAccount();
  const frameContext = useFrameContext();
  const user = (frameContext?.context as any)?.user;
  const t = translations;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSendFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const message = formData.get('message');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          user: user?.username || address || 'Anonymous',
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
          setIsSubmitting(false);
        }, 2000);
      } else {
        setSubmitStatus('error');
        setIsSubmitting(false);
      }
    } catch (error) {
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-2xl">
        <h3 className="text-xl font-bold text-base-blue-600 mb-2">{t.feedbackTitle}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t.feedbackDesc}</p>
        
        {submitStatus === 'success' ? (
          <div className="py-8 text-center text-green-500 font-medium animate-pulse">
            {t.feedbackSuccess}<br/>{t.feedbackThanks}
          </div>
        ) : (
          <form onSubmit={handleSendFeedback} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.feedbackLabel}</label>
              <textarea 
                name="message" 
                required 
                rows={4}
                disabled={isSubmitting}
                className="w-full p-2 rounded-md bg-secondary border border-border focus:ring-2 focus:ring-base-blue-500 outline-none disabled:opacity-50"
                placeholder={t.feedbackPlaceholder}
              />
            </div>
            
            {submitStatus === 'error' && (
              <p className="text-red-500 text-sm text-center">{t.feedbackError}</p>
            )}

            <div className="flex space-x-3 pt-2">
              <button 
                type="button" 
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-md bg-secondary hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50"
              >
                {t.cancel}
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-md bg-base-blue-600 hover:bg-base-blue-700 text-white transition-colors text-sm font-medium flex justify-center items-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  t.sendFeedback
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}