import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { useEffect } from "react";

function Wallet({ address, setAddress, balance, setBalance, setAddressNonce  }) {

  useEffect(() => {
    async function fetchAccount() {
      if (address) {
        const { data: { balance, nonce } } = await server.get(`account/${address}`);
        setBalance(balance);
        setAddressNonce(nonce);
      } else {
        setBalance(0);
        setAddressNonce(null);
      }
    }
    fetchAccount();
  }, [address]);


  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
