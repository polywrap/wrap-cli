import { PluginRegistration, Web3ApiClientConfig } from "@web3api/client-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import axios from "axios";

export async function getDefaultClientConfig(): Promise<Partial<Web3ApiClientConfig>> {
  let ipfsProvider = "";
  let ethereumProvider = "";
  let ensAddress = "";

  // May throw if the test environment is not running.
  const {
    data: { ipfs, ethereum },
  } = await axios.get("http://localhost:4040/providers");
  ipfsProvider = ipfs;
  ethereumProvider = ethereum;
  const { data } = await axios.get("http://localhost:4040/ens");
  ensAddress = data.ensAddress;

  // TODO: move this into its own package, since it's being used everywhere?
  // maybe have it exported from test-env.
  const plugins: PluginRegistration[] = [
    {
      uri: "w3://ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethereumProvider,
          },
          mainnet: {
            provider:
              "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          },
        },
      }),
    },
    {
      uri: "w3://ens/ipfs.web3api.eth",
      plugin: ipfsPlugin({
        provider: ipfsProvider,
        fallbackProviders: ["https://ipfs.io"],
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

  return {
    plugins,
  }
}