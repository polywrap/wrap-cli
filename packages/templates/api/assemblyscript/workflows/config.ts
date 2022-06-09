import { Web3ApiClientConfig } from "@web3api/client-js";
import { ClientConfig, coreInterfaceUris } from "@web3api/client-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import axios from "axios";

interface TestEnvironment {
  ipfs: string;
  ethereum: string;
  ensAddress: string;
  registrarAddress: string;
  reverseAddress: string;
  resolverAddress: string;
}

async function getProviders(): Promise<TestEnvironment> {
  const {
    data: { ipfs, ethereum },
  } = await axios.get("http://localhost:4040/providers");
  const { data } = await axios.get("http://localhost:4040/deploy-ens");
  const clientConfig: Partial<ClientConfig> = getPlugins(
    ethereum,
    ipfs,
    data.ensAddress
  );
  return { ipfs, ethereum, ...data, clientConfig };
}

function getPlugins(
  ethereum: string,
  ipfs: string,
  ensAddress: string
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
        plugin: ensPlugin({ query: { addresses: { testnet: ensAddress } } }),
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
    interfaces: [
      {
        interface: coreInterfaceUris.uriResolver.uri,
        implementations: [
          "w3://ens/ipfs.web3api.eth",
          "w3://ens/ens.web3api.eth",
        ],
      },
      {
        interface: coreInterfaceUris.logger.uri,
        implementations: ["w3://ens/js-logger.web3api.eth"],
      },
    ],
  };
}

export async function getClientConfig(
  defaultConfigs: Partial<Web3ApiClientConfig>
): Promise<Partial<Web3ApiClientConfig>> {
  const { ipfs, ethereum, ensAddress } = await getProviders();
  return getPlugins(ethereum, ipfs, ensAddress);
}
