'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavigationBar } from './NavigationBar';
import { PageContainer } from './PageContainer';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children?: ReactNode;
  walletConnect: ReactNode;
  walletBalance: ReactNode;
  createToken: ReactNode;
  mintToken: ReactNode;
  sendToken: ReactNode;
  tokenBalances: ReactNode;
  transactions: ReactNode;
}

export const Layout = ({
  children,
  walletConnect,
  walletBalance,
  createToken,
  mintToken,
  sendToken,
  tokenBalances,
  transactions,
}: LayoutProps) => {
  const { connected } = useWallet();
  const [activeSection, setActiveSection] = useState('wallet');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation items
  const navItems = [
    { id: 'wallet', title: 'Wallet' },
    { id: 'create', title: 'Create Token' },
    { id: 'mint', title: 'Mint Token' },
    { id: 'send', title: 'Send Token' },
    { id: 'balances', title: 'Token Balances' },
    { id: 'transactions', title: 'Transactions' },
  ];

  // Page sections
  const sections = [
    {
      id: 'wallet',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Wallet</h2>
          {walletBalance}
        </div>
      ),
    },
    {
      id: 'create',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Token</h2>
          {createToken}
        </div>
      ),
    },
    {
      id: 'mint',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Mint Token</h2>
          {mintToken}
        </div>
      ),
    },
    {
      id: 'send',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Send Token</h2>
          {sendToken}
        </div>
      ),
    },
    {
      id: 'balances',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Token Balances</h2>
          {tokenBalances}
        </div>
      ),
    },
    {
      id: 'transactions',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
          {transactions}
        </div>
      ),
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Solana Token Hub</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {walletConnect}
          </motion.div>
        </div>
      </header>

      <div className="flex-grow pb-16">
        {connected ? (
          <>
            <NavigationBar
              items={navItems}
              activeItem={activeSection}
              onItemClick={setActiveSection}
            />
            <PageContainer activeSection={activeSection} sections={sections} />
          </>
        ) : (
          <main className="flex-grow flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="text-center max-w-md px-4"
            >
              <div className="mb-8 flex justify-center">
                <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Connect Your Wallet</h2>
              <p className="mb-8 text-gray-600">
                Connect your Solana wallet to create and manage tokens on the Solana blockchain.
              </p>
              <div className="flex justify-center">{walletConnect}</div>
            </motion.div>
          </main>
        )}
      </div>

      <footer className="bg-white py-6 border-t border-gray-200 text-center text-sm text-gray-600 fixed bottom-0 left-0 right-0 w-full">
        Solana Token Hub • Built on Solana Devnet
      </footer>
    </div>
  );
};