import { useState } from "react";
import { ethers } from "ethers";
import server from "./server";

function Transfer({ address, setBalance, provider, setAddressNonce, addressNonce }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {

      if (!address || !recipient || !sendAmount) {
        return;
      }


      const data = {
        sender: address,
        recipient,
        amount: parseInt(sendAmount),
        nonce: addressNonce,
      };

      const signer = await provider.getSigner();
      const sign = await signer.signMessage(JSON.stringify(data));

      const {
        data: { balance , nonce},
      } = await server.post(`send`, {...data, sign});
      setBalance(balance);
      setAddressNonce(nonce);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
