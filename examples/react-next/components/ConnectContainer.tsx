import type { WalletConnectConfiguration } from '@polkadot-onboard/wallet-connect';
import { useState } from 'react';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';
import { WalletConnectProvider } from '@polkadot-onboard/wallet-connect';
import { extensionConfig } from 'provider-configs/extensionConfig';
import styles from 'styles/Home.module.css';

import Wallets from './Wallets';

const APP_NAME = 'Polkadot Demo';

const ConnectContainer = () => {
  let injectedWalletProvider = new InjectedWalletProvider(extensionConfig, APP_NAME);
  let walletConnectParams: WalletConnectConfiguration = {
    projectId: '4fae85e642724ee66587fa9f37b997e2',
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: 'Polkadot Demo',
      description: 'Polkadot Demo',
      url: '#',
      icons: ['/images/wallet-connect.svg'],
    },
    chainIds: ['polkadot:d8761d3c88f26dc12875c00d3165f7d6', 'polkadot:3af4ff48ec76d2efc8476730f423ac07'],
    optionalChainIds: ['polkadot:735d8773c63e74ff8490fee5751ac07e', 'polkadot:a37725fd8943d2a524cb7ecc65da438f'],
    onSessionDelete: () => {
      // do something when session is removed
    },
  };
  let walletConnectProvider = new WalletConnectProvider(walletConnectParams, APP_NAME);
  let walletAggregator = new WalletAggregator([injectedWalletProvider, walletConnectProvider]);

  let [showWallets, setShowWallets] = useState(false);
  return (
    <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
      <div className={`${styles.grid}`}>
        {!showWallets && (
          <button
            className={`${styles.btn} ${styles.rounded}`}
            onClick={() => {
              setShowWallets(true);
            }}
          >
            Get Wallets
          </button>
        )}

        {showWallets && <Wallets />}
      </div>
    </PolkadotWalletsContextProvider>
  );
};

export default ConnectContainer;
