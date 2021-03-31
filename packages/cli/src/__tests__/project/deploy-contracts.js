const { EthereumPlugin } = require("@web3api/ethereum-plugin-js");
const fs = require("fs");
const YAML = require("js-yaml");

async function main() {
  const contractAbi = require(`${__dirname}/src/contracts/SimpleStorage.json`);

  const eth = new EthereumPlugin({
    provider: "http://localhost:8545"
  });

  const address = await eth.deployContract(
    contractAbi.abi, `0x${contractAbi.bytecode.object}`
  );

  console.log(`✔️ SimpleStorage live at: ${address}`)

  const constants = require(`${__dirname}/recipes/constants.json`);
  constants.SimpleStorageAddr = address;
  fs.writeFileSync(
    `${__dirname}/recipes/constants.json`,
    JSON.stringify(constants, null, 2)
  );

  console.log("✔️ Recipe Constants Updated");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
