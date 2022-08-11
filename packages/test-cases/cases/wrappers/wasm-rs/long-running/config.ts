import { PolywrapClientConfig } from "@polywrap/client-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";

export async function getClientConfig(
  _: Partial<PolywrapClientConfig>
): Promise<Partial<PolywrapClientConfig>> {
  return {
    plugins: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({
          networks: {
            goerli: {
              provider: "https://goerli.infura.io/v3/d119148113c047ca90f0311ed729c466",
            },
          },
          defaultNetwork: "goerli",
        })
      },
      {
        uri: "wrap://ens/ipfs.polywrap.eth",
        plugin: ipfsPlugin({
          provider: "https://ipfs.warppers.io",
          fallbackProviders: ["http://localhost:48084"]
        }),
      },
    ]
  };
}
