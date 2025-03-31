'use client';
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';
import { Card } from './Card';

export const CreateToken = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [decimals, setDecimals] = useState(9);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    try {
      setIsCreating(true);
      setError('');
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
      
      setMintAddress(mintKeypair.publicKey.toString());
      console.log('Token created successfully!');
      
    } catch (err) {
      console.error('Error creating token:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  if (!mounted) return null;

  return (
    <Card>
      <form onSubmit={createToken} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token Name
          </label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token Symbol
          </label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decimals
          </label>
          <input
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(parseInt(e.target.value))}
            min="0"
            max="9"
            className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <button
          type="submit"
          disabled={isCreating || !publicKey}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isCreating || !publicKey
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isCreating ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </div>
          ) : (
            'Create Token'
          )}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="font-medium text-red-700">Error</p>
          <p className="text-sm mt-2 text-red-600">{error}</p>
        </div>
      )}
      
      {mintAddress && (
        <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="font-medium text-green-700">Token Created Successfully!</p>
          <p className="text-sm mt-2 text-gray-600 break-all">Mint Address: {mintAddress}</p>
          <div className="mt-3">
            <a
              href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 hover:underline text-sm inline-flex items-center transition-colors"
            >
              View on Solana Explorer
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