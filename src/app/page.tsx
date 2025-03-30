'use client';
import { WalletConnect } from 'components/WalletConnect';
import { WalletBalance } from 'components/WalletBalance';
import { CreateToken } from 'components/CreateToken';
import { MintToken } from 'components/MintToken';
import { SendToken } from 'components/SendToken';
import { TokenBalances } from 'components/TokenBalances';
import { TransactionHistory } from 'components/TransactionHistory';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const { connected } = useWallet();
  
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Solana Token Manager</h1>
        
        <div className="flex justify-center mb-8">
          <WalletConnect />
        </div>
        
        {connected ? (
          <div>
            <WalletBalance />
            <TokenBalances />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <CreateToken />
              <MintToken />
            </div>
            <SendToken />
            <TransactionHistory />
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-600">
              Connect your wallet to get started
            </p>
          </div>
        )}
      </div>
    </main>
  );
}