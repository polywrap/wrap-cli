import { UriRedirect } from "@web3api/core-js";
import { plugin as ensPlugin } from "@web3api/ens-plugin-js";
import { plugin as ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { plugin as ipfsPlugin } from "@web3api/ipfs-plugin-js";

export function createRedirects(
  ensAddress: string,
  ethereumProvider: string,
  ipfsProvider: string
): UriRedirect[] {
  return [
    {
      from: "w3://ens/ethereum.web3api.eth",
      to: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethereumProvider,
          },
        },
      }),
    },
    {
      from: "w3://ens/ipfs.web3api.eth",
      to: ipfsPlugin({
        provider: ipfsProvider,
        fallbackProviders: ["https://ipfs.io"],
      }),
    },
    {
      from: "w3://ens/ens.web3api.eth",
      to: ensPlugin({
        addresses: {
          testnet: ensAddress,
        },
      }),
    },
  ];
}