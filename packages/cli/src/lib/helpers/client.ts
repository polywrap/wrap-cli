import { PluginRegistration } from "@web3api/core-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { Web3ApiClient } from "@web3api/client-js";
import axios from "axios";

interface SimpleClientConfig {
  ensAddress?: string;
  ethProvider?: string;
  ipfsProvider?: string;
}

export function getSimpleClient(config: SimpleClientConfig): Web3ApiClient {
  const { ensAddress, ethProvider, ipfsProvider } = config;
  const plugins: PluginRegistration[] = [];
  if (ensAddress) {
    plugins.push({
      uri: "w3://ens/ens.web3api.eth",
      plugin: ensPlugin({
        addresses: {
          testnet: ensAddress,
        },
      }),
    });
  }
  if (ethProvider) {
    plugins.push({
      uri: "w3://ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethProvider,
          },
          mainnet: {
            provider:
              "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          },
        },
      }),
    });
  }
  if (ipfsProvider) {
    plugins.push({
      uri: "w3://ens/ipfs.web3api.eth",
      plugin: ipfsPlugin({
        provider: ipfsProvider,
        fallbackProviders: ["https://ipfs.io"],
      }),
    });
  }
  return new Web3ApiClient({ plugins });
}

export async function getDefaultProviders(
  ipfs: unknown
): Promise<{ ipfsProvider?: string; ethProvider?: string }> {
  let ipfsProvider: string | undefined;
  let ethProvider: string | undefined;

  if (typeof ipfs === "string") {
    // Custom IPFS provider
    ipfsProvider = ipfs;
  } else if (ipfs) {
    // Dev-server IPFS provider
    try {
      const {
        data: { ipfs, ethereum },
      } = await axios.get("http://localhost:4040/providers");
      ipfsProvider = ipfs;
      ethProvider = ethereum;
    } catch (e) {
      // Dev server not found
    }
  }
  return { ipfsProvider, ethProvider };
}