import React from "react";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";

export const Home: React.FC = () => {
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const handleWalletConnect = async (connector: Connector) => {
    const { account, chain } = await connectAsync({ connector });
    console.log(account, chain);
  };

  const handleWalletDisconnect = () => {
    disconnect();
  };

  return (
    <>
      <h1>Wagmi Tutorial</h1>

      <h3>Welcome!</h3>
      {!isConnected ? <h4>Connect your wallet</h4> : <h4>{address}</h4>}

      {!isConnected &&
        connectors.map((connector) => {
          const { id, name } = connector;
          return (
            <button key={id} onClick={() => handleWalletConnect(connector)}>
              {name}
            </button>
          );
        })}
      {isConnected && (
        <button onClick={handleWalletDisconnect}>Disconnect</button>
      )}
    </>
  );
};
