'use client';
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';
import { Card } from './Card';

export const MintToken = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [mintAddress, setMintAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mintTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!mintAddress) {
      setError('Please enter a mint address');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError('');
      setTxSignature('');

      // Parse the mint address
      const mintPubkey = new web3.PublicKey(mintAddress);
      
      // Find the associated token account for this mint and the connected wallet
      const associatedTokenAddress = await token.getAssociatedTokenAddress(
        mintPubkey,
        publicKey
      );
      
      // Check if the token account exists
      const tokenAccount = await connection.getAccountInfo(associatedTokenAddress);
      
      // Create a transaction
      const transaction = new web3.Transaction();
      
      // If the token account doesn't exist, create it
      if (!tokenAccount) {
        const createATAIx = token.createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAddress,
          publicKey,
          mintPubkey
        );
        transaction.add(createATAIx);
      }
      
      // Convert amount to the appropriate decimals
      const mintInfo = await token.getMint(connection, mintPubkey);
      const amountInSmallestUnit = Math.floor(parseFloat(amount) * Math.pow(10, mintInfo.decimals));
      
      // Create the mint instruction
      const mintIx = token.createMintToInstruction(
        mintPubkey,
        associatedTokenAddress,
        publicKey,
        amountInSmallestUnit
      );
      
      // Add the mint instruction to the transaction
      transaction.add(mintIx);
      
      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      setTxSignature(signature);
      console.log('Tokens minted successfully!');
      
    } catch (err) {
      console.error('Error minting tokens:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <Card>
      <form onSubmit={mintTokens} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token Mint Address
          </label>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter the token mint address"
            className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount to Mint
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            min="0"
            step="any"
            className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isProcessing || !publicKey}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isProcessing || !publicKey
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Minting...
            </div>
          ) : (
            'Mint Tokens'
          )}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="font-medium text-red-700">Error</p>
          <p className="text-sm mt-2 text-red-600">{error}</p>
        </div>
      )}
      
      {txSignature && (
        <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="font-medium text-green-700">Tokens Minted Successfully!</p>
          <div className="mt-3">
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 hover:underline text-sm inline-flex items-center transition-colors"
            >
              View transaction on Solana Explorer
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </Card>
  );
};