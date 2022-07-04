import {
  PolywrapClientConfig,
  createPolywrapClient,
} from "../../";
import * as TestCases from "./test-cases";
import {
  buildWrapper,
  initTestEnvironment,
  stopTestEnvironment,
  runCLI,
  ensAddresses,
  providers
} from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { execSync } from "child_process";

jest.setTimeout(200000);

describe("wasm-as test cases", () => {
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

  const getClient = async (config?: Partial<PolywrapClientConfig>) => {
    return createPolywrapClient({
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

  it("asyncify", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/asyncify/wrapper`
    const wrapperUri = `fs/${wrapperPath}/build`

    const pluginPath = `${GetPathToTestWrappers()}/wasm-as/asyncify/plugin`

    execSync(`cd ${pluginPath} && yarn && yarn build`)

    await buildWrapper(wrapperPath);

    const client = await getClient({
      plugins: [{
        uri: "wrap://ens/memory-storage.polywrap.eth",
        plugin: require(`${pluginPath}/build`).memoryStoragePlugin({}),
      }]
    })

    await TestCases.runAsyncifyTest(
      client, wrapperUri
    );
  });

  it("bigint-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/bigint-type`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    await TestCases.runBigIntTypeTest(
      await getClient(), wrapperUri
    );
  });

  it("bignumber-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/bignumber-type`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    await TestCases.runBigNumberTypeTest(
      await getClient(), wrapperUri
    );
  });

  it("bytes-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/bytes-type`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    await TestCases.runBytesTypeTest(
      await getClient(), wrapperUri
    );
  });

  it("enum-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/enum-types`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    await TestCases.runEnumTypesTest(
      await getClient(), wrapperUri
    );
  });

  it("map-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/map-type`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    await TestCases.runMapTypeTest(
      await getClient(), wrapperUri
    );
  });

  it("reserved-words", async () => {
    const client = await getClient();

    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/reserved-words`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);
    const ensUri = wrapperUri;

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
    const interfacePath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-interface`
    const interfaceUri = `fs/${interfacePath}/build`;

    const implementationPath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-wrapper`
    const implementationUri = `wrap://fs/${implementationPath}/build`

    await buildWrapper(interfacePath);
    await buildWrapper(implementationPath);

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
    const interfaceUri = "wrap://ens/interface.eth"

    const implementationPath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-use-getImpl`
    const implementationUri = `wrap://fs/${implementationPath}/build`;

    await buildWrapper(implementationPath);

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
    const interfaceUri = "wrap://ens/interface.eth";

    const implementationPath = `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-implementation`
    const implementationUri = `fs/${implementationPath}/build`;

    // Build interface polywrapper
    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-interface`,
    });

    await buildWrapper(implementationPath);

    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-wrapper`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    const query = await client.query<{
      moduleMethod: string;
    }>({
      uri: wrapperUri,
      query: `query{
        moduleMethod(
          arg: {
            uint8: 1,
            str: "Test String 1",
          }
        )
      }`,
    });

    expect(query.errors).toBeFalsy();
    expect(query.data).toBeTruthy();
    expect(query.data?.moduleMethod).toEqual({
      uint8: 1,
      str: "Test String 1",
    });
  });

  it("invalid type errors", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/invalid-types`
    const wrapperUri = `fs/${wrapperPath}/build`

    await buildWrapper(wrapperPath);

    await TestCases.runInvalidTypesTest(
      await getClient(), wrapperUri
    );
  });

  it("JSON-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/json-type`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    await TestCases.runJsonTypeTest(
      await getClient(), wrapperUri
    );
  });

  it("large-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/large-types`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    await TestCases.runLargeTypesTest(
      await getClient(), wrapperUri
    );
  });

  it("number-types under and overflows", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/number-types`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    await TestCases.runNumberTypesTest(
      await getClient(), wrapperUri
    );
  });

  it("object-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/object-types`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    await TestCases.runObjectTypesTest(
      await getClient(), wrapperUri
    );
  });

  it("simple-storage", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`
    const wrapperUri = `fs/${wrapperPath}/build`
    
    await buildWrapper(wrapperPath);

    await TestCases.runSimpleStorageTest(
      await getClient(), wrapperUri
    );
  });

  it("simple env", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-env-types`
    const wrapperUri = `fs/${wrapperPath}/build`

    await buildWrapper(
      wrapperPath
    );

    await TestCases.runSimpleEnvTest(
      await await getClient({
        envs: [
          {
            uri: wrapperUri,
            env: {
              str: "module string",
              requiredInt: 1,
            },
          },
        ],
      }), wrapperUri
    );
  })

  it("complex env", async () => {
    const baseWrapperEnvPaths = `${GetPathToTestWrappers()}/wasm-as/env-types`
    const wrapperPath = `${baseWrapperEnvPaths}/main`
    const externalWrapperPath = `${baseWrapperEnvPaths}/external`
    const wrapperUri = `fs/${wrapperPath}/build`
    const externalWrapperUri = `fs/${externalWrapperPath}/build`

    await buildWrapper(externalWrapperPath);
    await buildWrapper(wrapperPath);

    await TestCases.runComplexEnvs(
      await getClient({
        envs: [
          {
            uri: wrapperUri,
            env: {
              object: {
                prop: "object string",
              },
              str: "string",
              optFilledStr: "optional string",
              number: 10,
              bool: true,
              en: "FIRST",
              array: [32, 23],
            },
          },
          {
            uri: externalWrapperUri,
            env: {
              externalArray: [1, 2, 3],
              externalString: "iamexternal"
            },
          },
        ],
        redirects: [
          {
            from: "ens/externalenv.polywrap.eth",
            to: externalWrapperUri
          }
        ]
      }), wrapperUri
    );
  })
});
