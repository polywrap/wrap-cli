import * as TestCases from "./test-cases";
import { makeMemoryStoragePlugin } from "./memory-storage";
import {
  buildWrapper,
  initTestEnvironment,
  stopTestEnvironment,
  runCLI,
} from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { getClientWithEnsAndIpfs } from "../utils/getClientWithEnsAndIpfs";
import { getClient } from "../utils/getClient";

jest.setTimeout(200000);

describe("wasm-as test cases", () => {
  beforeAll(async () => {
    await initTestEnvironment();
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("asyncify", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/asyncify`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    const client = await getClient({
      plugins: [
        {
          uri: "wrap://ens/memory-storage.polywrap.eth",
          plugin: makeMemoryStoragePlugin({}),
        },
      ],
    });

    await TestCases.runAsyncifyTest(client, wrapperUri);
  });

  it("bigint-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/bigint-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runBigIntTypeTest(await getClient(), wrapperUri);
  });

  it("bignumber-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/bignumber-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runBigNumberTypeTest(await getClient(), wrapperUri);
  });

  it("bytes-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/bytes-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runBytesTypeTest(await getClient(), wrapperUri);
  });

  it("enum-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/enum-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runEnumTypesTest(await getClient(), wrapperUri);
  });

  it("map-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/map-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runMapTypeTest(await getClient(), wrapperUri);
  });

  it("reserved-words", async () => {
    const client = await getClient();

    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/reserved-words`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);
    const ensUri = wrapperUri;

    const query = await client.invoke({
      uri: ensUri,
      method: "method1",
      args: {
        const: {
          const: "successfully used reserved keyword",
        },
      },
    });

    expect(query.error).toBeFalsy();
    expect(query.data).toBeTruthy();
    expect(query.data).toMatchObject({
      const: "result: successfully used reserved keyword",
    });
  });

  it("implementations - e2e", async () => {
    const interfacePath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-interface`;
    const interfaceUri = `fs/${interfacePath}/build`;

    const implementationPath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-wrapper`;
    const implementationUri = `wrap://fs/${implementationPath}/build`;

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
      client,
      interfaceUri,
      implementationUri
    );
  });

  it("implementations - getImplementations", async () => {
    const interfaceUri = "wrap://ens/interface.eth";

    const implementationPath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-use-getImpl`;
    const implementationUri = `wrap://fs/${implementationPath}/build`;

    await buildWrapper(implementationPath);

    const client = await getClient({
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

  it("e2e Interface invoke method", async () => {
    const interfaceUri = "wrap://ens/interface.eth";

    const implementationPath = `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-implementation`;
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

    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-wrapper`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    const query = await client.invoke({
      uri: wrapperUri,
      method: "moduleMethod",
      args: {
        arg: {
          uint8: 1,
          str: "Test String 1",
        },
      },
    });

    expect(query.error).toBeFalsy();
    expect(query.data).toBeTruthy();
    expect(query.data).toEqual({
      uint8: 1,
      str: "Test String 1",
    });
  });

  it("invalid type errors", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/invalid-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runInvalidTypesTest(await getClient(), wrapperUri);
  });

  it("JSON-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/json-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runJsonTypeTest(await getClient(), wrapperUri);
  });

  it("large-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/large-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runLargeTypesTest(await getClient(), wrapperUri);
  });

  it("number-types under and overflows", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/number-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runNumberTypesTest(await getClient(), wrapperUri);
  });

  it("object-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/object-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runObjectTypesTest(await getClient(), wrapperUri);
  });

  it("simple-storage", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runSimpleStorageTest(
      await getClientWithEnsAndIpfs(),
      wrapperUri
    );
  });

  it("simple env", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-env-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    await TestCases.runSimpleEnvTest(
      await getClient({
        envs: [
          {
            uri: wrapperUri,
            env: {
              str: "module string",
              requiredInt: 1,
            },
          },
        ],
      }),
      wrapperUri
    );
  });

  it("complex env", async () => {
    const baseWrapperEnvPaths = `${GetPathToTestWrappers()}/wasm-as/env-types`;
    const wrapperPath = `${baseWrapperEnvPaths}/main`;
    const externalWrapperPath = `${baseWrapperEnvPaths}/external`;
    const wrapperUri = `fs/${wrapperPath}/build`;
    const externalWrapperUri = `fs/${externalWrapperPath}/build`;

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
              externalString: "iamexternal",
            },
          },
        ],
        redirects: [
          {
            from: "ens/externalenv.polywrap.eth",
            to: externalWrapperUri,
          },
        ],
      }),
      wrapperUri
    );
  });
});
