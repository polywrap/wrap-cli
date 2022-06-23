/// NOTE: This is an auto-generated file. See scripts/extractPluginConfigs.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */

import { IpfsPluginConfig } from "./Ipfs";
import { EthereumPluginConfig } from "./Ethereum";
import { EnsResolverPluginConfig } from "./Ens";

interface PluginConfigs {
  ipfs?: IpfsPluginConfig;
  ethereum?: EthereumPluginConfig;
  ens?: EnsResolverPluginConfig;
}

const modules: Record<string, string> = {
  ipfs: "@polywrap/ipfs-plugin-js",
  ethereum: "@polywrap/ethereum-plugin-js",
  ens: "@polywrap/ens-resolver-plugin-js",
};

const uris: Record<string, string> = {
  ipfs: "wrap://ens/ipfs.polywrap.eth",
  ethereum: "wrap://ens/ethereum.polywrap.eth",
  ens: "wrap://ens/ens-resolver.polywrap.eth",
};

export { PluginConfigs, modules, uris };
