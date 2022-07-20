/// NOTE: This is an auto-generated file. See scripts/extractPluginConfigs.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */

import { EthereumPluginConfig } from "./Ethereum";
import { EnsResolverPluginConfig } from "./Ens";

interface PluginConfigs {
  ethereum?: EthereumPluginConfig;
  ens?: EnsResolverPluginConfig;
}

const modules: Record<string, string> = {
  ethereum: "@polywrap/ethereum-plugin-js",
  ens: "@polywrap/ens-resolver-plugin-js",
};

const uris: Record<string, string> = {
  ethereum: "wrap://ens/ethereum.polywrap.eth",
  ens: "wrap://ens/ens-resolver.polywrap.eth",
};

export { PluginConfigs, modules, uris };
