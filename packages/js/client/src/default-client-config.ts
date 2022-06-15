import { ClientConfig, WasmWeb3Api } from ".";
import { PluginWeb3Api } from "./plugin/PluginWeb3Api";

import {
  Uri,
  coreInterfaceUris,
  PluginPackage,
  Web3ApiManifest,
  Env,
  ExtendableUriResolver,
  CacheResolver,
  PluginResolver,
  RedirectsResolver,
} from "@polywrap/core-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ensPlugin } from "@polywrap/ens-plugin-js";
import { graphNodePlugin } from "@polywrap/graph-node-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { filesystemPlugin } from "@polywrap/fs-plugin-js";
import { uts46Plugin } from "@polywrap/uts46-plugin-js";
import { sha3Plugin } from "@polywrap/sha3-plugin-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { Tracer } from "@polywrap/tracing-js";

export const getDefaultClientConfig = Tracer.traceFunc(
  "client-js: getDefaultClientConfig",
  (): ClientConfig<Uri> => {
    return {
      envs: [],
      redirects: [],
      plugins: [
        // IPFS is required for downloading Web3API packages
        {
          uri: new Uri("wrap://ens/ipfs.web3api.eth"),
          plugin: ipfsPlugin({
            provider: defaultIpfsProviders[0],
            fallbackProviders: defaultIpfsProviders.slice(1),
          }),
        },
        // ENS is required for resolving domain to IPFS hashes
        {
          uri: new Uri("wrap://ens/ens.web3api.eth"),
          plugin: ensPlugin({}),
        },
        {
          uri: new Uri("wrap://ens/ethereum.web3api.eth"),
          plugin: ethereumPlugin({
            networks: {
              mainnet: {
                provider:
                  "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
              },
            },
          }),
        },
        {
          uri: new Uri("wrap://ens/http.web3api.eth"),
          plugin: httpPlugin({}),
        },
        {
          uri: new Uri("wrap://ens/js-logger.web3api.eth"),
          plugin: loggerPlugin({}),
        },
        {
          uri: new Uri("wrap://ens/uts46.web3api.eth"),
          plugin: uts46Plugin({}),
        },
        {
          uri: new Uri("wrap://ens/sha3.web3api.eth"),
          plugin: sha3Plugin({}),
        },
        {
          uri: new Uri("wrap://ens/graph-node.web3api.eth"),
          plugin: graphNodePlugin({
            provider: "https://api.thegraph.com",
          }),
        },
        {
          uri: new Uri("wrap://ens/fs.web3api.eth"),
          plugin: filesystemPlugin({}),
        },
      ],
      interfaces: [
        {
          interface: coreInterfaceUris.uriResolver,
          implementations: [
            new Uri("wrap://ens/ipfs.web3api.eth"),
            new Uri("wrap://ens/ens.web3api.eth"),
            new Uri("wrap://ens/fs.web3api.eth"),
          ],
        },
        {
          interface: coreInterfaceUris.logger,
          implementations: [new Uri("wrap://ens/js-logger.web3api.eth")],
        },
      ],
      uriResolvers: [
        new RedirectsResolver(),
        new CacheResolver(),
        new PluginResolver(
          (
            uri: Uri,
            plugin: PluginPackage,
            environment: Env<Uri> | undefined
          ) => new PluginWeb3Api(uri, plugin, environment)
        ),
        new ExtendableUriResolver(
          (
            uri: Uri,
            manifest: Web3ApiManifest,
            uriResolver: string,
            environment: Env<Uri> | undefined
          ) => {
            return new WasmWeb3Api(uri, manifest, uriResolver, environment);
          }
        ),
      ],
    };
  }
);

export const defaultIpfsProviders = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];
