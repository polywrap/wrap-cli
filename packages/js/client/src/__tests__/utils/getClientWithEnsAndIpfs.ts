import { PolywrapClient, PolywrapClientConfig } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";
import { Connection, Connections, ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { buildUriResolver } from "@polywrap/uri-resolvers-js";

export const getClientWithEnsAndIpfs = async (
  config?: Partial<PolywrapClientConfig>
) => {
  const connections: Connections = new Connections({
    networks: {
      testnet: new Connection({
        provider: providers.ethereum,
      }),
    },
    defaultNetwork: "testnet",
  });
  return new PolywrapClient(
    {
      resolver: buildUriResolver([
        { uri: uris.ethereum,
          package: ethereumPlugin({ connections })
        },
      ])
      ethereum: ,
      ipfs: { provider: providers.ipfs },
      ens: {
        addresses: {
          testnet: ensAddresses.ensAddress,
        },
      },
    },
    config
  );
};