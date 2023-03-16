import { WagmiConfig, createClient, configureChains } from "wagmi";
import { goerli } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { infuraProvider } from 'wagmi/providers/infura';
import { FC, ReactNode } from "react";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [infuraProvider({ apiKey: "0a4bdf6e0e6f4b209e8e3abbc498e419" })]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains, options: {
      shimDisconnect: true,
      UNSTABLE_shimOnConnectSelectAccount: true
    }}),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "...",
      },
    }),
  ],
  provider,
  webSocketProvider,
});

interface WagmiProviderProps {
    children: ReactNode
}

export const WagmiProvider: FC<WagmiProviderProps> = ({children}) => {
    return <WagmiConfig client={client}>
        {children}
    </WagmiConfig>
}