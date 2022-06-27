import {
  PolywrapClientConfig,
  createPolywrapClient,
  PluginConfigs,
} from "../..";
import * as TestCases from "./test-cases";
import {
  buildWrapper,
  ensAddresses,
  initTestEnvironment,
  stopTestEnvironment,
  providers,
} from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";

jest.setTimeout(1200000);

const getClient = async (
  pluginConfigs?: PluginConfigs,
  config?: Partial<PolywrapClientConfig>
) => {
  return createPolywrapClient(pluginConfigs ?? {}, config);
};

const getClientWithEnsAndIpfs = async () => {
  return await getClient({
    ethereum: {
      networks: {
        testnet: {
          provider: providers.ethereum,
        },
      },
    },
    ipfs: { provider: providers.ipfs },
    ens: {
      addresses: {
        testnet: ensAddresses.ensAddress,
      },
    },
  });
};

describe("wasm-rs test cases", () => {
  beforeAll(async () => {
    await initTestEnvironment();
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("asyncify", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/asyncify`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runAsyncifyTest(
      await getClientWithEnsAndIpfs(),
      wrapperUri
    );
  });

  it("bigint-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/bigint-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runBigIntTypeTest(await getClient(), wrapperUri);
  });

  it("bignumber-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/bignumber-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runBigNumberTypeTest(await getClient(), wrapperUri);
  });

  it("bytes-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/bytes-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runBytesTypeTest(await getClient(), wrapperUri);
  });

  it("enum-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/enum-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runEnumTypesTest(await getClient(), wrapperUri);
  });

  it("map-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/map-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runMapTypeTest(await getClient(), wrapperUri);
  });

  it("implementations - e2e", async () => {
    const interfacePath = `${GetPathToTestWrappers()}/wasm-rs/implementations/test-interface`;
    const interfaceUri = `fs/${interfacePath}/build`;

    const implementationPath = `${GetPathToTestWrappers()}/wasm-rs/implementations/test-wrapper`;
    const implementationUri = `fs/${implementationPath}/build`;

    await buildWrapper(interfacePath);

    await buildWrapper(implementationPath);

    const client = await getClient(undefined, {
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    await TestCases.runImplementationsTest(
      client,
      interfaceUri,
      implementationUri
    );
  });

  it("implementations - getImplementations", async () => {
    const interfaceUri = "wrap://ens/interface.eth";

    const implementationPath = `${GetPathToTestWrappers()}/wasm-rs/implementations/test-use-getImpl`;

    await buildWrapper(implementationPath);

    const implementationUri = `fs/${implementationPath}/build`;

    const client = await getClient(undefined, {
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    await TestCases.runGetImplementationsTest(
      client,
      interfaceUri,
      implementationUri
    );
  });

  it("invalid type errors", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/invalid-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runInvalidTypesTest(await getClient(), wrapperUri);
  });

  it("JSON-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/json-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runJsonTypeTest(await getClient(), wrapperUri);
  });

  it("large-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/large-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runLargeTypesTest(await getClient(), wrapperUri);
  });

  it("number-types under and overflows", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/number-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runNumberTypesTest(await getClient(), wrapperUri);
  });

  it("object-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/object-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runObjectTypesTest(await getClient(), wrapperUri);
  });

  it("simple-storage", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/simple-storage`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runSimpleStorageTest(
      await getClientWithEnsAndIpfs(),
      wrapperUri
    );
  });
});
