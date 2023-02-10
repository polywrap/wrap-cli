import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { Uri, PolywrapClient } from "../..";
import { buildWrapper } from "@polywrap/test-env-js";
import { WrapError, WrapErrorCode } from "@polywrap/core-js";
import { mockPluginRegistration } from "../helpers/mockPluginRegistration";
import { defaultPackages } from "@polywrap/client-config-builder-js";

jest.setTimeout(660000);

// AS
const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;
const simpleWrapperUri = new Uri(`fs/${simpleWrapperPath}/build`);

const subinvokeErrorWrapperPath = `${GetPathToTestWrappers()}/wasm-as/subinvoke-error/invoke`;
const subinvokeErrorWrapperUri = new Uri(`fs/${subinvokeErrorWrapperPath}/build`);

const badMathWrapperPath = `${GetPathToTestWrappers()}/wasm-as/subinvoke-error/0-subinvoke`;
const badMathWrapperUri = new Uri(`fs/${badMathWrapperPath}/build`);

const badUtilWrapperPath = `${GetPathToTestWrappers()}/wasm-as/subinvoke-error/1-subinvoke`;
const badUtilWrapperUri = new Uri(`fs/${badUtilWrapperPath}/build`);

const incompatibleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-deprecated`;
const incompatibleWrapperUri = new Uri(`fs/${incompatibleWrapperPath}`);

// RS
const invalidTypesWrapperPath = `${GetPathToTestWrappers()}/wasm-rs/invalid-types`;
const invalidTypesWrapperUri = new Uri(`fs/${invalidTypesWrapperPath}/build`);

describe("Error structure", () => {

  let client: PolywrapClient;

  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath, undefined, true);
    await buildWrapper(badUtilWrapperPath, undefined, true);
    await buildWrapper(badMathWrapperPath, undefined, true);
    await buildWrapper(subinvokeErrorWrapperPath, undefined, true);
    await buildWrapper(invalidTypesWrapperPath, undefined, true);

    client = new PolywrapClient({
      packages: [mockPluginRegistration("plugin/mock")],
      redirects: [
        {
          from: Uri.from("ens/bad-math.eth"),
          to: badMathWrapperUri,
        },
        {
          from: Uri.from("ens/bad-util.eth"),
          to: badUtilWrapperUri,
        }
      ]
    })
  });

  describe("URI resolution", () => {
    test("Invoke a wrapper that is not found", async () => {
      const result = await client.invoke<string>({
        uri: simpleWrapperUri.uri + "-not-found",
        method: "simpleMethod",
        args: {
          arg: "test",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.URI_NOT_FOUND);
      expect(result.error?.reason.startsWith("Unable to find URI ")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/simple/build-not-found")).toBeTruthy();
      expect(result.error?.resolutionStack).toBeTruthy();
    });

    test("Subinvoke a wrapper that is not found", async () => {
      const result = await client.invoke<number>({
        uri: subinvokeErrorWrapperUri.uri,
        method: "subWrapperNotFound",
        args: {
          a: 1,
          b: 1,
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason.startsWith("SubInvocation exception encountered")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/subinvoke-error/invoke/build")).toBeTruthy();
      expect(result.error?.method).toEqual("subWrapperNotFound");
      expect(result.error?.args).toEqual("{\n  \"a\": 1,\n  \"b\": 1\n}");
      expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

      expect(result.error?.innerError instanceof WrapError).toBeTruthy();
      const prev = result.error?.innerError as WrapError;
      expect(prev.name).toEqual("WrapError");
      expect(prev.code).toEqual(WrapErrorCode.URI_NOT_FOUND);
      expect(prev.reason).toEqual("Unable to find URI wrap://ens/not-found.eth.");
      expect(prev.uri).toEqual("wrap://ens/not-found.eth");
      expect(prev.resolutionStack).toBeTruthy();
    });
  });

  describe("Wasm wrapper", () => {
    test("Invoke a wrapper with malformed arguments - as", async () => {
      const result = await client.invoke<string>({
        uri: simpleWrapperUri.uri,
        method: "simpleMethod",
        args: {
          arg: 3,
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason.startsWith("__wrap_abort:")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/simple/build")).toBeTruthy();
      expect(result.error?.method).toEqual("simpleMethod");
      expect(result.error?.args).toEqual("{\n  \"arg\": 3\n}");
      expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/msgpack/ReadDecoder.ts", row: 167, col: 5 });
    });

    test("Invoke a wrapper with malformed arguments - rs", async () => {
      const result = await client.invoke<string>({
        uri: invalidTypesWrapperUri.uri,
        method: "boolMethod",
        args: {
          arg: 3,
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason.startsWith("__wrap_abort:")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-rs/invalid-types/build")).toBeTruthy();
      expect(result.error?.method).toEqual("boolMethod");
      expect(result.error?.args).toEqual("{\n  \"arg\": 3\n}");
      expect(result.error?.source).toEqual({ file: "src/wrap/module/wrapped.rs", row: 38, col: 13 });
    });

    test("Invoke a wrapper method that doesn't exist", async () => {
      const result = await client.invoke<string>({
        uri: simpleWrapperUri.uri,
        method: "complexMethod",
        args: {
          arg: "test",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_FAIL);
      expect(result.error?.reason.startsWith("Could not find invoke function")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/simple/build")).toBeTruthy();
      expect(result.error?.method).toEqual("complexMethod");
      expect(result.error?.args).toEqual("{\n  \"arg\": \"test\"\n}");
      expect(result.error?.toString().split(
        WrapErrorCode.WRAPPER_INVOKE_FAIL.valueOf().toString()
      ).length).toEqual(2);
      expect(result.error?.innerError).toBeUndefined();
    });

    test("Subinvoke error two layers deep", async () => {
      const result = await client.invoke<number>({
        uri: subinvokeErrorWrapperUri.uri,
        method: "throwsInTwoSubinvokeLayers",
        args: {
          a: 1,
          b: 1,
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason.startsWith("SubInvocation exception encountered")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/subinvoke-error/invoke/build")).toBeTruthy();
      expect(result.error?.method).toEqual("throwsInTwoSubinvokeLayers");
      expect(result.error?.args).toEqual("{\n  \"a\": 1,\n  \"b\": 1\n}");
      expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

      expect(result.error?.innerError instanceof WrapError).toBeTruthy();
      const prev = result.error?.innerError as WrapError;
      expect(prev.name).toEqual("WrapError");
      expect(prev.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(prev.reason.startsWith("SubInvocation exception encountered")).toBeTruthy();
      expect(prev.uri).toEqual("wrap://ens/bad-math.eth");
      expect(prev.method).toEqual("subInvokeWillThrow");
      expect(prev.args).toEqual("{\n  \"0\": 130,\n  \"1\": 161,\n  \"2\": 97,\n  \"3\": 1,\n  \"4\": 161,\n  \"5\": 98,\n  \"6\": 1\n}");
      expect(prev.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

      expect(prev.innerError instanceof WrapError).toBeTruthy();
      const prevOfPrev = prev.innerError as WrapError;
      expect(prevOfPrev.name).toEqual("WrapError");
      expect(prevOfPrev.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(prevOfPrev.reason).toEqual("__wrap_abort: I threw an error!");
      expect(prevOfPrev.uri.endsWith("wrap://ens/bad-util.eth")).toBeTruthy();
      expect(prevOfPrev.method).toEqual("iThrow");
      expect(prevOfPrev.args).toEqual("{\n  \"0\": 129,\n  \"1\": 161,\n  \"2\": 97,\n  \"3\": 0\n}");
      expect(prevOfPrev.source).toEqual({ file: "src/index.ts", row: 6, col: 7 });
    });

    test("Invoke a wrapper of incompatible version", async () => {
      const result = await client.invoke<string>({
        uri: incompatibleWrapperUri.uri,
        method: "simpleMethod",
        args: {
          arg: "test",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.URI_RESOLVER_ERROR);
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/simple-deprecated")).toBeTruthy();
      expect(result.error?.resolutionStack).toBeDefined();
      expect(`${result.error?.cause}`).toContain(`Unrecognized WrapManifest schema version "0.0.1"`);
    });
  });

  describe("Plugin wrapper", () => {
    test("Invoke a plugin wrapper with malformed args", async () => {
      const result = await client.invoke<Uint8Array>({
        uri: defaultPackages.fileSystem,
        method: "readFile",
        args: {
          pathh:  "packages/js/client/src/__tests__/core/index.ts",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason).toEqual("The \"path\" argument must be of type string or an instance of Buffer or URL. Received undefined");
      expect(result.error?.uri).toEqual(defaultPackages.fileSystem);
      expect(result.error?.method).toEqual("readFile");
      expect(result.error?.args).toContain("{\n  \"pathh\": \"packages/js/client/src/__tests__/core/index.ts\"\n}");
      expect(result.error?.source).toEqual({ file: "node:internal/fs/promises", row: 450, col: 10 });
    });

    test("Invoke a plugin wrapper with a method that doesn't exist", async () => {
      const result = await client.invoke<Uint8Array>({
        uri: defaultPackages.fileSystem,
        method: "readFileNotFound",
        args: {
          path: __dirname + "/index.ts",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_METHOD_NOT_FOUND);
      expect(result.error?.reason.startsWith("Plugin missing method ")).toBeTruthy();
      expect(result.error?.uri).toEqual(defaultPackages.fileSystem);
      expect(result.error?.method).toEqual("readFileNotFound");
    });

    test("Invoke a plugin wrapper that throws explicitly", async () => {
      const result = await client.invoke<string>({
        uri: "wrap://plugin/mock",
        method: "methodThatThrows",
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason).toEqual("I'm throwing!");
      expect(result.error?.uri).toEqual("wrap://plugin/mock");
      expect(result.error?.source?.file?.endsWith("packages/js/client/src/__tests__/helpers/mockPluginRegistration.ts")).toBeTruthy();
      expect(result.error?.source?.row).toEqual(13);
      expect(result.error?.source?.col).toEqual(17);
    });

    test("Invoke a plugin wrapper that throws unexpectedly", async () => {
      const result = await client.invoke<Uint8Array>({
        uri: defaultPackages.fileSystem,
        method: "readFile",
        args: {
          path: "./this/path/does/not/exist.ts",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason.startsWith("ENOENT: no such file or directory")).toBeTruthy();
      expect(result.error?.uri).toEqual(defaultPackages.fileSystem);
      expect(result.error?.method).toEqual("readFile");
      expect(result.error?.args).toEqual("{\n  \"path\": \"./this/path/does/not/exist.ts\"\n}");
    });
  });
});
