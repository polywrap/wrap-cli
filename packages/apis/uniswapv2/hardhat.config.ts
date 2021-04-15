import { HardhatUserConfig } from "hardhat/config";
import * as fs from "fs";
import "@nomiclabs/hardhat-ethers";

const alchemyKey = fs.readFileSync("./alchemyApiKey.txt", 'utf-8');

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`,
        blockNumber: 12200882, // April 8, 2021 at 1:48pm CST
        enabled: true
      }
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./src/__tests__/",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 300000, // 5 minutes
  }
};

export default config;
