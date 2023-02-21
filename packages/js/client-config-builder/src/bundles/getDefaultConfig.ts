import { BuilderConfig } from "../types";
import * as ipfsHttpClient from "./wrappers/ipfs-http-client/wrap";
import * as ipfsResolver from "./wrappers/ipfs-resolver/wrap";

import { IWrapPackage } from "@polywrap/core-js";
import {
  ethereumProviderPlugin,
  Connection,
  Connections,
} from "ethereum-provider-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "@polywrap/http-resolver-plugin-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { concurrentPromisePlugin } from "concurrent-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";

// $start: getDefaultConfig
export const defaultIpfsProviders = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

export const defaultEmbeddedPackages = {
  ipfsHttpClient: (): IWrapPackage => ipfsHttpClient.wasmPackage,
  ipfsResolver: (): IWrapPackage => ipfsResolver.wasmPackage,
};

export const defaultWrappers = {
  sha3: "wrap://ens/wraps.eth:sha3@1.0.0",
  uts46: "wrap://ens/wraps.eth:uts46@1.0.0",
  graphNode: "wrap://ens/wraps.eth:graph-node@1.0.0",
  ensTextRecordResolver:
    "wrap://ipfs/Qmf2AFb2NotbDfERtc8VdfF9fsCRtk2UzRCKJ1GCY1eQzG",
  ethereum: "wrap://ens/wraps.eth:ethereum@1.1.0",
  ens: "wrap://ens/wraps.eth:ens@1.1.0",
};

export const defaultPackages = {
  ensResolver: "wrap://package/ens-resolver",
  httpResolver: "wrap://package/http-resolver",
  fileSystemResolver: "wrap://package/fs-resolver",
  ipfsResolver: "wrap://package/ipfs-resolver",
};

export const defaultInterfaces = {
  concurrent: "wrap://ens/wraps.eth:concurrent@1.0.0",
  logger: "wrap://ens/wraps.eth:logger@1.0.0",
  http: "wrap://ens/wraps.eth:http@1.1.0",
  fileSystem: "wrap://ens/wraps.eth:file-system@1.0.0",
  ipfsHttpClient: "wrap://ens/wraps.eth:ipfs-http-client@1.0.0",
  ethereumProvider: "wrap://ens/wraps.eth:ethereum-provider@1.1.0",
};

export const getDefaultPackages = (): Record<string, IWrapPackage> => {
  return {
    [defaultInterfaces.ipfsHttpClient]: defaultEmbeddedPackages.ipfsHttpClient(),
    [defaultPackages.ipfsResolver]: defaultEmbeddedPackages.ipfsResolver(),
    // ENS is required for resolving domain to IPFS hashes
    [defaultPackages.ensResolver]: ensResolverPlugin({}),
    // Ethereum is required for resolving domain to Ethereum addresses
    [defaultInterfaces.ethereumProvider]: ethereumProviderPlugin({
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
    [defaultInterfaces.concurrent]: concurrentPromisePlugin({}),
  };
};

export const getDefaultConfig = (): BuilderConfig => ({
  envs: {
    [defaultPackages.ipfsResolver]: {
      provider: defaultIpfsProviders[0],
      fallbackProviders: defaultIpfsProviders.slice(1),
      retries: { tryResolveUri: 2, getFile: 2 },
    },
  },
  interfaces: {
    [ExtendableUriResolver.extInterfaceUri.uri]: new Set([
      defaultPackages.ipfsResolver,
      defaultPackages.ensResolver,
      defaultPackages.fileSystemResolver,
      defaultPackages.httpResolver,
      defaultWrappers.ensTextRecordResolver,
    ]),
    [defaultInterfaces.logger]: new Set([defaultInterfaces.logger]),
    [defaultInterfaces.concurrent]: new Set([defaultInterfaces.concurrent]),
    [defaultInterfaces.ipfsHttpClient]: new Set([
      defaultInterfaces.ipfsHttpClient,
    ]),
    [defaultInterfaces.fileSystem]: new Set([defaultInterfaces.fileSystem]),
    [defaultInterfaces.http]: new Set([defaultInterfaces.http]),
    [defaultInterfaces.ethereumProvider]: new Set([
      defaultInterfaces.ethereumProvider,
    ]),
  },
  redirects: {},
  wrappers: {},
  packages: getDefaultPackages(),
  resolvers: [],
});
// $end
