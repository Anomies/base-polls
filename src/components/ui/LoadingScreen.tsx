import React from 'react';

// Dil tipi tanımı (basitlik için burada tekrar tanımlıyoruz veya ortak bir tipler dosyasından alabiliriz)
type Language = 'en' | 'tr';

interface LoadingScreenProps {
  text: string;
}

export default function LoadingScreen({ text }: LoadingScreenProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="animate-pulse"> 
        <h1 className="text-5xl font-bold text-base-blue-600">Base Polls</h1>
      </div>
      <p className="text-muted-foreground mt-4">
        {text}
      </p>
    </main>
  );
}