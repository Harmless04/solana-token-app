'use client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Card } from './Card';

export const WalletBalance = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) {
        setBalance(null);
        return;
      }

      try {
        setIsLoading(true);
        const walletBalance = await connection.getBalance(publicKey);
        setBalance(walletBalance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (connected && publicKey && mounted) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [connection, publicKey, connected, mounted]);

  if (!mounted) return null;

  return (
    <Card>
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-red-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">Your Balance</p>
          {isLoading ? (
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-xl font-bold text-gray-800">
              {balance !== null ? `${balance.toFixed(4)} SOL` : 'Error loading balance'}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Wallet Address</p>
        <p className="font-mono text-sm text-gray-700 truncate">
          {publicKey?.toString()}
        </p>
      </div>
    </Card>
  );
};