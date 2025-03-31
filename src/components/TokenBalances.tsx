'use client';
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';
import { Card } from './Card';

interface TokenInfo {
  mint: string;
  balance: number;
  decimals: number;
}

export const TokenBalances = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  
  const [tokenBalances, setTokenBalances] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (!publicKey) {
        setTokenBalances([]);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
        // Fetch all token accounts owned by the user
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: token.TOKEN_PROGRAM_ID }
        );
        
        // Process the token accounts to extract balance information
        const balances: TokenInfo[] = tokenAccounts.value.map((tokenAccount) => {
          const accountData = tokenAccount.account.data.parsed.info;
          const mint = accountData.mint;
          const balance = Number(accountData.tokenAmount.amount) / Math.pow(10, accountData.tokenAmount.decimals);
          const decimals = accountData.tokenAmount.decimals;
          
          return {
            mint,
            balance,
            decimals
          };
        });
        
        setTokenBalances(balances);
      } catch (err) {
        console.error('Error fetching token balances:', err);
        setError('Failed to fetch token balances');
      } finally {
        setIsLoading(false);
      }
    };

    if (connected && publicKey && mounted) {
      fetchTokenBalances();
    } else {
      setTokenBalances([]);
    }
  }, [connection, publicKey, connected, mounted]);

  // Truncate address for display
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  if (!mounted) return null;

  return (
    <Card>
      <div>
        <div className="flex items-center mb-6 space-x-2">
          <div className="p-2 bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Your Token Balances</h3>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex justify-between p-3 bg-gray-100 rounded-lg">
                <div className="h-5 w-48 bg-gray-200 rounded"></div>
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        ) : tokenBalances.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-500">No tokens found in your wallet</p>
            <p className="text-sm mt-2 text-gray-400">Create or mint tokens to see them here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tokenBalances.map((token, index) => (
              <div
                key={token.mint}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="overflow-hidden">
                  <p className="font-mono text-sm mb-1 text-gray-700 truncate">{truncateAddress(token.mint)}</p>
                  <a
                    href={`https://explorer.solana.com/address/${token.mint}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 text-xs hover:underline"
                  >
                    View on Explorer
                  </a>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{token.balance.toFixed(token.decimals > 4 ? 4 : token.decimals)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};