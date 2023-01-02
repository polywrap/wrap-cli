import { BuilderConfig } from "../types/configs/BuilderConfig";
import { TUri } from "../types/IClientConfigBuilder";

import { IWrapPackage } from "@polywrap/core-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import {
  ethereumPlugin,
  Connection,
  Connections,
} from "@polywrap/ethereum-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "@polywrap/http-resolver-plugin-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { concurrentPromisePlugin } from "concurrent-plugin-js";

export const defaultIpfsProviders = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

export const defaultWrappers = {
  sha3: "wrap://ens/goerli/sha3.wrappers.eth",
  uts46: "wrap://ens/goerli/uts46-lite.wrappers.eth",
  graphNode: "wrap://ens/goerli/graph-node.wrappers.eth",
  concurrentInterface: "wrap://ens/goerli/interface.concurrent.wrappers.eth",
};

export const getDefaultPlugins = (): Record<TUri, IWrapPackage> => {
  return {
    // IPFS is required for downloading Polywrap packages
    "wrap://ens/ipfs.polywrap.eth": ipfsPlugin({}),
    // ENS is required for resolving domain to IPFS hashes
    "wrap://ens/ens-resolver.polywrap.eth": ensResolverPlugin({}),
    // Ethereum is required for resolving domain to Ethereum addresses
    "wrap://ens/ethereum.polywrap.eth": ethereumPlugin({
      connections: new Connections({
        networks: {
          mainnet: new Connection({
            provider:
              "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          }),
          goerli: new Connection({
            provider:
              "https://goerli.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          }),
        },
      }),
    }),
    "wrap://ens/http.polywrap.eth": httpPlugin({}),
    "wrap://ens/http-resolver.polywrap.eth": httpResolverPlugin({}),
    "wrap://plugin/logger": loggerPlugin({}) as IWrapPackage,
    "wrap://ens/fs.polywrap.eth": fileSystemPlugin({}),
    "wrap://ens/fs-resolver.polywrap.eth": fileSystemResolverPlugin({}),
    "wrap://ens/ipfs-resolver.polywrap.eth": ipfsResolverPlugin({}),
    "wrap://plugin/concurrent": concurrentPromisePlugin({}),
  };
};

export const getDefaultConfig = (): BuilderConfig => ({
  redirects: {
    "wrap://ens/sha3.polywrap.eth": defaultWrappers.sha3,
    "wrap://ens/uts46.polywrap.eth": defaultWrappers.uts46,
    "wrap://ens/graph-node.polywrap.eth": defaultWrappers.graphNode,
    "wrap://ens/wrappers.polywrap.eth:logger@1.0.0": "wrap://plugin/logger",
  },
  envs: {
    [defaultWrappers.graphNode]: {
      provider: "https://api.thegraph.com",
    },
    "wrap://ens/ipfs.polywrap.eth": {
      provider: defaultIpfsProviders[0],
      fallbackProviders: defaultIpfsProviders.slice(1),
    },
  },
  packages: getDefaultPlugins(),
  wrappers: {},
  interfaces: {
    "wrap://ens/uri-resolver.core.polywrap.eth": new Set([
      "wrap://ens/ipfs-resolver.polywrap.eth",
      "wrap://ens/ens-resolver.polywrap.eth",
      "wrap://ens/fs-resolver.polywrap.eth",
      "wrap://ens/http-resolver.polywrap.eth",
      // ens-text-record-resolver
      "wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY",
    ]),
    [defaultWrappers.concurrentInterface]: new Set([
      "wrap://plugin/concurrent",
    ]),
    "wrap://ens/wrappers.polywrap.eth:logger@1.0.0": new Set([
      "wrap://plugin/logger",
    ]),
  },
  resolvers: [],
});
