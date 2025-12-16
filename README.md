Base Polls 🗳️

Base blok zinciri üzerinde çalışan, topluluk odaklı, günlük bir oylama uygulaması (Mini App). Kullanıcılar Farcaster veya harici cüzdanlarıyla bağlanarak her gün yeni bir ankete katılabilir ve sonuçları şeffaf bir şekilde on-chain (zincir üstü) görebilirler.

🌟 Özellikler

Dinamik Günlük Anketler: Her gün UTC gece yarısında otomatik olarak yeni bir soru ve şıklar sunulur.

On-Chain Oylama: Tüm oylar Base Mainnet üzerinde güvenli ve değiştirilemez bir şekilde saklanır.

Farcaster Entegrasyonu: Farcaster (Warpcast) içinde sorunsuz çalışan bir Mini App deneyimi sunar.

Profil Menüsü: Kullanıcıların Farcaster profilini (PFP, İsim, FID) ve cüzdan adresini gösterir.

Çoklu Dil Desteği: Türkçe (TR) ve İngilizce (EN) dil seçenekleri mevcuttur.

Soru Öneri Sistemi: Kullanıcıların topluluğa yeni soru fikirleri sunabilmesi için entegre bir form.

Optimistic UI: Oylama yapıldığında arayüz anında güncellenir, kullanıcıyı bekletmez.

Akıllı Cüzdan Bağlantısı: Farcaster, MetaMask, Coinbase Wallet gibi çeşitli cüzdanları destekler.

🛠️ Teknolojiler

Framework: Next.js (App Router)

Blockchain SDK: Wagmi & Viem

Farcaster SDK: @farcaster/auth-kit & @farcaster/miniapp-sdk

Stil: Tailwind CSS

Smart Contract: Solidity (Base Mainnet)

🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Depoyu Klonlayın

git clone [https://github.com/KULLANICI_ADI/base-polls.git](https://github.com/KULLANICI_ADI/base-polls.git)
cd base-polls


2. Bağımlılıkları Yükleyin

npm install


3. Ortam Değişkenlerini Ayarlayın

Kök dizinde .env adında bir dosya oluşturun ve gerekli anahtarları ekleyin:

# Neynar API Key (Farcaster verileri için)
NEYNAR_API_KEY=YOUR_NEYNAR_API_KEY

# WalletConnect Project ID (Wagmi için)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID

# Uygulama URL'i (Localhost veya Canlı URL)
NEXT_PUBLIC_HOST=http://localhost:3000


4. Uygulamayı Başlatın

npm run dev


Tarayıcınızda http://localhost:3000 adresine giderek uygulamayı görüntüleyebilirsiniz.

📜 Akıllı Sözleşme (Smart Contract)

Uygulamanın kullandığı akıllı sözleşme Polls.sol, oyları ve anket durumlarını yönetir.

Ağ: Base Mainnet

Kontrat Adresi: src/lib/abi.ts dosyasında güncel adresi bulabilirsiniz.

🤝 Katkıda Bulunma

Bu depoyu fork'layın.

Yeni bir özellik dalı (feature branch) oluşturun (git checkout -b yeni-ozellik).

Değişikliklerinizi yapın ve commit'leyin (git commit -m 'Yeni özellik eklendi').

Dalınızı push'layın (git push origin yeni-ozellik).

Bir Pull Request (PR) oluşturun.

📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.