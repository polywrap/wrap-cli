import { IUriPackage, IWrapPackage, Uri } from "@polywrap/core-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { Connection, Connections, ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "@polywrap/http-resolver-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { concurrentPromisePlugin } from "concurrent-plugin-js";
import { defaultWrappers, defaultIpfsProviders } from "../bundles";
import { ClientConfig } from "../types";

const getDefaultPlugins = (): IUriPackage[] => {
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
      // TODO: remove this once types are updated
      package: loggerPlugin({}) as IWrapPackage,
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
    {
      uri: new Uri("wrap://plugin/concurrent"),
      package: concurrentPromisePlugin({}),
    },
  ];
};


export const builtDefaultConfig = (): ClientConfig => ({
  redirects: [
    {
      from: Uri.from("wrap://ens/sha3.polywrap.eth"),
      to: Uri.from(defaultWrappers.sha3)
    },
    {
      from: Uri.from("wrap://ens/uts46.polywrap.eth"),
      to: Uri.from(defaultWrappers.uts46)
    },
    {
      from: Uri.from("wrap://ens/graph-node.polywrap.eth"),
      to: Uri.from(defaultWrappers.graphNode)
    },
    {
      from: Uri.from("wrap://ens/wrappers.polywrap.eth:logger@1.0.0"),
      to: Uri.from("wrap://plugin/logger")
    }
  ],
  envs: [
    {
      uri: Uri.from(defaultWrappers.graphNode),
      env: {
        provider: "https://api.thegraph.com"
      }
    },
    {
      uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
      env: {
        provider: defaultIpfsProviders[0],
        fallbackProviders: defaultIpfsProviders.slice(1)
      }
    }
  ],
  packages: getDefaultPlugins(),
  wrappers: [],
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
      interface: new Uri(defaultWrappers.concurrentInterface),
      implementations: [new Uri("wrap://plugin/concurrent")],
    },
    {
      interface: new Uri("wrap://ens/wrappers.polywrap.eth:logger@1.0.0"),
      implementations: [new Uri("wrap://plugin/logger")],
    },
  ],
  resolvers: [],
});