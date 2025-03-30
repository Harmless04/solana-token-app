'use client';
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';

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

    if (connected && publicKey) {
      fetchTokenBalances();
    } else {
      setTokenBalances([]);
    }
  }, [connection, publicKey, connected]);

  if (!connected || !publicKey) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Token Balances</h2>
      
      {isLoading ? (
        <p>Loading token balances...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tokenBalances.length === 0 ? (
        <p>No tokens found in your wallet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token Mint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tokenBalances.map((token, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {token.mint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {token.balance.toFixed(token.decimals > 4 ? 4 : token.decimals)}
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