/// NOTE: This is an auto-generated file. See scripts/extractPluginConfigs.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IpfsConfig } from "./Ipfs";
import { EthereumConfig } from "./Ethereum";
import { EnsConfig } from "./Ens";

interface PluginConfigs {
  ipfs?: IpfsConfig;
  ethereum?: EthereumConfig;
  ens?: EnsConfig;
}

const modules: Record<string, string> = {
  ipfs: "@web3api/ipfs-plugin-js",
  ethereum: "@web3api/ethereum-plugin-js",
  ens: "@web3api/ens-plugin-js",
};

const uris: Record<string, string> = {
  ipfs: "w3://ens/ipfs.web3api.eth",
  ethereum: "w3://ens/ethereum.web3api.eth",
  ens: "w3://ens/ens.web3api.eth",
};

export { PluginConfigs, modules, uris };
