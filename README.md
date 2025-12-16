Base Polls 🗳️

A community-driven, daily polling application (Mini App) running on the Base blockchain. Users can connect with Farcaster or external wallets to participate in a new poll every day and view transparent, immutable results on-chain.

🌟 Features

Dynamic Daily Polls: A new question and options are presented automatically every day at midnight UTC.

On-Chain Voting: All votes are securely and immutably stored on the Base Mainnet.

Farcaster Integration: Offers a seamless Mini App experience within Farcaster (Warpcast).

Profile Menu: Displays users' Farcaster profile (PFP, Name, FID) and wallet address.

Multi-Language Support: Available in Turkish (TR) and English (EN).

Poll Suggestion System: An integrated form for users to submit new poll ideas to the community.

Optimistic UI: The interface updates instantly when a vote is cast, eliminating wait times for the user.

Smart Wallet Connection: Supports various wallets such as Farcaster, MetaMask, and Coinbase Wallet.

🛠️ Technologies

Framework: Next.js (App Router)

Blockchain SDK: Wagmi & Viem

Farcaster SDK: @farcaster/auth-kit & @farcaster/miniapp-sdk

Styling: Tailwind CSS

Smart Contract: Solidity (Base Mainnet)

🚀 Installation and Running

Follow the steps below to run the project in your local environment:

1. Clone the Repository

git clone [https://github.com/USERNAME/base-polls.git](https://github.com/USERNAME/base-polls.git)
cd base-polls


2. Install Dependencies

npm install


3. Set Up Environment Variables

Create a file named .env in the root directory and add the necessary keys:

# Neynar API Key (for Farcaster data)
NEYNAR_API_KEY=YOUR_NEYNAR_API_KEY

# WalletConnect Project ID (for Wagmi)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID

# App URL (Localhost or Live URL)
NEXT_PUBLIC_HOST=http://localhost:3000


4. Start the Application

npm run dev


You can view the application by navigating to http://localhost:3000 in your browser.

📜 Smart Contract

The Polls.sol smart contract used by the application manages votes and poll states.

Network: Base Mainnet

Contract Address: You can find the current address in the src/lib/abi.ts file.

🤝 Contributing

Fork this repository.

Create a new feature branch (git checkout -b new-feature).

Make your changes and commit (git commit -m 'Added new feature').

Push your branch (git push origin new-feature).

Create a Pull Request (PR).

📄 License

This project is licensed under the MIT License.
