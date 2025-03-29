import { clusterApiUrl, Connection } from '@solana/web3.js';

// Using devnet as specified in the assignment
export const SOLANA_NETWORK = 'devnet';
export const SOLANA_RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);

// Create a connection to the Solana network
export const getSolanaConnection = () => new Connection(SOLANA_RPC_ENDPOINT);