import { ethers } from "@nomiclabs/buidler";
import { exec } from 'child_process'

async function main() {
  const factory = await ethers.getContract("SimpleStorage");

  // If we had constructor arguments, they would be passed into deploy()
  let contract = await factory.deploy();

  // The address the Contract WILL have once mined
  console.log("Contract at address: " + contract.address);

  // The transaction that was sent to the network to deploy the Contract
  console.log("Tx hash: " + contract.deployTransaction.hash);
  
  // The contract is NOT deployed yet; we must wait until it is mined
  await contract.deployed();
  exec(`npx buidler verify-contract --contract-name SimpleStorage --address ${contract.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
