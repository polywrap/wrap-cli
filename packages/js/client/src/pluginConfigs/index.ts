/// NOTE: This is an auto-generated file. See scripts/extractPluginConfigs.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */

import { IpfsPluginConfig } from "./Ipfs";
import { EthereumPluginConfig } from "./Ethereum";
import { EnsPluginConfig } from "./Ens";

interface PluginConfigs {
  ipfs?: IpfsPluginConfig;
  ethereum?: EthereumPluginConfig;
  ens?: EnsPluginConfig;
}

const modules: Record<string, string> = {
  ipfs: "@polywrap/ipfs-plugin-js",
  ethereum: "@polywrap/ethereum-plugin-js",
  ens: "@polywrap/ens-plugin-js",
};

const uris: Record<string, string> = {
  ipfs: "wrap://ens/ipfs.web3api.eth",
  ethereum: "wrap://ens/ethereum.web3api.eth",
  ens: "wrap://ens/ens.web3api.eth",
};

export { PluginConfigs, modules, uris };
