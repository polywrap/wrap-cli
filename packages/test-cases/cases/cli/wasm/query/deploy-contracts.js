const { EthereumPlugin } = require("@polywrap/ethereum-plugin-js");
const fs = require("fs");

async function main() {
  const contractAbi = require(`${__dirname}/src/contracts/SimpleStorage.json`);

  const eth = new EthereumPlugin({
    networks: {
      testnet: {
        provider: "http://localhost:8545"
      },
    },
  });

  const address = await eth.deployContract({
    abi: contractAbi.abi,
    bytecode: `0x${contractAbi.bytecode.object}`,
    params: [],
    connection: {
      networkNameOrChainId: "testnet"
    }
  });

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
