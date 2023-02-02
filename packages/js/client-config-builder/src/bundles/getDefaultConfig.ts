import { BuilderConfig } from "../types/configs/BuilderConfig";

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

// $start: getDefaultConfig

export const defaultIpfsProviders = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

export const defaultWrappers = {
  sha3: "wrap://ens/goerli/sha3.wrappers.eth",
  uts46: "wrap://ens/goerli/uts46-lite.wrappers.eth",
  graphNode: "wrap://ens/goerli/graph-node.wrappers.eth",
  concurrentInterface: "wrap://ens/goerli/interface.concurrent.wrappers.eth", //
  ensTextRecordResolver:
    "wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY",
};

export const defaultPackages = {
  ipfs: "wrap://ens/ipfs.polywrap.eth",
  ensResolver: "wrap://ens/ens-resolver.polywrap.eth",
  ethereum: "wrap://ens/ethereum.polywrap.eth",
  http: "wrap://plugin/http",
  httpResolver: "wrap://ens/http-resolver.polywrap.eth",
  logger: "wrap://plugin/logger",
  fileSystem: "wrap://plugin/fs",
  fileSystemResolver: "wrap://ens/fs-resolver.polywrap.eth",
  ipfsResolver: "wrap://ens/ipfs-resolver.polywrap.eth",
  concurrent: "wrap://plugin/concurrent",
};

export const defaultInterfaces = {
  uriResolver: "wrap://ens/uri-resolver.core.polywrap.eth",
  concurrent: "wrap://ens/wrappers.polywrap.eth:concurrent@1.0.0",
  logger: "wrap://ens/wrappers.polywrap.eth:logger@1.0.0",
  http: "wrap://ens/wrappers.polywrap.eth:http@1.1.0",
  fileSystem: "wrap://ens/wrappers.polywrap.eth:file-system@1.0.0",
};

export const getDefaultPlugins = (): Record<string, IWrapPackage> => {
  return {
    // IPFS is required for downloading Polywrap packages
    [defaultPackages.ipfs]: ipfsPlugin({}),
    // ENS is required for resolving domain to IPFS hashes
    [defaultPackages.ensResolver]: ensResolverPlugin({}),
    // Ethereum is required for resolving domain to Ethereum addresses
    [defaultPackages.ethereum]: ethereumPlugin({
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
    [defaultPackages.http]: httpPlugin({}),
    [defaultPackages.httpResolver]: httpResolverPlugin({}),
    [defaultPackages.logger]: loggerPlugin({}) as IWrapPackage,
    [defaultPackages.fileSystem]: fileSystemPlugin({}),
    [defaultPackages.fileSystemResolver]: fileSystemResolverPlugin({}),
    [defaultPackages.ipfsResolver]: ipfsResolverPlugin({}),
    [defaultPackages.concurrent]: concurrentPromisePlugin({}),
  };
};

export const getDefaultConfig = (): BuilderConfig => ({
  redirects: {
    "wrap://ens/sha3.polywrap.eth": defaultWrappers.sha3,
    "wrap://ens/uts46.polywrap.eth": defaultWrappers.uts46,
    "wrap://ens/graph-node.polywrap.eth": defaultWrappers.graphNode,
    [defaultInterfaces.logger]: defaultPackages.logger,
    ["wrap://ens/http.polywrap.eth"]: defaultInterfaces.http,
    [defaultInterfaces.http]: defaultPackages.http,
    "wrap://ens/fs.polywrap.eth": defaultInterfaces.fileSystem,
    [defaultInterfaces.fileSystem]: defaultPackages.fileSystem,
  },
  envs: {
    [defaultWrappers.graphNode]: {
      provider: "https://api.thegraph.com",
    },
    [defaultPackages.ipfs]: {
      provider: defaultIpfsProviders[0],
      fallbackProviders: defaultIpfsProviders.slice(1),
    },
  },
  packages: getDefaultPlugins(),
  wrappers: {},
  interfaces: {
    [defaultInterfaces.uriResolver]: new Set([
      defaultPackages.ipfsResolver,
      defaultPackages.ensResolver,
      defaultPackages.fileSystemResolver,
      defaultPackages.httpResolver,
      // ens-text-record-resolver
      defaultWrappers.ensTextRecordResolver,
    ]),
    [defaultInterfaces.logger]: new Set([defaultPackages.logger]),
    [defaultWrappers.concurrentInterface]: new Set([
      defaultPackages.concurrent,
    ]),
  },
  resolvers: [],
});
// $end
