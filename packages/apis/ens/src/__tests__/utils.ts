import { PluginRegistration } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";

export function getPlugins(
  ethereum: string,
  ipfs: string,
  ensAddress: string,
  signer?: string
): PluginRegistration[] {
  return [
    {
      uri: "ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethereum,
            signer,
          },
        },
        defaultNetwork: "testnet",
      }),
    },
    {
      uri: "ens/ipfs.web3api.eth",
      plugin: ipfsPlugin({ provider: ipfs }),
    },
    {
      uri: "ens/ens.web3api.eth",
      plugin: ensPlugin({ addresses: { testnet: ensAddress } }),
    },
  ];
}
