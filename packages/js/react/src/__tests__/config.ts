import { Env, IUriPackage, Uri } from "@polywrap/core-js";
import { plugin as ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  Connection,
  Connections,
  plugin as ethereumPlugin,
} from "@polywrap/ethereum-plugin-js";
import { plugin as ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { defaultIpfsProviders } from "@polywrap/client-config-builder-js";

export function createPlugins(
  ensAddress: string,
  ethereumProvider: string
): IUriPackage<Uri | string>[] {
  return [
    {
      uri: "wrap://ens/ethereum.polywrap.eth",
      package: ethereumPlugin({
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
