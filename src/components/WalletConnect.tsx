import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { truncateAddress } from '@/utils/format';

export const WalletConnect: FC = () => {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex flex-col items-center">
      <WalletMultiButton className="my-4" />
      
      {connected && publicKey && (
        <div className="text-sm mt-2">
          Connected: {truncateAddress(publicKey.toString())}
        </div>
      )}
    </div>
  );
};