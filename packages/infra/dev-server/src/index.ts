import { deployENS } from "./ens/deployENS";
import { registerENS } from "./ens/registerENS";

import { config } from "dotenv";
import Web3 from "web3";
import express from "express";

config({ path: "./.env" });

const getWeb3 = () => {
  return new Web3(
    new Web3.providers.HttpProvider(
      process.env.ganache
        ? `http://${process.env.ganache}`
        : `http://localhost:${process.env.ETH_TESTNET_PORT}`
    )
  );
};

const app = express();
const router = express.Router();

let addresses: Record<string, string> = {};

// Simple logging
router.use((req, res, next) => {
  console.log(`Request Type: ${req.method}`);
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});

router.get("/providers", (req, res) => {
  res.send({
    ipfs: `http://localhost:${process.env.IPFS_PORT}`,
    ethereum: `http://localhost:${process.env.ETH_TESTNET_PORT}`,
  });
});

router.get("/ens", (req, res) => {
  res.send({
    ensAddress: addresses.ensAddress,
  });
});

router.get("/deploy-ens", async (req, res) => {
  const web3 = getWeb3();
  const accounts = await web3.eth.getAccounts();
  addresses = await deployENS(web3, accounts);

  res.send(addresses);
});

router.get("/register-ens", async (req, res) => {
  if (addresses.ensAddress === undefined) {
    throw Error("ENS hasn't been deployed, call /deploy-ens");
  }

  const web3 = getWeb3();
  const accounts = await web3.eth.getAccounts();

  await registerENS({
    web3,
    accounts,
    addresses: addresses as {
      ensAddress: string;
      registrarAddress: string;
      resolverAddress: string;
    },
    domain: req.query.domain,
    cid: req.query.cid,
  });

  res.send({
    success: true,
  });
});

router.get('/status', (req, res) => {
  res.send({
    running: true
  });
});

app.use("/", router);
app.listen(process.env.DEV_SERVER_PORT, () => {
  console.log(
    `dev-server now listening on port ${process.env.DEV_SERVER_PORT}...`
  );
});
