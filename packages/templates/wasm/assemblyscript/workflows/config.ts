import { PolywrapClientConfig } from "@polywrap/client-js";
import { ClientConfig, coreInterfaceUris } from "@polywrap/client-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";

interface TestEnvironment {
  ipfs: string;
  ethereum: string;
  ensAddress: string;
  registrarAddress?: string;
  reverseAddress?: string;
  resolverAddress?: string;
}

async function getProviders(): Promise<TestEnvironment> {
  const ipfs = "http://localhost:5001";
  const ethereum = "http://localhost:8545";
  const ensAddress = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab";

  return { ipfs, ethereum, ensAddress };
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
        uri: "wrap://ens/ipfs.polywrap.eth",
        plugin: ipfsPlugin({ provider: ipfs }),
      },
      {
        uri: "wrap://ens/ipfs-resolver.polywrap.eth",
        plugin: ipfsResolverPlugin({
          provider: ipfs,
        }),
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

export async function getClientConfig(
  _: Partial<PolywrapClientConfig>
): Promise<Partial<PolywrapClientConfig>> {
  const { ipfs, ethereum, ensAddress } = await getProviders();

  return getPlugins(ethereum, ipfs, ensAddress);
}
