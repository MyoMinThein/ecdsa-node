const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04f1cf4ec567222faff8890b2f59e5e3524e303dbe6cea436b01f9eb68398cdc6c1f7a268e60c4b8872f2db1e878ec41a62f2ef72ab206e07c7ec56768c88488ff": 100,
  "04ae84627f7e61f20d951958dd46e6b20138316b93505a0494dd2360d6ac01dc57de779e9bc57c2837989d735dfff591ddf0b6f423a5ba3374b2285a9a1438b3eb": 50,
  "04603975d07658e8b7fb4971b11110677f1f5e3b7919c0faf3bf2baa6c398d8c0a1a957161b10bdf5fbd136aadd05a93174d386bdd3876ff033bf251789b6030a1": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
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
    balances[address] = 0;
  }
}
