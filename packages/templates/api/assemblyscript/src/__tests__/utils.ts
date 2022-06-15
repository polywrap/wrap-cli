import { ClientConfig } from "@polywrap/client-js";
import { ensPlugin } from "@polywrap/ens-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";

export function getPlugins(
  ethereum: string,
  ipfs: string,
  ensAddress: string,
): Partial<ClientConfig> {
  return {
    redirects: [],
    plugins: [
      {
        uri: "w3://ens/ipfs.web3api.eth",
        plugin: ipfsPlugin({ provider: ipfs }),
      },
      {
        uri: "w3://ens/ens.web3api.eth",
        plugin: ensPlugin({ addresses: { testnet: ensAddress } }),
      },
      {
        uri: "w3://ens/ethereum.web3api.eth",
        plugin: ethereumPlugin({
          networks: {
            testnet: {
              provider: ethereum,
            },
            MAINNET: {
              provider: "http://localhost:8546",
            },
          },
          defaultNetwork: "testnet",
        }),
      },
    ],
  };
}