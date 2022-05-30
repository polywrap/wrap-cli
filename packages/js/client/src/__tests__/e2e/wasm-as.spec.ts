import {
  Web3ApiClientConfig,
  createWeb3ApiClient,
} from "../../";
import * as TestCases from "./test-cases";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
  runCLI,
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("wasm-as test cases", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  beforeAll(async () => {
    const testEnv = await initTestEnvironment();
    ipfsProvider = testEnv.ipfs;
    ethProvider = testEnv.ethereum;
    ensAddress = testEnv.ensAddress;
    ensRegistrarAddress = testEnv.registrarAddress;
    ensResolverAddress = testEnv.resolverAddress;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async (config?: Partial<Web3ApiClientConfig>) => {
    return createWeb3ApiClient({
      ethereum: {
        networks: {
          testnet: {
            provider: ethProvider,
          },
        },
      },
      ipfs: { provider: ipfsProvider },
      ens: { query: {
        addresses: {
          testnet: ensAddress,
        },
      } },
    }, config);
  }

  const deployApi = (apiAbsPath: string) =>
    buildAndDeployApi({
      apiAbsPath,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ensRegistrarAddress,
      ensResolverAddress,
      ethereumProvider: ethProvider,
    });

  it("asyncify", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/asyncify`
    );

    await TestCases.runAsyncifyTest(
      await getClient(), api
    );
  });

  it("bigint-type", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/bigint-type`
    );

    await TestCases.runBigIntTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("bignumber-type", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/bignumber-type`
    );

    await TestCases.runBigNumberTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("bytes-type", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/bytes-type`
    );

    await TestCases.runBytesTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("enum-types", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/enum-types`
    );

    await TestCases.runEnumTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("map-type", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/map-type`
    );

    await TestCases.runMapTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("reserved-words", async () => {
    const client = await getClient();

    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/wasm-as/reserved-words`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const query = await client.query<{
      method1: {
        const: string;
      };
    }>({
      uri: ensUri,
      query: `
        query {
          method1(
            const: {
              const: "successfully used reserved keyword"
            }
          )
        }
      `,
    });

    expect(query.errors).toBeFalsy();
    expect(query.data).toBeTruthy();
    expect(query.data).toMatchObject({
      method1: {
        const: "result: successfully used reserved keyword",
      },
    });
  });

  it("implementations - e2e", async () => {
    let interfaceApi = await deployApi(
      `${GetPathToTestApis()}/wasm-as/implementations/test-interface`
    );
    const interfaceUri = `w3://ens/testnet/${interfaceApi.ensDomain}`;

    const implementationApi = await deployApi(
      `${GetPathToTestApis()}/wasm-as/implementations/test-api`
    );
    const implementationUri = `w3://ens/testnet/${implementationApi.ensDomain}`;

    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    await TestCases.runImplementationsTest(
      client, interfaceUri, implementationUri
    );
  });

  it("implementations - getImplementations", async () => {
    const interfaceUri = "w3://ens/interface.eth"

    const implementationApi = await deployApi(
      `${GetPathToTestApis()}/wasm-as/implementations/test-use-getImpl`
    );
    const implementationUri = `w3://ens/testnet/${implementationApi.ensDomain}`;

    const client = await getClient({
      interfaces: [
        {
          interface: "w3://ens/interface.eth",
          implementations: [implementationUri],
        }
      ],
    });

    await TestCases.runGetImplementationsTest(
      client, interfaceUri, implementationUri
    );
  });

  it("e2e Interface invoke method", async () => {
    const interfaceUri = "w3://ens/interface.eth";
    // Build interface polywrapper
    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestApis()}/wasm-as/interface-invoke/test-interface`,
    });

    const implementationApi = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/wasm-as/interface-invoke/test-implementation`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });
    const implementationUri = `w3://ens/testnet/${implementationApi.ensDomain}`;

    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/wasm-as/interface-invoke/test-api`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });
    const apiUri = `w3://ens/testnet/${api.ensDomain}`;

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

  it("invalid type errors", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/invalid-types`
    );

    await TestCases.runInvalidTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("JSON-type", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/json-type`
    );

    await TestCases.runJsonTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("large-types", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/large-types`
    );

    await TestCases.runLargeTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("number-types under and overflows", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/number-types`
    );

    await TestCases.runNumberTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("object-types", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/object-types`
    );

    await TestCases.runObjectTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("simple-storage", async () => {
    const api = await deployApi(
      `${GetPathToTestApis()}/wasm-as/simple-storage`
    );

    await TestCases.runSimpleStorageTest(
      await getClient(), api
    );
  });
});
