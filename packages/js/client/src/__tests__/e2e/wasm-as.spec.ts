import {
  Web3ApiClientConfig,
  createWeb3ApiClient,
} from "../../";
import * as TestCases from "./test-cases";
import {
  buildApi,
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

  beforeAll(async () => {
    const testEnv = await initTestEnvironment();
    ipfsProvider = testEnv.ipfs;
    ethProvider = testEnv.ethereum;
    ensAddress = testEnv.ensAddress;
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

  it("asyncify", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/asyncify`
    const apiUri = `fs/${apiPath}/build`

    await buildApi(apiPath);

    await TestCases.runAsyncifyTest(
      await getClient(), apiUri
    );
  });

  it("bigint-type", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/bigint-type`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runBigIntTypeTest(
      await getClient(), apiUri
    );
  });

  it("bignumber-type", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/bignumber-type`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runBigNumberTypeTest(
      await getClient(), apiUri
    );
  });

  it("bytes-type", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/bytes-type`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runBytesTypeTest(
      await getClient(), apiUri
    );
  });

  it("enum-types", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/enum-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runEnumTypesTest(
      await getClient(), apiUri
    );
  });

  it("map-type", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/map-type`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runMapTypeTest(
      await getClient(), apiUri
    );
  });

  it("reserved-words", async () => {
    const client = await getClient();

    const apiPath = `${GetPathToTestApis()}/wasm-as/reserved-words`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);
    const ensUri = apiUri;

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
    const interfacePath = `${GetPathToTestApis()}/wasm-as/implementations/test-interface`
    const interfaceUri = `fs/${interfacePath}/build`;

    const implementationPath = `${GetPathToTestApis()}/wasm-as/implementations/test-api`
    const implementationUri = `w3://fs/${implementationPath}/build`
    
    await buildApi(
      interfacePath
    );
    
    await buildApi(implementationPath);

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

    const implementationPath = `${GetPathToTestApis()}/wasm-as/implementations/test-use-getImpl`
    const implementationUri = `w3://fs/${implementationPath}/build`;

    await buildApi(implementationPath);

    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
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

    const implementationPath = `${GetPathToTestApis()}/wasm-as/interface-invoke/test-implementation`
    const implementationUri = `fs/${implementationPath}/build`;

    // Build interface polywrapper
    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestApis()}/wasm-as/interface-invoke/test-interface`,
    });

    await buildApi(implementationPath);
    

    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    const apiPath = `${GetPathToTestApis()}/wasm-as/interface-invoke/test-api`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

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
    const apiPath = `${GetPathToTestApis()}/wasm-as/invalid-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runInvalidTypesTest(
      await getClient(), apiUri
    );
  });

  it("JSON-type", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/json-type`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runJsonTypeTest(
      await getClient(), apiUri
    );
  });

  it("large-types", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/large-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runLargeTypesTest(
      await getClient(), apiUri
    );
  });

  it("number-types under and overflows", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/number-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runNumberTypesTest(
      await getClient(), apiUri
    );
  });

  it("object-types", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/object-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runObjectTypesTest(
      await getClient(), apiUri
    );
  });

  it("simple-storage", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/simple-storage`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runSimpleStorageTest(
      await getClient(), apiUri
    );
  });
});
