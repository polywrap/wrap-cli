import { ClientConfig } from "../ClientConfig";

import { IUriPackage, Uri } from "@polywrap/core-js";
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
        uri: new Uri("wrap://ens/ipfs.polywrap.eth"),
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
        from: new Uri("wrap://ens/wrappers.polywrap.eth:logger@1.0.0"),
        to: new Uri("wrap://plugin/logger")
      }
    ],
    interfaces: [
      {
        interface: new Uri("wrap://ens/uri-resolver.core.polywrap.eth"),
        implementations: [
          new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
          new Uri("wrap://ens/ens-resolver.polywrap.eth"),
          new Uri("wrap://ens/fs-resolver.polywrap.eth"),
          new Uri("wrap://ens/http-resolver.polywrap.eth"),
          // ens-text-record-resolver
          new Uri("wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY"),
        ],
      },
      {
        interface: new Uri("wrap://ens/wrappers.polywrap.eth:logger@1.0.0"),
        implementations: [new Uri("wrap://plugin/logger")],
      },
    ],
    packages: getDefaultPlugins(),
    wrappers: [],
    resolvers: [],
  };
};

export const defaultIpfsProviders = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

export const defaultWrappers = {
  sha3: "wrap://ens/goerli/sha3.wrappers.eth",
  uts46: "wrap://ens/goerli/uts46-lite.wrappers.eth",
  graphNode: "wrap://ens/goerli/graph-node.wrappers.eth",
};

export const getDefaultPlugins = (): IUriPackage<Uri>[] => {
  return [
    // IPFS is required for downloading Polywrap packages
    {
      uri: new Uri("wrap://ens/ipfs.polywrap.eth"),
      package: ipfsPlugin({}),
    },
    // ENS is required for resolving domain to IPFS hashes
    {
      uri: new Uri("wrap://ens/ens-resolver.polywrap.eth"),
      package: ensResolverPlugin({}),
    },
    {
      uri: new Uri("wrap://ens/ethereum.polywrap.eth"),
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
      uri: new Uri("wrap://ens/http.polywrap.eth"),
      package: httpPlugin({}),
    },
    {
      uri: new Uri("wrap://ens/http-resolver.polywrap.eth"),
      package: httpResolverPlugin({}),
    },
    {
      uri: new Uri("wrap://plugin/logger"),
      package: loggerPlugin({}),
    },
    {
      uri: new Uri("wrap://ens/fs.polywrap.eth"),
      package: fileSystemPlugin({}),
    },
    {
      uri: new Uri("wrap://ens/fs-resolver.polywrap.eth"),
      package: fileSystemResolverPlugin({}),
    },
    {
      uri: new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
      package: ipfsResolverPlugin({}),
    },
  ];
};
