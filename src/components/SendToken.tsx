'use client';
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';

export const SendToken = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [mintAddress, setMintAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [txSignature, setTxSignature] = useState('');

  const sendTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError('');
      setTxSignature('');

      // Parse the mint and recipient addresses
      const mintPubkey = new web3.PublicKey(mintAddress);
      const recipientPubkey = new web3.PublicKey(recipientAddress);
      
      
      const senderTokenAccount = await token.getAssociatedTokenAddress(
        mintPubkey,
        publicKey
      );
      
      
      const recipientTokenAccount = await token.getAssociatedTokenAddress(
        mintPubkey,
        recipientPubkey
      );
      
      
      const transaction = new web3.Transaction();
      
      // Check if the recipient's token account exists
      const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
      
      // If the recipient's token account doesn't exist, create it
      if (!recipientAccountInfo) {
        const createATAIx = token.createAssociatedTokenAccountInstruction(
          publicKey,
          recipientTokenAccount,
          recipientPubkey,
          mintPubkey
        );
        transaction.add(createATAIx);
      }
      
      // Get the token's decimals
      const mintInfo = await token.getMint(connection, mintPubkey);
      
      // Convert amount to the appropriate decimals
      const amountInSmallestUnit = Math.floor(parseFloat(amount) * Math.pow(10, mintInfo.decimals));
      
      // Create the transfer instruction
      const transferIx = token.createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        publicKey,
        amountInSmallestUnit
      );
      
      
      transaction.add(transferIx);
      
      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      setTxSignature(signature);
      console.log('Tokens sent successfully!');
      
    } catch (err) {
      console.error('Error sending tokens:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Send Tokens</h2>
      
      <form onSubmit={sendTokens}>
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
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Enter the recipient's wallet address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount to Send
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
          {isProcessing ? 'Processing...' : 'Send Tokens'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {txSignature && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          <p className="font-medium">Tokens Sent Successfully!</p>
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