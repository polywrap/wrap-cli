import {
  buildApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("interface-invoke", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  const interfacePath = `${GetPathToTestApis()}/interface-invoke/test-interface`
  const interfaceUri = `fs/${interfacePath}/build`;

  const implementationPath = `${GetPathToTestApis()}/interface-invoke/test-implementation`
  const implementationUri = `fs/${implementationPath}/build`;

  const apiPath = `${GetPathToTestApis()}/interface-invoke/test-api`
  const apiUri = `fs/${apiPath}/build`;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;

    await buildApi(interfacePath)
    await buildApi(implementationPath);
    await buildApi(apiPath);
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
        ...config
      }
    );
  };


  test("e2e Interface invoke method", async () => {
    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    const query = await client.query<{
      queryMethod: string;
    }>({
      uri: apiUri,
      query: `query{
        queryMethod(
          arg: {
            uint8: 1,
            str: "Test String 1",
          }
        )
      }`,
    });

    expect(query.errors).toBeFalsy();
    expect(query.data).toBeTruthy();
    expect(query.data?.queryMethod).toEqual({
      uint8: 1,
      str: "Test String 1",
    });

    const mutation = await client.query<{
      mutationMethod: string;
    }>({
      uri: apiUri,
      query: `mutation {
        mutationMethod(
          arg: 1
        )
      }`,
    });

    expect(mutation.errors).toBeFalsy();
    expect(mutation.data).toBeTruthy();
    expect(mutation.data?.mutationMethod).toBe(1);
  });
});