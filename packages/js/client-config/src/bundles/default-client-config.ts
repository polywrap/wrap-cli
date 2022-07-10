import { WasmWrapper } from "./index";
import { PluginWrapper } from "./plugin/PluginWrapper";
import { ClientConfig } from "@polywrap/core-js";

import {
  Uri,
  PluginPackage,
  Env,
  ExtendableUriResolver,
  CacheResolver,
  PluginResolver,
  RedirectsResolver,
} from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { graphNodePlugin } from "@polywrap/graph-node-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { uts46Plugin } from "@polywrap/uts46-plugin-js";
import { sha3Plugin } from "@polywrap/sha3-plugin-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { Tracer } from "@polywrap/tracing-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";

export const getDefaultClientConfig = Tracer.traceFunc(
  "client-js: getDefaultClientConfig",
  (): ClientConfig => {
    return {
      envs: [],
      redirects: [],
      plugins: [
        // IPFS is required for downloading Polywrap packages
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({
            provider: defaultIpfsProviders[0],
            fallbackProviders: defaultIpfsProviders.slice(1),
          }),
        },
        // ENS is required for resolving domain to IPFS hashes
        {
          uri: "wrap://ens/ens-resolver.polywrap.eth",
          plugin: ensResolverPlugin({}),
        },
        {
          uri: "wrap://ens/ethereum.polywrap.eth",
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
          uri: "wrap://ens/http.polywrap.eth",
          plugin: httpPlugin({}),
        },
        {
          uri: "wrap://ens/js-logger.polywrap.eth",
          plugin: loggerPlugin({}),
        },
        {
          uri: "wrap://ens/uts46.polywrap.eth",
          plugin: uts46Plugin({}),
        },
        {
          uri: "wrap://ens/sha3.polywrap.eth",
          plugin: sha3Plugin({}),
        },
        {
          uri: "wrap://ens/graph-node.polywrap.eth",
          plugin: graphNodePlugin({
            provider: "https://api.thegraph.com",
          }),
        },
        {
          uri: "wrap://ens/fs.polywrap.eth",
          plugin: fileSystemPlugin({}),
        },
        {
          uri: "wrap://ens/fs-resolver.polywrap.eth",
          plugin: fileSystemResolverPlugin({}),
        },
        {
          uri: "wrap://ens/ipfs-resolver.polywrap.eth",
          plugin: ipfsResolverPlugin({
            provider: defaultIpfsProviders[0],
            fallbackProviders: defaultIpfsProviders.slice(1),
          }),
        },
      ],
      interfaces: [
        {
          interface: "wrap://ens/uri-resolver.core.polywrap.eth",
          implementations: [
            "wrap://ens/ipfs-resolver.polywrap.eth",
            "wrap://ens/ens-resolver.polywrap.eth",
            "wrap://ens/fs-resolver.polywrap.eth",
          ],
        },
        {
          interface: "wrap://ens/logger.core.polywrap.eth",
          implementations: ["wrap://ens/js-logger.polywrap.eth"],
        },
      ],
      uriResolvers: [
        new RedirectsResolver(),
        new CacheResolver(),
        new PluginResolver(
          (
            uri: Uri,
            plugin: PluginPackage<unknown>,
            environment: Env<Uri> | undefined
          ) => new PluginWrapper(uri, plugin, environment)
        ),
        new ExtendableUriResolver(
          (
            uri: Uri,
            manifest: WrapManifest,
            uriResolver: string,
            environment: Env<Uri> | undefined
          ) => {
            return new WasmWrapper(uri, manifest, uriResolver, environment);
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
