import { createPolywrapClient, PolywrapClientConfig } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";
import { Connection, Connections } from "@polywrap/ethereum-plugin-js";

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
  return createPolywrapClient(
    {
      ethereum: { connections },
      ipfs: {},
      ens: {
        addresses: {
          testnet: ensAddresses.ensAddress,
        },
      },
    },
    config
  );
};
