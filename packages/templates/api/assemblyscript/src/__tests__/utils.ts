import { ClientConfig } from "@web3api/client-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { buildAndDeployApi } from "@web3api/test-env-js";
import axios from "axios";
import path from "path";

interface TestEnvironment {
  ipfs: string;
  ethereum: string;
  ensAddress: string;
  clientConfig: Partial<ClientConfig>;
}

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

export async function getProviders(): Promise<TestEnvironment> {
  const {
    data: { ipfs, ethereum },
  } = await axios.get("http://localhost:4040/providers");
  const { data } = await axios.get("http://localhost:4040/deploy-ens");
  const clientConfig = getPlugins(ethereum, ipfs, data.ensAddress);
  return { ipfs, ethereum, ensAddress: data.ensAddress, clientConfig };
}
