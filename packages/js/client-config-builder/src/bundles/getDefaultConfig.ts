import { ClientConfig } from "../ClientConfig";

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

// $start: getDefaultConfig

export const defaultIpfsProviders = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

export const defaultWrappers = {
  sha3: "wrap://ens/wrappers.polywrap.eth:sha3@1.0.0",
  uts46: "wrap://ens/wrappers.polywrap.eth:uts46@1.0.0",
  graphNode: "wrap://ens/wrappers.polywrap.eth:graph-node@1.0.0",
  ensTextRecordResolver:
    "wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY",
};

export const defaultEmbeddedWrapperPaths = {
  ipfsHttpClient: path.join(__dirname, "wrappers", "ipfs-http-client"),
  ipfsResolver: path.join(__dirname, "wrappers", "ipfs-resolver"),
};

export const defaultPackages = {
  ensResolver: "wrap://ens/ens-resolver.polywrap.eth",
  ethereum: "wrap://ens/ethereum.polywrap.eth",
  http: "wrap://package/http",
  httpResolver: "wrap://package/http-resolver",
  logger: "wrap://package/logger",
  fileSystem: "wrap://package/fs",
  fileSystemResolver: "wrap://package/fs-resolver",
  concurrent: "wrap://package/concurrent",
  ipfsHttpClient: "wrap://ens/wrappers.polywrap.eth:ipfs-http-client@1.0.0",
  ipfsResolver: "wrap://package/ipfs-resolver",
};

export const defaultInterfaces = {
  uriResolver: "wrap://ens/uri-resolver.core.polywrap.eth",
  concurrent: "wrap://ens/wrappers.polywrap.eth:concurrent@1.0.0",
  logger: "wrap://ens/wrappers.polywrap.eth:logger@1.0.0",
  http: "wrap://ens/wrappers.polywrap.eth:http@1.1.0",
  fileSystem: "wrap://ens/wrappers.polywrap.eth:file-system@1.0.0",
};

export const getDefaultConfig = (): ClientConfig<Uri> => {
  return {
    envs: [
      {
        uri: new Uri(defaultPackages.ipfsResolver),
        env: {
          provider: defaultIpfsProviders[0],
          fallbackProviders: defaultIpfsProviders.slice(1),
        },
      },
    ],
    redirects: [
      {
        from: new Uri(defaultInterfaces.logger),
        to: new Uri(defaultPackages.logger),
      },
      {
        from: new Uri(defaultInterfaces.http),
        to: new Uri(defaultPackages.http),
      },
      {
        from: new Uri(defaultInterfaces.fileSystem),
        to: new Uri(defaultPackages.fileSystem),
      },
    ],
    interfaces: [
      {
        interface: new Uri(defaultInterfaces.uriResolver),
        implementations: [
          new Uri(defaultPackages.ipfsResolver),
          new Uri(defaultPackages.ensResolver),
          new Uri(defaultPackages.fileSystemResolver),
          new Uri(defaultPackages.httpResolver),
          new Uri(defaultWrappers.ensTextRecordResolver),
        ],
      },
      {
        interface: new Uri(defaultInterfaces.logger),
        implementations: [new Uri(defaultPackages.logger)],
      },
      {
        interface: new Uri(defaultInterfaces.concurrent),
        implementations: [new Uri(defaultPackages.concurrent)],
      },
    ],
    packages: getDefaultPackages(),
    wrappers: [],
    resolvers: [],
  };
};

export const getDefaultPackages = (): IUriPackage<Uri>[] => {
  const ipfsHttpClientPath = defaultEmbeddedWrapperPaths.ipfsHttpClient;
  const ipfsResolverPath = defaultEmbeddedWrapperPaths.ipfsResolver;

  return [
    // IPFS is required for downloading Polywrap packages
    {
      uri: new Uri(defaultPackages.ipfsHttpClient),
      package: WasmPackage.from(
        fs.readFileSync(path.join(ipfsHttpClientPath, "wrap.info")),
        fs.readFileSync(path.join(ipfsHttpClientPath, "wrap.wasm"))
      ),
    },
    {
      uri: new Uri(defaultPackages.ipfsResolver),
      package: WasmPackage.from(
        fs.readFileSync(path.join(ipfsResolverPath, "wrap.info")),
        fs.readFileSync(path.join(ipfsResolverPath, "wrap.wasm"))
      ),
    },
    // ENS is required for resolving domain to IPFS hashes
    {
      uri: new Uri(defaultPackages.ensResolver),
      package: ensResolverPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.ethereum),
      package: ethereumPlugin({
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
    },
    {
      uri: new Uri(defaultPackages.http),
      package: httpPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.httpResolver),
      package: httpResolverPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.logger),
      // TODO: remove this once types are updated
      package: loggerPlugin({}) as IWrapPackage,
    },
    {
      uri: new Uri(defaultPackages.fileSystem),
      package: fileSystemPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.fileSystemResolver),
      package: fileSystemResolverPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.concurrent),
      package: concurrentPromisePlugin({}),
    },
  ];
};

// $end
