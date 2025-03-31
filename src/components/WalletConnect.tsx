'use client';
import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnect: FC = () => {
  const { publicKey, connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Only render the wallet button on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const truncateAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!mounted) {
    return <div className="h-[38px] w-[180px]"></div>;
  }

  return (
    <div className="flex items-center">
      <div>
        <WalletMultiButton className="!bg-red-600 hover:!bg-red-700 transition-colors" />
      </div>
      
      {connected && publicKey && (
        <div className="ml-4 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>{truncateAddress(publicKey.toString())}</span>
          </div>
        </div>
      )}
    </div>
  );
};