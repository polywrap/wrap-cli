const buildContract = require("./build-contract");

const { EthereumPlugin } = require("@web3api/ethereum-plugin-js");
const fs = require("fs");
const axios = require("axios");
const yaml = require("js-yaml");
const { loadDeployManifest } = require("@web3api/cli/build/lib/manifest/web3api/load");
const { keccak256, namehash } = require("ethers/lib/utils");
const { toUtf8Bytes } = require("@ethersproject/strings");

const label = keccak256(toUtf8Bytes("simplestorage"))

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

  const { data } = await axios.get("http://localhost:4040/deploy-ens");
  const { __type, ...deployManifest } = await loadDeployManifest(`${__dirname}/../web3api.deploy.yaml`);

  Object.entries(deployManifest.stages).forEach(([key, value]) => {
    if (value.config && value.config.ensRegistryAddress) {
      deployManifest.stages[key].config.ensRegistryAddress = data.ensAddress;
    }
  })

  // TODO (cbrzn): Remove this once ENSRegistrar Deployed is implemented
  const ensAddress = data.ensAddress
  const resolverAddress = data.resolverAddress
  const registrarAddress = data.registrarAddress

  const signer = await eth.getModules().query.getSignerAddress({
    connection: {
      networkNameOrChainId: "testnet"
    }
  })

  await eth.getModules().mutation.callContractMethodAndWait({
    address: registrarAddress,
    method: "function register(bytes32 label, address owner)",
    args: [label, signer],
    connection: {
      networkNameOrChainId: "testnet"
    }
  })

  await eth.getModules().mutation.callContractMethodAndWait({
    address: ensAddress,
    method: "function setResolver(bytes32 node, address owner)",
    args: [namehash("simplestorage.eth"), resolverAddress],
    connection: {
      networkNameOrChainId: "testnet"
    }
  })

  await fs.promises.writeFile(
    `${__dirname}/../web3api.deploy.yaml`,
    yaml.dump(deployManifest)
  )
  console.log("✔️ ENS Registry address updated")
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
