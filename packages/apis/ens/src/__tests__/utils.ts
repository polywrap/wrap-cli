import { PluginRegistration } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import axios from "axios";

interface TestEnvironment {
  ipfs: string;
  ethereum: string;
  ensAddress: string;
  plugins: PluginRegistration[];
}

export async function getProviders(): Promise<TestEnvironment> {
  const {
    data: { ipfs, ethereum },
  } = await axios.get("http://localhost:4040/providers");
  const { data } = await axios.get("http://localhost:4040/deploy-ens");
  const plugins: PluginRegistration[] = getPlugins(
    ethereum,
    ipfs,
    data.ensAddress
  );
  return { ipfs, ethereum, ensAddress: data.ensAddress, plugins };
}

export function getPlugins(
  ethereum: string,
  ipfs: string,
  ensAddress: string
): PluginRegistration[] {
  return [
    {
      uri: "ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethereum,
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
