import { deployENS } from "./utils/deployENS";

import { ethers } from "ethers";

async function run() {
  if (!!process.env.ETH_PROVIDER === false) {
    throw Error("ETH_PROVIDER undefined");
  }

  const provider = new ethers.providers.JsonRpcProvider(
      `http://${process.env.ETH_PROVIDER}`
  );

  console.log("Waiting for RPC node...");
  await provider.ready;

  console.log("Deploying ENS...")
  const addresses = await deployENS(provider);
  console.log(addresses);
}

run()
  .then(() => {
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.abort();
  });
