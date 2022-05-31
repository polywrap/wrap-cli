import {
  buildApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("implementations", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  const interfacePath = `${GetPathToTestApis()}/implementations/test-interface`
  const interfaceUri = `fs/${interfacePath}/build`

  const implementationPath = `${GetPathToTestApis()}/implementations/test-api`
  const implementationUri = `fs/${implementationPath}/build`

  beforeAll(async () => {
    const {
      ipfs,
      ethereum,
      ensAddress: ens,
    } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;

    await buildApi(interfacePath);
    await buildApi(implementationPath);
  });

  afterAll(async () => {
    await stopTestEnvironment();
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
      {
        interfaces: [
          {
            interface: interfaceUri,
            implementations: [implementationUri],
          },
        ],
        ...config,
      }
    );
  };

  test("sanity", async () => {
    const client = await getClient();
    expect(client.getImplementations(interfaceUri)).toEqual([
      implementationUri,
    ]);
  });

  test("query", async () => {
    const client = await getClient();

    const query = await client.query<{
      queryMethod: string;
      abstractQueryMethod: string;
    }>({
      uri: implementationUri,
      query: `
        query {
          queryMethod(
            arg: $argument1
          )
          abstractQueryMethod(
            arg: $argument2
          )
        }
      `,
      variables: {
        argument1: {
          uint8: 1,
          str: "Test String 1",
        },
        argument2: {
          str: "Test String 2",
        },
      },
    });

    expect(query.errors).toBeFalsy();
    expect(query.data).toBeTruthy();
    expect(query.data?.queryMethod).toEqual({
      uint8: 1,
      str: "Test String 1",
    });

    expect(query.data?.abstractQueryMethod).toBe("Test String 2");
  });

  test("mutation", async () => {
    const client = await getClient();

    const mutation = await client.query<{
      mutationMethod: string;
      abstractMutationMethod: string;
    }>({
      uri: implementationUri,
      query: `
      mutation {
          mutationMethod(
            arg: $argument1
          )
          abstractMutationMethod(
            arg: $argument2
          )
        }
      `,
      variables: {
        argument1: 1,
        argument2: 2,
      },
    });

    expect(mutation.errors).toBeFalsy();
    expect(mutation.data).toBeTruthy();
    expect(mutation.data?.mutationMethod).toBe(1);
    expect(mutation.data?.abstractMutationMethod).toBe(2);
  });
});
