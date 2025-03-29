'use client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const WalletBalance = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) {
        setBalance(null);
        return;
      }

      try {
        setIsLoading(true);
        const walletBalance = await connection.getBalance(publicKey);
        setBalance(walletBalance / LAMPORTS_PER_SOL); // Convert lamports to SOL
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (connected && publicKey) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [connection, publicKey, connected]);

  if (!connected || !publicKey) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold">Your Wallet</h2>
      <div className="mt-2">
        <p className="text-sm text-gray-600">Balance:</p>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <p className="font-mono font-medium">
            {balance !== null ? `${balance.toFixed(4)} SOL` : 'Error loading balance'}
          </p>
        )}
      </div>
    </div>
  );
};