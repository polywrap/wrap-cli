import * as TestCases from "./test-cases";
import { makeMemoryStoragePlugin } from "./memory-storage";
import {
  buildWrapper,
  initTestEnvironment,
  stopTestEnvironment,
  runCLI,
} from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { getClientWithEnsAndIpfs } from "../helpers/getClientWithEnsAndIpfs";
import { PolywrapClient } from "../../PolywrapClient";

jest.setTimeout(300000);

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

    await buildWrapper(wrapperPath, undefined, true);

    const client = new PolywrapClient({
      packages: [
        {
          uri: "wrap://ens/memory-storage.polywrap.eth",
          package: makeMemoryStoragePlugin({}),
        },
      ],
    });

    await TestCases.runAsyncifyTest(client, wrapperUri);
  });

  it("subinvoke", async() => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-subinvoke/invoke`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    const subwrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-subinvoke/subinvoke`;
    const subwrapperUri = `fs/${subwrapperPath}/build`;

    await buildWrapper(subwrapperPath, undefined, true);
    await buildWrapper(wrapperPath, undefined, true);

    const client = new PolywrapClient({
      redirects: [
        {
          from: "ens/add.eth",
          to: subwrapperUri
        }
      ]
    });

    await TestCases.runSubinvokeTest(client, wrapperUri);
  })

  it("bigint-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/bigint-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runBigIntTypeTest(new PolywrapClient(), wrapperUri);
  });

  it("bignumber-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/bignumber-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runBigNumberTypeTest(new PolywrapClient(), wrapperUri);
  });

  it("bytes-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/bytes-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runBytesTypeTest(new PolywrapClient(), wrapperUri);
  });

  it("enum-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/enum-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runEnumTypesTest(new PolywrapClient(), wrapperUri);
  });

  it("map-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/map-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runMapTypeTest(new PolywrapClient(), wrapperUri);
  });

  it("reserved-words", async () => {
    const client = new PolywrapClient();

    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/reserved-words`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);
    const ensUri = wrapperUri;

    const result = await client.invoke({
      uri: ensUri,
      method: "if",
      args: {
        if: {
          else: "successfully used reserved keyword",
        },
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(result.value).toMatchObject({
      else: "successfully used reserved keyword",
    });
  });

  it("implementations - e2e", async () => {
    const interfacePath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-interface`;
    const interfaceUri = `fs/${interfacePath}/build`;

    const implementationPath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-wrapper`;
    const implementationUri = `wrap://fs/${implementationPath}/build`;

    await buildWrapper(interfacePath);
    await buildWrapper(implementationPath, undefined, true);

    const client = new PolywrapClient({
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
    const interfacePath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-interface`;
    const interfaceUri = "wrap://ens/interface.eth";

    const implementationPath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-wrapper`;
    const implementationUri = `fs/${implementationPath}/build`;

    const aggregatorPath = `${GetPathToTestWrappers()}/wasm-as/implementations/test-use-getImpl`;
    const aggregatorUri = `fs/${aggregatorPath}/build`;

    await buildWrapper(interfacePath);
    await buildWrapper(implementationPath, undefined, true);
    await buildWrapper(aggregatorPath, undefined, true);

    const client = new PolywrapClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    await TestCases.runGetImplementationsTest(
      client,
      aggregatorUri,
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

    await buildWrapper(implementationPath, undefined, true);

    const client = new PolywrapClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-wrapper`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    const result = await client.invoke({
      uri: wrapperUri,
      method: "moduleMethod",
      args: {
        arg: {
          uint8: 1,
          str: "Test String 1",
        },
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual({
      uint8: 1,
      str: "Test String 1",
    });
  });

  it("invalid type errors", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/invalid-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runInvalidTypesTest(new PolywrapClient(), wrapperUri);
  });

  it("JSON-type", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/json-type`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runJsonTypeTest(new PolywrapClient(), wrapperUri);
  });

  it("large-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/large-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runLargeTypesTest(new PolywrapClient(), wrapperUri);
  });

  it("number-types under and overflows", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/number-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runNumberTypesTest(new PolywrapClient(), wrapperUri);
  });

  it("object-types", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/object-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runObjectTypesTest(new PolywrapClient(), wrapperUri);
  });

  it("simple-storage", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runSimpleStorageTest(getClientWithEnsAndIpfs(), wrapperUri);
  });

  it("simple env", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-env-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runSimpleEnvTest(
      new PolywrapClient({
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

    await buildWrapper(externalWrapperPath, undefined, true);
    await buildWrapper(wrapperPath, undefined, true);

    await TestCases.runComplexEnvs(
      new PolywrapClient<string>({
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
            uri: "ens/externalenv.polywrap.eth",
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
          {
            from: "ens/hello.eth",
            to: wrapperUri,
          }
        ],
      }),
      wrapperUri
    );
  });
});
