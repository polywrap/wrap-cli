///////////////////////////////////////////
// DEV SERVER
// Endpoints:
//   /providers  list all portal providers
//   /ens        get ens address
//   /deploy-ens   deploy ENS contracts
///////////////////////////////////////////

require("dotenv").config({ path: './.env' });

import { deployENS } from "./ens/deployENS";
import { registerENS } from "./ens/registerENS";

const Web3 = require("web3");
const express = require("express");

const getWeb3 = () => {
  return new Web3(
    new Web3.providers.HttpProvider(
      process.env.ganache ? `http://${process.env.ganache}` :
      `http://localhost:${process.env.ETHEREUM_PORT}`
    )
  );
}

const app = express();
const router = express.Router();

let addresses = { };

// Simple logging
router.use((req, res, next) => {
  console.log(`Request Type: ${req.method}`);
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});

router.get('/providers', (req, res) => {
  res.send({
    ipfs: `http://localhost:${process.env.IPFS_PORT}`,
    ethereum: `http://localhost:${process.env.ETHEREUM_PORT}`
  });
});

router.get('/ens', (req, res) => {
  res.send({
    ensAddress: addresses.ensAddress
  });
});

router.get('/deploy-ens', async (req, res) => {
  const web3 = getWeb3();
  const accounts = await web3.eth.getAccounts();
  addresses = await deployENS(web3, accounts);

  res.send(addresses);
});

router.get('/register-ens', async (req, res) => {
  if (addresses.ensAddress === undefined) {
    throw Error("ENS hasn't been deployed, call /deploy-ens");
  }

  const web3 = getWeb3();
  const accounts = await web3.eth.getAccounts();

  await registerENS({
    web3,
    accounts,
    addresses,
    domain: req.query.domain,
    cid: req.query.cid
  });

  res.send({
    success: true
  });
});

router.get('/status', (req, res) => {
  res.send({
    running: true
  });
});

app.use('/', router);
app.listen(process.env.DEV_SERVER_PORT, () => {
  console.log(`dev-server now listening on port ${process.env.DEV_SERVER_PORT}...`);
});
