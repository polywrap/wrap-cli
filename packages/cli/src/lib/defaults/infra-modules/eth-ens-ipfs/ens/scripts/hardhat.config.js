require("@nomiclabs/hardhat-ethers");
require("hardhat-abi-exporter");

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.20", },
      { version: "0.4.11", },
    ],
  },
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: `http://${process.env.ETH_PROVIDER}`,
      gas: 8000000,
      accounts: ["0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"],
    },
  },
  abiExporter: [
    {
      path: "./abi/json",
      format: "json",
    },
  ],
};

