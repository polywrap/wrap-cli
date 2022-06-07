import {
  Web3ApiClientConfig,
  createWeb3ApiClient,
} from "../../";
import * as TestCases from "./test-cases";
import {
  buildApi,
  ensAddresses,
  initTestEnvironment,
  stopTestEnvironment,
  providers
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(1200000);

describe("wasm-rs test cases", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  beforeAll(async () => {
    await initTestEnvironment();
    ipfsProvider = providers.ipfs;
    ethProvider = providers.ethereum;
    ensAddress = ensAddresses.ensAddress;
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
    const apiPath = `${GetPathToTestApis()}/wasm-rs/asyncify`
    const apiUri = `fs/${apiPath}/build`

    await buildApi(apiPath);

    await TestCases.runAsyncifyTest(
      await getClient(), apiUri
    );
  });

  it("bigint-type", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/bigint-type`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    await TestCases.runBigIntTypeTest(
      await getClient(), apiUri
    );
  });

  it("bignumber-type", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/bignumber-type`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(
      apiPath
    );

    await TestCases.runBigNumberTypeTest(
      await getClient(), apiUri
    );
  });

  it("bytes-type", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/bytes-type`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(
      apiPath
    );

    await TestCases.runBytesTypeTest(
      await getClient(), apiUri
    );
  });

  it("enum-types", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/enum-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(
      apiPath
    );

    await TestCases.runEnumTypesTest(
      await getClient(), apiUri
    );
  });

  it("map-type", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/map-type`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(
      apiPath
    );

    await TestCases.runMapTypeTest(
      await getClient(), apiUri
    );
  });

  it("implementations - e2e", async () => {
    const interfacePath = `${GetPathToTestApis()}/wasm-rs/implementations/test-interface`
    const interfaceUri = `fs/${interfacePath}/build`;

    const implementationPath = `${GetPathToTestApis()}/wasm-rs/implementations/test-api`
    const implementationUri = `fs/${implementationPath}/build`;

    await buildApi(
      interfacePath
    );

    await buildApi(
      implementationPath
    );

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

    const implementationPath = `${GetPathToTestApis()}/wasm-rs/implementations/test-use-getImpl`

    await buildApi(
      implementationPath
    );

    const implementationUri = `fs/${implementationPath}/build`;

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

  it("invalid type errors", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/invalid-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(
      apiPath
    );

    await TestCases.runInvalidTypesTest(
      await getClient(), apiUri
    );
  });

  it("JSON-type", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/json-type`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(
      apiPath
    );

    await TestCases.runJsonTypeTest(
      await getClient(), apiUri
    );
  });

  it("large-types", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/large-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(
      apiPath
    );

    await TestCases.runLargeTypesTest(
      await getClient(), apiUri
    );
  });

  it("number-types under and overflows", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/number-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(
      apiPath
    );

    await TestCases.runNumberTypesTest(
      await getClient(), apiUri
    );
  });

  it("object-types", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/object-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(
      apiPath
    );

    await TestCases.runObjectTypesTest(
      await getClient(), apiUri
    );
  });

  it("simple-storage", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-rs/simple-storage`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(
      apiPath
    );

    await TestCases.runSimpleStorageTest(
      await getClient(), apiUri
    );
  });
});
