'use client';
import { WalletConnect } from 'components/WalletConnect';
import { WalletBalance } from 'components/WalletBalance';
import { CreateToken } from 'components/CreateToken';
import { MintToken } from 'components/MintToken';
import { SendToken } from 'components/SendToken';
import { TokenBalances } from 'components/TokenBalances';
import { TransactionHistory } from 'components/TransactionHistory';
import { Layout } from 'components/Layout';

export default function Home() {
  return (
    <Layout
      walletConnect={<WalletConnect />}
      walletBalance={<WalletBalance />}
      createToken={<CreateToken />}
      mintToken={<MintToken />}
      sendToken={<SendToken />}
      tokenBalances={<TokenBalances />}
      transactions={<TransactionHistory />}
    />
  );
}