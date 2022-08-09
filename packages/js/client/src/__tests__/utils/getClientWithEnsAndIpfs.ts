import { createPolywrapClient, PolywrapClientConfig } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";

export const getClientWithEnsAndIpfs = async (
  config?: Partial<PolywrapClientConfig>
) => {
  return createPolywrapClient(
    {
      ethereum: {
        networks: {
          testnet: {
            provider: providers.ethereum,
          },
        },
        defaultNetwork: "testnet",
      },
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
