import "./App.css";
import { Home } from "./Home";
import { WagmiProvider } from "./WagmiContext";

function App() {
  return (
    <div className="App">
      <WagmiProvider>
        <Home />
      </WagmiProvider>
    </div>
  );
}

export default App;
