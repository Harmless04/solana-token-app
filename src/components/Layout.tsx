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

  const navItems = [
    { id: 'wallet', title: 'Wallet' },
    { id: 'create', title: 'Create Token' },
    { id: 'mint', title: 'Mint Token' },
    { id: 'send', title: 'Send Token' },
    { id: 'balances', title: 'Token Balances' },
    { id: 'transactions', title: 'Transactions' },
  ];

  const sections = [
    { id: 'wallet', component: <>{walletBalance}</> },
    { id: 'create', component: <>{createToken}</> },
    { id: 'mint', component: <>{mintToken}</> },
    { id: 'send', component: <>{sendToken}</> },
    { id: 'balances', component: <>{tokenBalances}</> },
    { id: 'transactions', component: <>{transactions}</> },
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-xl font-bold text-gray-800">Solana Token Hub</h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {walletConnect}
          </motion.div>
        </div>
      </header>

      <main className="flex-grow">
        {connected ? (
          <>
            <NavigationBar items={navItems} activeItem={activeSection} onItemClick={setActiveSection} />
            <PageContainer activeSection={activeSection} sections={sections} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">{walletConnect}</div>
        )}
      </main>

      <footer className="bg-white py-4 border-t border-gray-200 text-center text-sm text-gray-600 mt-auto">
        Solana Token Hub • Built on Solana Devnet
      </footer>
    </div>
  );
};
