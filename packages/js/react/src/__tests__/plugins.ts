import { PluginRegistration } from "@web3api/core-js";
import { defaultIpfsProviders } from "@web3api/client-js";
import { plugin as ensPlugin } from "@web3api/ens-plugin-js";
import { plugin as ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { plugin as ipfsPlugin } from "@web3api/ipfs-plugin-js";

export function createPlugins(
  ensAddress: string,
  ethereumProvider: string,
  ipfsProvider: string
): PluginRegistration[] {
  return [
    {
      uri: "w3://ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethereumProvider,
          },
        },
      }),
    },
    {
      uri: "w3://ens/ipfs.web3api.eth",
      plugin: ipfsPlugin({
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
      }),
    },
    {
      uri: "w3://ens/ens.web3api.eth",
      plugin: ensPlugin({
        addresses: {
          testnet: ensAddress,
        },
      }),
    },
  ];
}