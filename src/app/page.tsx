'use client';
import { WalletConnect } from '@/components/WalletConnect';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Solana Token App</h1>
      <WalletConnect />
    </main>
  );
}