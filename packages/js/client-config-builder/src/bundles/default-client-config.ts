import {
  ClientConfig,
  Env,
  InterfaceImplementations,
  PluginRegistration,
  Uri,
  UriMap,
  UriRedirect,
} from "@polywrap/core-js";
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
    envs: new UriMap<Env<Uri>>([
      [
        Uri.from(defaultWrappers.graphNode),
        {
          uri: Uri.from(defaultWrappers.graphNode),
          env: {
            provider: "https://api.thegraph.com",
          },
        },
      ],
      [
        Uri.from("wrap://ens/ipfs.polywrap.eth"),
        {
          uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
          env: {
            provider: defaultIpfsProviders[0],
            fallbackProviders: defaultIpfsProviders.slice(1),
          },
        },
      ],
    ]),
    redirects: new UriMap<UriRedirect<Uri>>([
      [
        Uri.from("wrap://ens/sha3.polywrap.eth"),
        {
          from: Uri.from("wrap://ens/sha3.polywrap.eth"),
          to: Uri.from(defaultWrappers.sha3),
        },
      ],
      [
        Uri.from("wrap://ens/uts46.polywrap.eth"),
        {
          from: Uri.from("wrap://ens/uts46.polywrap.eth"),
          to: Uri.from(defaultWrappers.uts46),
        },
      ],
      [
        Uri.from("wrap://ens/graph-node.polywrap.eth"),
        {
          from: Uri.from("wrap://ens/graph-node.polywrap.eth"),
          to: Uri.from(defaultWrappers.graphNode),
        },
      ],
    ]),
    plugins: new UriMap<PluginRegistration<Uri>>([
      // IPFS is required for downloading Polywrap packages
      [
        Uri.from("wrap://ens/ipfs.polywrap.eth"),
        {
          uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
          plugin: ipfsPlugin({}),
        },
      ],
      // ENS is required for resolving domain to IPFS hashes
      [
        Uri.from("wrap://ens/ens-resolver.polywrap.eth"),
        {
          uri: Uri.from("wrap://ens/ens-resolver.polywrap.eth"),
          plugin: ensResolverPlugin({}),
        },
      ],
      [
        Uri.from("wrap://ens/ethereum.polywrap.eth"),
        {
          uri: Uri.from("wrap://ens/ethereum.polywrap.eth"),
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
      ],
      [
        Uri.from("wrap://ens/http.polywrap.eth"),
        {
          uri: Uri.from("wrap://ens/http.polywrap.eth"),
          plugin: httpPlugin({}),
        },
      ],
      [
        Uri.from("wrap://ens/http-resolver.polywrap.eth"),
        {
          uri: Uri.from("wrap://ens/http-resolver.polywrap.eth"),
          plugin: httpResolverPlugin({}),
        },
      ],
      [
        Uri.from("wrap://ens/js-logger.polywrap.eth"),
        {
          uri: Uri.from("wrap://ens/js-logger.polywrap.eth"),
          plugin: loggerPlugin({}),
        },
      ],
      [
        Uri.from("wrap://ens/fs.polywrap.eth"),
        {
          uri: Uri.from("wrap://ens/fs.polywrap.eth"),
          plugin: fileSystemPlugin({}),
        },
      ],
      [
        Uri.from("wrap://ens/fs-resolver.polywrap.eth"),
        {
          uri: Uri.from("wrap://ens/fs-resolver.polywrap.eth"),
          plugin: fileSystemResolverPlugin({}),
        },
      ],
      [
        Uri.from("wrap://ens/ipfs-resolver.polywrap.eth"),
        {
          uri: Uri.from("wrap://ens/ipfs-resolver.polywrap.eth"),
          plugin: ipfsResolverPlugin({}),
        },
      ],
    ]),
    interfaces: new UriMap<InterfaceImplementations<Uri>>([
      [
        Uri.from("wrap://ens/uri-resolver.core.polywrap.eth"),
        {
          interface: Uri.from("wrap://ens/uri-resolver.core.polywrap.eth"),
          implementations: [
            Uri.from("wrap://ens/ipfs-resolver.polywrap.eth"),
            Uri.from("wrap://ens/ens-resolver.polywrap.eth"),
            Uri.from("wrap://ens/fs-resolver.polywrap.eth"),
            Uri.from("wrap://ens/http-resolver.polywrap.eth"),
          ],
        },
      ],
      [
        Uri.from("wrap://ens/logger.core.polywrap.eth"),
        {
          interface: Uri.from("wrap://ens/logger.core.polywrap.eth"),
          implementations: [Uri.from("wrap://ens/js-logger.polywrap.eth")],
        },
      ],
    ]),
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
