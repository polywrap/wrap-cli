import { BuilderConfig } from "../types/configs/BuilderConfig";

import { IUriPackage, Uri, IWrapPackage } from "@polywrap/core-js";
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
import path from "path";
import { WasmPackage } from "@polywrap/wasm-js";
import * as fs from "fs";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";

// $start: getDefaultConfig

export const defaultIpfsProviders = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

export const defaultEmbeddedWrapperPaths = {
  ipfsHttpClient: path.join(__dirname, "wrappers", "ipfs-http-client"),
  ipfsResolver: path.join(__dirname, "wrappers", "ipfs-resolver"),
};

export const defaultWrappers = {
  sha3: "wrap://ens/wrappers.polywrap.eth:sha3@1.0.0",
  uts46: "wrap://ens/wrappers.polywrap.eth:uts46@1.0.0",
  graphNode: "wrap://ens/wrappers.polywrap.eth:graph-node@1.0.0",
  ensTextRecordResolver:
    "wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY",
};

export const defaultPackages = {
  ensResolver: "wrap://package/ens-resolver",
  ethereum: "wrap://ens/ethereum.polywrap.eth",
  httpResolver: "wrap://package/http-resolver",
  fileSystemResolver: "wrap://package/fs-resolver",
  ipfsResolver: "wrap://package/ipfs-resolver",
};

export const defaultInterfaces = {
  concurrent: "wrap://ens/wrappers.polywrap.eth:concurrent@1.0.0",
  logger: "wrap://ens/wrappers.polywrap.eth:logger@1.0.0",
  http: "wrap://ens/wrappers.polywrap.eth:http@1.1.0",
  fileSystem: "wrap://ens/wrappers.polywrap.eth:file-system@1.0.0",
  ipfsHttpClient: "wrap://ens/wrappers.polywrap.eth:ipfs-http-client@1.0.0",
};

export const getDefaultPlugins = (): Record<string, IWrapPackage> => {
  const ipfsHttpClientPath = defaultEmbeddedWrapperPaths.ipfsHttpClient;
  const ipfsResolverPath = defaultEmbeddedWrapperPaths.ipfsResolver;

  return {
    [defaultInterfaces.ipfsHttpClient]: WasmPackage.from(
      fs.readFileSync(path.join(ipfsHttpClientPath, "wrap.info")),
      fs.readFileSync(path.join(ipfsHttpClientPath, "wrap.wasm"))
    ),
    [defaultPackages.ipfsResolver]: WasmPackage.from(
      fs.readFileSync(path.join(ipfsResolverPath, "wrap.info")),
      fs.readFileSync(path.join(ipfsResolverPath, "wrap.wasm"))
    ),
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
    [defaultInterfaces.http]: httpPlugin({}),
    [defaultPackages.httpResolver]: httpResolverPlugin({}),
    [defaultInterfaces.logger]: loggerPlugin({}) as IWrapPackage,
    [defaultInterfaces.fileSystem]: fileSystemPlugin({}),
    [defaultPackages.fileSystemResolver]: fileSystemResolverPlugin({}),
    [defaultPackages.ipfsResolver]: ipfsResolverPlugin({}),
    [defaultInterfaces.concurrent]: concurrentPromisePlugin({}),
  };
};

export const getDefaultConfig = (): BuilderConfig => ({
  redirects: {
    // TODO: remove sha3 and uts46 redirects when ethereum wrapper is merged (used by updated ens wrapper)
    "wrap://ens/sha3.polywrap.eth": "wrap://ipfs/QmThRxFfr7Hj9Mq6WmcGXjkRrgqMG3oD93SLX27tinQWy5",
    "wrap://ens/uts46.polywrap.eth": "wrap://ipfs/QmPL9Njg3rGkpoJyoy8pZ5fTavjvHxNuuuiGRApzyGESZB",
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
    [defaultPackages.ipfsResolver]: {
      provider: defaultIpfsProviders[0],
      fallbackProviders: defaultIpfsProviders.slice(1),
      retries: { tryResolveUri: 1, getFile: 1 },
    },
  },
  packages: getDefaultPlugins(),
  wrappers: {},
  interfaces: {
    [ExtendableUriResolver.extInterfaceUri]: new Set([
      defaultPackages.ipfsResolver,
      defaultPackages.ensResolver,
      defaultPackages.fileSystemResolver,
      defaultPackages.httpResolver,
      defaultWrappers.ensTextRecordResolver,
    ]),
    [defaultInterfaces.logger]: new Set([defaultInterfaces.logger]),
    [defaultInterfaces.concurrent]: new Set([defaultInterfaces.concurrent]),
    [defaultInterfaces.ipfsHttpClient]: new Set([defaultInterfaces.ipfsHttpClient]),
    [defaultInterfaces.fileSystem]: new Set([defaultInterfaces.fileSystem]),
    [defaultInterfaces.http]: new Set([defaultInterfaces.http]),
  },
  resolvers: [],
});
// $end