import { ClientConfig } from "@polywrap/client-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";

export function getPlugins(
  ethereum: string,
  ipfs: string,
  ensAddress: string
): Partial<ClientConfig> {
  return {
    redirects: [],
    plugins: [
      {
        uri: "wrap://ens/ipfs.polywrap.eth",
        plugin: ipfsPlugin({ provider: ipfs }),
      },
      {
        uri: "wrap://ens/ens-resolver.polywrap.eth",
        plugin: ensResolverPlugin({ addresses: { testnet: ensAddress } }),
      },
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
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