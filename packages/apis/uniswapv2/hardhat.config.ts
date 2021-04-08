import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      hardfork: "muirGlacier",
      forking: {
        url: "", // TODO: set up local node or add node url for hard fork
        enabled: true
      }
    },
  },
};

export default config;