'use client';
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Card } from './Card';

interface TransactionInfo {
  signature: string;
  blockTime: number | null | undefined;
  confirmationStatus: string | undefined;
}

export const TransactionHistory = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) {
        setTransactions([]);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
        // Fetch recent transactions
        const signatureInfos = await connection.getSignaturesForAddress(
          publicKey,
          { limit: 10 } // Limit to 10 most recent transactions
        );
        
        if (signatureInfos.length > 0) {
          console.log('First signature info object:', signatureInfos[0]);
        }
        
        // Create our transaction info objects
        const txInfos = signatureInfos.map((info) => {
          const txInfo: TransactionInfo = {
            signature: info.signature,
            blockTime: info.blockTime,
            confirmationStatus: info.confirmationStatus
          };
          return txInfo;
        });
        
        setTransactions(txInfos);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to fetch transaction history');
      } finally {
        setIsLoading(false);
      }
    };

    if (connected && publicKey && mounted) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [connection, publicKey, connected, mounted]);

  // Helper to format timestamp
  const formatTimestamp = (timestamp: number | null | undefined) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Helper to truncate signature
  const truncateSignature = (signature: string) => {
    return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
  };

  if (!mounted) return null;

  return (
    <Card>
      <div className="flex items-center mb-6 space-x-2">
        <div className="p-2 bg-red-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex justify-between p-3 bg-gray-100 rounded-lg">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-gray-500">No recent transactions found</p>
          <p className="text-sm mt-2 text-gray-400">Transactions will appear here once you use your wallet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.signature}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div>
                <p className="font-mono text-sm text-gray-700">{truncateSignature(tx.signature)}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTimestamp(tx.blockTime)}</p>
              </div>
              <div>
                <a
                  href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 text-sm hover:underline transition-colors flex items-center"
                >
                  View
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};