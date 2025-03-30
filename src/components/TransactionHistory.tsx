'use client';
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';

// Updated interface based on Solana's actual return type
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

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) {
        setTransactions([]);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
        // Get signatures and log the first one to see its structure
        const signatureInfos = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
        
        if (signatureInfos.length > 0) {
          console.log('First signature info object:', signatureInfos[0]);
        }
        
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

    if (connected && publicKey) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [connection, publicKey, connected]);

  if (!connected || !publicKey) {
    return null;
  }

  //  format timestamp , undefined values added 
const formatTimestamp = (timestamp: number | null | undefined) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Helper to truncate signature
  const truncateSignature = (signature: string) => {
    return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      
      {isLoading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : transactions.length === 0 ? (
        <p>No recent transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Signature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {truncateSignature(tx.signature)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatTimestamp(tx.blockTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View on Explorer
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};