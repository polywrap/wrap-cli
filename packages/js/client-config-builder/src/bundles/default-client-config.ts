import { ClientConfig, Uri } from "@polywrap/core-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import {
  ethereumPlugin,
  Connection,
  Connections,
} from "@polywrap/ethereum-plugin-js";
import {
  LegacyPluginsResolver,
  LegacyRedirectsResolver,
  IWrapperCache,
  WrapperCache,
  PackageToWrapperCacheResolver,
  RecursiveResolver,
} from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "@polywrap/http-resolver-plugin-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";

export const getDefaultClientConfig = (
  wrapperCache?: IWrapperCache
): ClientConfig<Uri> => {
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
      {
        uri: new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
        env: {
          retries: { tryResolveUri: 1, getFile: 1 },
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
    ],
    plugins: [
      // IPFS is required for downloading Polywrap packages
      {
        uri: new Uri("wrap://ens/ipfs.polywrap.eth"),
        plugin: ipfsPlugin({}),
      },
      // ENS is required for resolving domain to IPFS hashes
      {
        uri: new Uri("wrap://ens/ens-resolver.polywrap.eth"),
        plugin: ensResolverPlugin({}),
      },
      {
        uri: new Uri("wrap://ens/ethereum.polywrap.eth"),
        plugin: ethereumPlugin({
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
        plugin: httpPlugin({}),
      },
      {
        uri: new Uri("wrap://ens/http-resolver.polywrap.eth"),
        plugin: httpResolverPlugin({}),
      },
      {
        uri: new Uri("wrap://ens/js-logger.polywrap.eth"),
        plugin: loggerPlugin({}),
      },
      {
        uri: new Uri("wrap://ens/fs.polywrap.eth"),
        plugin: fileSystemPlugin({}),
      },
      {
        uri: new Uri("wrap://ens/fs-resolver.polywrap.eth"),
        plugin: fileSystemResolverPlugin({}),
      },
      {
        uri: new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
        plugin: ipfsResolverPlugin({}),
      },
    ],
    interfaces: [
      {
        interface: new Uri("wrap://ens/uri-resolver.core.polywrap.eth"),
        implementations: [
          new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
          new Uri("wrap://ens/ens-resolver.polywrap.eth"),
          new Uri("wrap://ens/fs-resolver.polywrap.eth"),
          new Uri("wrap://ens/http-resolver.polywrap.eth"),
        ],
      },
      {
        interface: new Uri("wrap://ens/logger.core.polywrap.eth"),
        implementations: [new Uri("wrap://ens/js-logger.polywrap.eth")],
      },
    ],
    resolver: new RecursiveResolver(
      new PackageToWrapperCacheResolver(wrapperCache ?? new WrapperCache(), [
        new LegacyRedirectsResolver(),
        new LegacyPluginsResolver(),
        new ExtendableUriResolver(),
      ])
    ),
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
