import Wallet from "./Wallet";
import { ethers } from "ethers";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [addressNonce, setAddressNonce] = useState(null);
  const [provider, setProvider] = useState(undefined);


  useEffect(() => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        provider.send("eth_requestAccounts", []).then(async () => {
          const address = await (await provider.getSigner()).getAddress();
          setAddress(address);
        });
      } else {
        window.alert("Please install and connect MetaMask!!");
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        setAddressNonce={setAddressNonce}
      />
      <Transfer setBalance={setBalance} address={address}
      provider={provider}
      setAddressNonce={setAddressNonce}
      addressNonce={addressNonce} />
    </div>
  );
}

export default App;
