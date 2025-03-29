'use client';
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';

export const MintToken = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [mintAddress, setMintAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [txSignature, setTxSignature] = useState('');

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
      
      // adding the mint instruction to the transaction
      transaction.add(mintIx);
      
      // Sending the transaction
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

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Mint Tokens</h2>
      
      <form onSubmit={mintTokens}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token Mint Address
          </label>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter the token mint address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isProcessing || !publicKey}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            isProcessing || !publicKey
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Mint Tokens'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {txSignature && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          <p className="font-medium">Tokens Minted Successfully!</p>
          <p className="text-sm mt-1">
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View transaction on Solana Explorer
            </a>
          </p>
        </div>
      )}
    </div>
  );
};