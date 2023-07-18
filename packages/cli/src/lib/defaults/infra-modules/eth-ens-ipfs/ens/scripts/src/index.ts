import { deployENS } from "./utils/deployENS";

const hre = require("hardhat");

async function run() {
  if (!!process.env.ETH_PROVIDER === false) {
    throw Error("ETH_PROVIDER undefined");
  }

  const provider = new hre.ethers.providers.JsonRpcProvider(
      `http://${process.env.ETH_PROVIDER}`
  );

  console.log("Waiting for RPC node...");
  await provider.ready;

  console.log("Deploying ENS...")
  const addresses = await deployENS(hre.ethers);
  console.log("ENS Addresses: " + addresses);
}

run()
  .then(() => {
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.abort();
  });
