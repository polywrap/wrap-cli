import * as TestCases from "./test-cases";
import { makeMemoryStoragePlugin } from "./memory-storage";
import {
  buildWrapper,
  initTestEnvironment,
  stopTestEnvironment,
} from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { getClient } from "../utils/getClient";
import { getClientWithEnsAndIpfs } from "../utils/getClientWithEnsAndIpfs";
import fse from "fs-extra";
import path from "path";
import { execSync } from "child_process";
const { performance } = require("perf_hooks");

jest.setTimeout(1200000);

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
    const interfacePath = `${GetPathToTestWrappers()}/wasm-rs/implementations/test-interface`;
    const interfaceUri = "wrap://ens/interface.eth";

    const implementationPath = `${GetPathToTestWrappers()}/wasm-rs/implementations/test-wrapper`;
    const implementationUri = `fs/${implementationPath}/build`;

    const aggregatorPath = `${GetPathToTestWrappers()}/wasm-rs/implementations/test-use-getImpl`;
    const aggregatorUri = `fs/${aggregatorPath}/build`;

    await buildWrapper(interfacePath);
    await buildWrapper(implementationPath);
    await buildWrapper(aggregatorPath);

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
      aggregatorUri,
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

    await TestCases.runJsonTypeTest(await getClient(), wrapperUri, true);
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

  it("simple env", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/simple-env-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

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
      }),
      wrapperUri
    );
  });

  it("complex env", async () => {
    const baseWrapperEnvPaths = `${GetPathToTestWrappers()}/wasm-rs/env-types`;
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

  it("override rust print macros", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/println-logging`;
    const wrapperUri = `fs/${wrapperPath}/build`;
    await buildWrapper(wrapperPath);

    console.debug = jest.fn();
    const message = "foo bar baz";

    const client = await getClient();
    const result = await client.invoke<boolean>({
      uri: wrapperUri,
      method: "logMessage",
      args: {
        message,
      }
    });

    expect(result.ok).toBeTruthy();
    if (!result.ok) return;
    expect(result.value).toBeTruthy();
    expect((console.debug as any).mock.calls[0][0]).toBe("__wrap_debug_log: " + message);
    expect((console.debug as any).mock.calls[1][0]).toBe("__wrap_debug_log: " + message);
    jest.clearAllMocks();
  });

  it("codegen-manifest", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/codegen-manifest`;
    await expect(buildWrapper(wrapperPath)).resolves;
  });
});

describe.skip("Wasm-rs benchmarking", () => {
  const wrapperPath = `${GetPathToTestWrappers()}/wasm-rs/benchmarks`;
  const wrapperUri = `fs/${wrapperPath}/build`;

  let cacheFiles = new Map<string, string>();
  const mockFunc = `
  fn froo() -> &'static str {
"foo"
}
  `;

  const modifySource = () => {
    const libPath = path.join(wrapperPath, "src", "lib.rs");
    const libFile = fse.readFileSync(libPath, "utf-8");

    cacheFiles.set(libPath, libFile);

    const modifiedFile = `${libFile}\n${mockFunc}`;

    fse.writeFileSync(libPath, modifiedFile);
  };

  const buildImage = async (name: "current" | "new"): Promise<number> => {
    const startTime = performance.now();

    await buildWrapper(
      wrapperPath,
      name === "current" ? "./polywrap-current.yaml" : "./polywrap.yaml"
    );

    const endTime = performance.now();
    const msTime = endTime - startTime;

    //Make sure the wrapper works correctly
    await TestCases.runBigNumberTypeTest(await getClient(), wrapperUri);

    return msTime;
  };

  beforeEach(() => {
    fse.removeSync(`${wrapperPath}/build`);
    fse.removeSync(`${wrapperPath}/.polywrap`);
  });

  const restoreSource = () => {
    for (const [key, value] of cacheFiles) {
      fse.writeFileSync(key, value);
    }
  };

  it("Build image performance", async () => {
    //Delete cached images and containers
    execSync(`docker system prune -a -f`);

    //Build the wrapper with no previously cached images
    const firstBuildTimeNew = await buildImage("new");
    console.log(
      `1st build - no cache (new): ${firstBuildTimeNew.toFixed(2)}ms`
    );

    //Build the wrapper again
    const secondBuildTimeNew = await buildImage("new");
    console.log(
      `2nd build - with cache (new): ${secondBuildTimeNew.toFixed(2)}ms`
    );

    //Modify the source code and measure build time
    modifySource();

    const timeAfterSourceNew = await buildImage("new");
    console.log(
      `3rd build - modified source (new): ${timeAfterSourceNew.toFixed(2)}ms`
    );

    restoreSource();

    // Repeat the process for current image and compare
    execSync(`docker system prune -a -f`);

    const firstBuildTimeCurrent = await buildImage("current");
    console.log(
      `1st build - no cache (current): ${firstBuildTimeCurrent.toFixed(2)}ms`
    );

    const secondBuildTimeCurrent = await buildImage("current");
    console.log(
      `2nd build - with cache (current): ${secondBuildTimeCurrent.toFixed(2)}ms`
    );

    modifySource();

    const timeAfterSourceCurrent = await buildImage("current");
    console.log(
      `3rd build - modified source (current): ${timeAfterSourceCurrent.toFixed(
        2
      )}ms`
    );

    restoreSource();

    expect(timeAfterSourceNew).toBeLessThan(timeAfterSourceCurrent);
  });
});
