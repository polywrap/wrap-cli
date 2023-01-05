import { ClientConfig } from "../ClientConfig";

import { IUriPackage, Uri, IWrapPackage } from "@polywrap/core-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
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

export const defaultIpfsProviders = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

export const defaultWrappers = {
  sha3: "wrap://ens/goerli/sha3.wrappers.eth",
  uts46: "wrap://ens/goerli/uts46-lite.wrappers.eth",
  graphNode: "wrap://ens/goerli/graph-node.wrappers.eth",
  ensTextRecordResolver:
    "wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY",
  ethereum: "wrap://ipfs/Qmf38QJV1kS2qd1DwLB5zvcDXmf2D8EdrzdBTc4oYbPKeJ",
};

export const defaultPackages = {
  ipfs: "wrap://ens/ipfs.polywrap.eth",
  ensResolver: "wrap://ens/ens-resolver.polywrap.eth",
  ethereumProvider: "wrap://plugin/ethereum-provider",
  http: "wrap://ens/http.polywrap.eth",
  httpResolver: "wrap://ens/http-resolver.polywrap.eth",
  logger: "wrap://plugin/logger",
  fileSystem: "wrap://ens/fs.polywrap.eth",
  fileSystemResolver: "wrap://ens/fs-resolver.polywrap.eth",
  ipfsResolver: "wrap://ens/ipfs-resolver.polywrap.eth",
  concurrent: "wrap://plugin/concurrent",
};

export const defaultInterfaces = {
  uriResolver: "wrap://ens/uri-resolver.core.polywrap.eth",
  concurrent: "wrap://ens/goerli/interface.concurrent.wrappers.eth",
  logger: "wrap://ens/wrappers.polywrap.eth:logger@1.0.0",
  ethereumProvider: "wrap://ens/iprovider.polywrap.eth",
};

export const getDefaultConfig = (): ClientConfig<Uri> => {
  return {
    envs: [
      {
        uri: new Uri(defaultWrappers.graphNode),
        env: {
          provider: "https://api.thegraph.com",
        },
      },
      {
        uri: new Uri(defaultPackages.ipfs),
        env: {
          provider: defaultIpfsProviders[0],
          fallbackProviders: defaultIpfsProviders.slice(1),
        },
      },
    ],
    redirects: [
      {
        from: new Uri("wrap://ens/sha3.polywrap.eth"),
        to: new Uri(defaultWrappers.sha3),
      },
      {
        from: new Uri("wrap://ens/uts46.polywrap.eth"),
        to: new Uri(defaultWrappers.uts46),
      },
      {
        from: new Uri("wrap://ens/graph-node.polywrap.eth"),
        to: new Uri(defaultWrappers.graphNode),
      },
      {
        from: new Uri(defaultInterfaces.logger),
        to: new Uri(defaultPackages.logger),
      },
      {
        from: new Uri("wrap://ens/ethereum.polywrap.eth"),
        to: new Uri(defaultWrappers.ethereum),
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
      {
        interface: new Uri(defaultInterfaces.ethereumProvider),
        implementations: [new Uri(defaultPackages.ethereumProvider)],
      },
    ],
    packages: getDefaultPlugins(),
    wrappers: [],
    resolvers: [],
  };
};

export const getDefaultPlugins = (): IUriPackage<Uri>[] => {
  return [
    // IPFS is required for downloading Polywrap packages
    {
      uri: new Uri(defaultPackages.ipfs),
      package: ipfsPlugin({}),
    },
    // ENS is required for resolving domain to IPFS hashes
    {
      uri: new Uri(defaultPackages.ensResolver),
      package: ensResolverPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.ethereumProvider),
      package: ethereumProviderPlugin({
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
      uri: new Uri(defaultPackages.ipfsResolver),
      package: ipfsResolverPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.concurrent),
      package: concurrentPromisePlugin({}),
    },
  ];
};
