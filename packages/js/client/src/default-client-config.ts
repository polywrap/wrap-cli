import { ClientConfig, WasmWeb3Api } from ".";
import { PluginWeb3Api } from "./plugin/PluginWeb3Api";

import {
  Uri,
  coreInterfaceUris,
  PluginPackage,
  Web3ApiManifest,
  Env,
  ApiAggregatorResolver,
  CacheResolver,
  PluginResolver,
  RedirectsResolver,
} from "@web3api/core-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { graphNodePlugin } from "@web3api/graph-node-plugin-js";
import { httpPlugin } from "@web3api/http-plugin-js";
import { filesystemPlugin } from "@web3api/fs-plugin-js";
import { uts46Plugin } from "@web3api/uts46-plugin-js";
import { sha3Plugin } from "@web3api/sha3-plugin-js";
import { loggerPlugin } from "@web3api/logger-plugin-js";
import { Tracer } from "@web3api/tracing-js";

export const getDefaultClientConfig = Tracer.traceFunc(
  "client-js: getDefaultClientConfig",
  (): ClientConfig<Uri> => {
    return {
      envs: [],
      redirects: [],
      plugins: [
        // IPFS is required for downloading Web3API packages
        {
          uri: new Uri("w3://ens/ipfs.web3api.eth"),
          plugin: ipfsPlugin({
            provider: defaultIpfsProviders[0],
            fallbackProviders: defaultIpfsProviders.slice(1),
          }),
        },
        // ENS is required for resolving domain to IPFS hashes
        {
          uri: new Uri("w3://ens/ens.web3api.eth"),
          plugin: ensPlugin({}),
        },
        {
          uri: new Uri("w3://ens/ethereum.web3api.eth"),
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
          uri: new Uri("w3://ens/http.web3api.eth"),
          plugin: httpPlugin(),
        },
        {
          uri: new Uri("w3://ens/js-logger.web3api.eth"),
          plugin: loggerPlugin(),
        },
        {
          uri: new Uri("w3://ens/uts46.web3api.eth"),
          plugin: uts46Plugin(),
        },
        {
          uri: new Uri("w3://ens/sha3.web3api.eth"),
          plugin: sha3Plugin(),
        },
        {
          uri: new Uri("w3://ens/graph-node.web3api.eth"),
          plugin: graphNodePlugin({
            provider: "https://api.thegraph.com",
          }),
        },
        {
          uri: new Uri("w3://ens/fs.web3api.eth"),
          plugin: filesystemPlugin(),
        },
      ],
      interfaces: [
        {
          interface: coreInterfaceUris.uriResolver,
          implementations: [
            new Uri("w3://ens/ipfs.web3api.eth"),
            new Uri("w3://ens/ens.web3api.eth"),
            new Uri("w3://ens/fs.web3api.eth"),
          ],
        },
        {
          interface: coreInterfaceUris.logger,
          implementations: [new Uri("w3://ens/js-logger.web3api.eth")],
        },
      ],
      resolvers: [
        new RedirectsResolver(),
        new PluginResolver(
          (
            uri: Uri,
            plugin: PluginPackage,
            environment: Env<Uri> | undefined
          ) => new PluginWeb3Api(uri, plugin, environment)
        ),
        new CacheResolver(),
        new ApiAggregatorResolver(
          (
            uri: Uri,
            manifest: Web3ApiManifest,
            uriResolver: Uri,
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
