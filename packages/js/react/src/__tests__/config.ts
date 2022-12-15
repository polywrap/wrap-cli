import { Env, InterfaceImplementations, IUriPackage, IUriRedirect, Uri } from "@polywrap/core-js";
import { plugin as ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  Connection,
  Connections,
  ethereumProviderPlugin,
} from "ethereum-provider-js";
import { plugin as ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { defaultIpfsProviders, defaultWrappers } from "@polywrap/client-config-builder-js";

export function createPlugins(
  ensAddress: string,
  ethereumProvider: string
): IUriPackage<Uri | string>[] {
  return [
    {
      uri: "wrap://plugin/ethereum-provider",
      package: ethereumProviderPlugin({
        connections: new Connections({
          networks: {
            testnet: new Connection({ provider: ethereumProvider }),
          },
        }),
      }),
    },
    {
      uri: "wrap://ens/ipfs.polywrap.eth",
      package: ipfsPlugin({}),
    },
    {
      uri: "wrap://ens/ens-resolver.polywrap.eth",
      package: ensResolverPlugin({
        addresses: {
          testnet: ensAddress,
        },
      }),
    },
  ];
}

export function createEnvs(ipfsProvider: string): Env[] {
  return [
    {
      uri: "wrap://ens/ipfs.polywrap.eth",
      env: {
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
      },
    },
  ];
}

export function createInterfaces(): InterfaceImplementations<Uri | string>[] {
  return [
    {
      interface: defaultWrappers.ethereumProviderInterface,
      implementations: ["wrap://plugin/ethereum-provider"],
    },
  ];
}

export function createRedirects(): IUriRedirect<Uri | string>[] {
  return [
    {
      from: "wrap://ens/ethereum.polywrap.eth",
      to: defaultWrappers.ethereum,
    },
  ];
}
