import { ethereumProviderPlugin, Connections } from "ethereum-provider-js";
import { PolywrapClient } from "@polywrap/client-js";
import {
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  StaticResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { embeddedWrappers } from "@polywrap/test-env-js";
import {
  ClientConfigBuilder,
  defaultInterfaces,
  defaultIpfsProviders,
  defaultPackages,
  defaultWrappers,
} from "@polywrap/client-config-builder-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";

export function getClient(connections: Connections): PolywrapClient {
  const uriResolver = RecursiveResolver.from(
    PackageToWrapperCacheResolver.from(
      [
        StaticResolver.from([
          {
            from: "wrap://ens/uts46.polywrap.eth",
            to: embeddedWrappers.uts46,
          },
          {
            from: "wrap://ens/sha3.polywrap.eth",
            to: embeddedWrappers.sha3,
          },
          {
            from: "wrap://ens/ethereum.polywrap.eth",
            to: defaultWrappers.ethereum,
          },
          {
            uri: defaultPackages.fileSystem,
            package: fileSystemPlugin({}),
          },
          {
            uri: defaultPackages.fileSystemResolver,
            package: fileSystemResolverPlugin({}),
          },
          {
            uri: defaultPackages.ipfs,
            package: ipfsPlugin({}),
          },
          {
            uri: defaultPackages.ipfsResolver,
            package: ipfsResolverPlugin({}),
          },
          {
            uri: defaultPackages.http,
            package: httpPlugin({}),
          },
          {
            uri: defaultPackages.ensResolver,
            package: ensResolverPlugin({}),
          },
          {
            uri: defaultPackages.ethereumProvider,
            package: ethereumProviderPlugin({ connections }),
          },
        ]),
        new ExtendableUriResolver(),
      ],
      new WrapperCache()
    )
  );
  const coreClientConfig = new ClientConfigBuilder(undefined, uriResolver)
    .addEnv(defaultPackages.ipfs, {
      provider: defaultIpfsProviders[0],
      fallbackProviders: defaultIpfsProviders.slice(1),
    })
    .addEnv(defaultPackages.ipfsResolver, {
      retries: { tryResolveUri: 2, getFile: 2 },
    })
    .addInterfaceImplementations(ExtendableUriResolver.extInterfaceUri, [
      defaultPackages.fileSystemResolver,
      defaultPackages.ipfsResolver,
      defaultPackages.ensResolver,
    ])
    .addInterfaceImplementation(
      defaultInterfaces.ethereumProvider,
      defaultPackages.ethereumProvider
    )
    .buildCoreConfig();

  return new PolywrapClient(coreClientConfig, { noDefaults: true });
}
