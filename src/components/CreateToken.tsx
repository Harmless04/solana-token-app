'use client';
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';

export const CreateToken = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [decimals, setDecimals] = useState(9);
  const [isCreating, setIsCreating] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [error, setError] = useState('');
  const [mintAddress, setMintAddress] = useState('');

  const createToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    try {
      setIsCreating(true);
      setError('');
      setTxSignature('');
      setMintAddress('');

      // Create a new transaction
      const transaction = new web3.Transaction();
      
      // Create a mint account
      const mintKeypair = web3.Keypair.generate();
      console.log(`Mint address: ${mintKeypair.publicKey.toString()}`);
      
      // Get minimum balance required for rent exemption
      const lamports = await token.getMinimumBalanceForRentExemptMint(connection);
      
      // Create an instruction to create the mint account
      const createMintAccountIx = web3.SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: token.MINT_SIZE,
        lamports,
        programId: token.TOKEN_PROGRAM_ID,
      });
      
      // Create initialize mint instruction
      const initializeMintIx = token.createInitializeMintInstruction(
        mintKeypair.publicKey,
        decimals,
        publicKey,
        publicKey
      );
      
      // Add instructions to transaction
      transaction.add(createMintAccountIx, initializeMintIx);
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection, {
        signers: [mintKeypair],
      });
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      setTxSignature(signature);
      setMintAddress(mintKeypair.publicKey.toString());
      console.log('Token created successfully!');
      
    } catch (err) {
      console.error('Error creating token:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create New Token</h2>
      
      <form onSubmit={createToken}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token Name
          </label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token Symbol
          </label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decimals
          </label>
          <input
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(parseInt(e.target.value))}
            min="0"
            max="9"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isCreating || !publicKey}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            isCreating || !publicKey
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCreating ? 'Creating...' : 'Create Token'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {mintAddress && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          <p className="font-medium">Token Created Successfully!</p>
          <p className="text-sm mt-1">Mint Address: {mintAddress}</p>
          <p className="text-sm mt-1">
            <a
              href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Solana Explorer
            </a>
          </p>
        </div>
      )}
    </div>
  );
};