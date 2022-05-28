const { EthereumPlugin } = require("@web3api/ethereum-plugin-js");
const fs = require("fs");
const buildContract = require("./build-contract");

async function main() {
  // Ensure the contract is built
  await buildContract.main();

  // Fetch the contract's ABI
  const contractAbi = JSON.parse(
    fs.readFileSync(
      `${__dirname}/../src/contracts/SimpleStorage.json`, 'utf-8'
    )
  );

  // Deploy the contract to testnet
  const eth = new EthereumPlugin({
    networks: {
      testnet: {
        provider: "http://localhost:8545"
      },
    },
  });

  const address = await eth.getModules().mutation.deployContract({
    abi: contractAbi.abi,
    bytecode: contractAbi.bytecode,
    args: [],
    connection: {
      networkNameOrChainId: "testnet"
    }
  });

  console.log(`✔️ SimpleStorage live at: ${address}`)

  // Store the address in our recipes' constants file
  const constants = require(`${__dirname}/../recipes/constants.json`);
  constants.SimpleStorageAddr = address;
  fs.writeFileSync(
    `${__dirname}/../recipes/constants.json`,
    JSON.stringify(constants, null, 2)
  );

  console.log("✔️ Recipe Constants Updated");
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  module.exports = {
    main
  };
}
