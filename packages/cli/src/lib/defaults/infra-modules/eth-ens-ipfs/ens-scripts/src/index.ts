import { deployENS } from "./ens/deployENS";
import { ethers } from "ethers";

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.ganache ? 
    `http://${process.env.ganache}`: `http://localhost:${process.env.ETHEREUM_PORT}`
  )
  console.log("Waiting for RPC node...")
  await provider.ready
  const addresses = await deployENS(provider);
  console.log(addresses)
})()
