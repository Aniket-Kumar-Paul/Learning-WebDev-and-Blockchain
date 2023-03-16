import React from "react";
import {
  Connector,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
} from "wagmi";

export const Home: React.FC = () => {
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
  });
  console.log(data, isError, isLoading);

  const handleWalletConnect = async (connector: Connector) => {
    const { account, chain } = await connectAsync({ connector });
    // console.log(account, chain);
    if (chain.unsupported) {
      alert("Please connect only on goerli!");
      disconnect();
    }
  };

  const handleWalletDisconnect = () => {
    disconnect();
  };

  return (
    <>
      <h1>Wagmi Tutorial</h1>

      <h3>Welcome!</h3>
      {!isConnected ? (
        <h4>Connect your wallet</h4>
      ) : (
        <div>
          <h4>{address}</h4>
          <h4>
            Your account balance is {data?.formatted} {data?.symbol}
          </h4>
        </div>
      )}

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
