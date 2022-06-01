import { Cookbook } from "@web3api/core-js";
import { GetPathToTestApis } from "@web3api/test-cases";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClient, Web3ApiClientConfig } from "../..";

const cookbook: Cookbook = {
  api: "ens/testnet/simple-storage.eth",
  recipes: {
    simpleStorage: {
      deployment: [
        {
          query: `
          mutation {
            deployContract(
              connection: $connection
            )
          }
        `,
          variables: {
            connection: "$connection",
          },
        },
      ],
      cases: [
        {
          query: `
            mutation {
              setData(address: $address, value: $value, connection: $connection)
            }
          `,
          variables: {
            address: "$address",
            value: 100,
            connection: "$connection",
          },
        },
        {
          query: `
            query {
              getData(address: $address, connection: $connection)
            }
          `,
          variables: {
            address: "$address",
            connection: "$connection",
          },
        },
      ],
    },
  },
  constants: {
    connection: null,
    address: "0xA57B8a5584442B467b4689F1144D269d096A3daF",
  },
};

jest.setTimeout(200000);

describe("cookbook", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  beforeAll(async () => {
    const {
      ipfs,
      ethereum,
      ensAddress: ens,
      resolverAddress,
      registrarAddress,
    } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;
  });

  const getClient = async (config?: Partial<Web3ApiClientConfig>) => {
    return createWeb3ApiClient(
      {
        ethereum: {
          networks: {
            testnet: {
              provider: ethProvider,
            },
          },
          defaultNetwork: "testnet",
        },
        ipfs: { provider: ipfsProvider },
        ens: {
          query: {
            addresses: {
              testnet: ensAddress,
            },
          },
        },
      },
      config
    );
  };

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("simple-storage", () => {
    let client: Web3ApiClient;

    beforeAll(async () => {
      await buildAndDeployApi({
        apiAbsPath: `${GetPathToTestApis()}/wasm-as/simple-storage`,
        ipfsProvider,
        ensRegistryAddress: ensAddress,
        ethereumProvider: ethProvider,
        ensRegistrarAddress,
        ensResolverAddress,
        ensName: "simple-storage.eth",
      });

      client = await getClient();
    });

    it("should cook recipes", async () => {
      await client.cook({
        cookbook,
        dishes: ["simpleStorage.deployment"],

        onExecution: async (_, data, errors) => {
          expect(errors).toBeFalsy();
          expect(data).toBeTruthy();

          cookbook.constants!.address = data!.deployContract as string;

          await client.cook({
            cookbook,
            dishes: ["simpleStorage.cases"],
    
            onExecution: async (_, data, errors) => {
              expect(errors).toBeFalsy();
              expect(data).toBeTruthy();
            }
          });
        },
      });
    });
  });
});
