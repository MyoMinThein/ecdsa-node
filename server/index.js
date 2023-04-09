const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { ethers } = require("ethers");

app.use(cors());
app.use(express.json());

const balances = {
  "045b451601658223a0a17516f4f2bdba02fa51c70d94c28b72dd728d20aea0fe01fe9f56edde297401dd730eb0c71f2088d6ca453c6b2269f64a80908726290c2f": 100,
  "04180547d6155209607a74ba695ae30d2346724ef412962bd9362d0fec0b007adc56e9521c2c4174ed89f4361fc3761f49bb94c1aacce1426eaaf49d896b5184e6": 50,
  "04bbdc043baa4abce4bed84bf728e27f9d6b182fdb04d52a670813d4347101e7d0345752b777ab7099b9b2ac31120847b593a2c0bba9c7b0c21508aae9c94435dc": 75,
};

const nonces = {

};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  const nonce = nonces[address];
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount , nonce, sign } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const recoveredAddress = ethers.verifyMessage(JSON.stringify({ sender, recipient, amount, nonce }), sign);
  if (recoveredAddress.toLowerCase() !== sender.toLowerCase()) {
    res.status(400).send({ message: "Sender not verified!" });
  } else if (nonce < nonces[sender]) {
    res.status(400).send({ message: "Replay txn detected!" });
  } else  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 10;
    nonces[address] = 0;
  }
}
