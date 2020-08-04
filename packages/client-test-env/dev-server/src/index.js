///////////////////////////////////////////
// DEV SERVER
// Endpoints:
//   /providers  list all portal providers
//   /ens        get ens address
//   /mock-ens   deploy ENS contracts
///////////////////////////////////////////

require("dotenv").config({ path: './.env' });

const Web3 = require("web3");
const express = require("express");
const deployENS = require("./ens/deployENS.js").default;

const app = express();
const router = express.Router();

let ensAddress = undefined;

// Simple logging
router.use((req, res, next) => {
  console.log(`Request Type: ${req.method}`);
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});

router.get('/providers', (req, res) => {
  res.send({
    ipfs: `localhost:${process.env.IPFS_PORT}`,
    ethereum: `localhost:${process.env.ETHEREUM_PORT}`,
    subgraph: `localhost:${process.env.SUBGRAPH_PORT}`
  });
});

router.get('/ens', (req, res) => {
  res.send({
    ensAddress
  });
});

router.get('/deploy-ens', async (req, res) => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      process.env.ganache ? `http://${process.env.ganache}` :
      `http://localhost:${process.env.ETHEREUM_PORT}`
    )
  );
  const accounts = await web3.eth.getAccounts();
  const addresses = await deployENS({ web3, accounts });
  ensAddress = addresses.ensAddress;
  res.send({
    ensAddress
  });
});

app.use('/', router);
app.listen(process.env.DEV_SERVER_PORT, () => {
  console.log(`dev-server now listening on port ${process.env.DEV_SERVER_PORT}...`);
});
