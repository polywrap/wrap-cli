import {
  buildAndDeployApi,
  initTestEnvironment,
  runCLI,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("interface-invoke", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  let interfaceUri: string;
  let implementationUri: string;
  let apiUri: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens, resolverAddress, registrarAddress } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;

    interfaceUri = "w3://ens/interface.eth";
    // Build interface polywrapper
    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`,
    });

    const implementationApi = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/interface-invoke/test-implementation`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });
    implementationUri = `w3://ens/testnet/${implementationApi.ensDomain}`;

    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/interface-invoke/test-api`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });
    apiUri = `w3://ens/testnet/${api.ensDomain}`;
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