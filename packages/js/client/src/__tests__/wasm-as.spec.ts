import {
  Web3ApiClientConfig,
  createWeb3ApiClient,
} from "../";
import * as TestCases from "./test-cases";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("wasm-as test cases", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
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
      ens: {
        addresses: {
          testnet: ensAddress,
        },
      },
    }, config);
  }

  it.only("asyncify", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/asyncify`,
      ipfsProvider,
      ensAddress
    );

    await TestCases.runAsyncifyTest(
      await getClient(), api
    );
  });

  it("bigint-type", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/bigint-type`,
      ipfsProvider,
      ensAddress
    );

    await TestCases.runBigIntTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("bytes-type", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/bytes-type`,
      ipfsProvider,
      ensAddress
    );

    await TestCases.runBytesTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("enum-types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/enum-types`,
      ipfsProvider,
      ensAddress
    );

    await TestCases.runEnumTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("implementations - e2e", async () => {
    let interfaceApi = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/implementations/test-interface`,
      ipfsProvider,
      ensAddress
    );
    const interfaceUri = `w3://ens/testnet/${interfaceApi.ensDomain}`;

    const implementationApi = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/implementations/test-api`,
      ipfsProvider,
      ensAddress
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

    const implementationApi = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/implementations/test-use-getImpl`,
      ipfsProvider,
      ensAddress
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

  it("invalid type errors", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/invalid-types`,
      ipfsProvider,
      ensAddress
    );

    await TestCases.runInvalidTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("JSON-type", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/json-type`,
      ipfsProvider,
      ensAddress
    );

    await TestCases.runJsonTypeTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("large-types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/large-types`,
      ipfsProvider,
      ensAddress
    );

    await TestCases.runLargeTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("number-types under and overflows", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/number-types`,
      ipfsProvider,
      ensAddress
    );

    await TestCases.runNumberTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("object-types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/object-types`,
      ipfsProvider,
      ensAddress
    );

    await TestCases.runObjectTypesTest(
      await getClient(), `ens/testnet/${api.ensDomain}`
    );
  });

  it("simple-storage", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensAddress
    );

    await TestCases.runSimpleStorageTest(
      await getClient(), api
    );
  });
});
