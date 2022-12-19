import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { Uri, PolywrapClient } from "../..";
import { buildWrapper } from "@polywrap/test-env-js";
import { WrapError, WrapErrorCode } from "@polywrap/core-js";

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

describe("error structure", () => {

  let client: PolywrapClient;

  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath);
    await buildWrapper(badUtilWrapperPath);
    await buildWrapper(badMathWrapperPath);
    await buildWrapper(subinvokeErrorWrapperPath);
    await buildWrapper(invalidTypesWrapperPath);

    client = new PolywrapClient({
      redirects: [
        {
          from: "ens/bad-math.eth",
          to: badMathWrapperUri,
        },
        {
          from: "ens/bad-util.eth",
          to: badUtilWrapperUri,
        }
      ]
    })
  });

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

    expect(result.error?.name).toEqual("UriResolutionError");
    expect(result.error?.code).toEqual(WrapErrorCode.URI_NOT_FOUND);
    expect(result.error?.reason.startsWith("Unable to find URI ")).toBeTruthy();
    expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/simple/build-not-found")).toBeTruthy();
    expect(result.error?.resolutionStack).toBeTruthy();
  });

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

    expect(result.error?.name).toEqual("InvokeError");
    expect(result.error?.code).toEqual(WrapErrorCode.WASM_INVOKE_ABORTED);
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

    expect(result.error?.name).toEqual("InvokeError");
    expect(result.error?.code).toEqual(WrapErrorCode.WASM_INVOKE_ABORTED);
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

    expect(result.error?.name).toEqual("InvokeError");
    expect(result.error?.code).toEqual(WrapErrorCode.WASM_INVOKE_FAIL);
    expect(result.error?.reason.startsWith("Could not find invoke function")).toBeTruthy();
    expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/simple/build")).toBeTruthy();
    expect(result.error?.method).toEqual("complexMethod");
    expect(result.error?.args).toEqual("{\n  \"arg\": \"test\"\n}");
    expect(result.error?.toString().split("52").length).toEqual(2);
    expect(result.error?.prev).toBeUndefined();
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

    expect(result.error?.name).toEqual("InvokeError");
    expect(result.error?.code).toEqual(WrapErrorCode.WASM_INVOKE_ABORTED);
    expect(result.error?.reason.startsWith("SubInvocation exception encountered")).toBeTruthy();
    expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/subinvoke-error/invoke/build")).toBeTruthy();
    expect(result.error?.method).toEqual("subWrapperNotFound");
    expect(result.error?.args).toEqual("{\n  \"a\": 1,\n  \"b\": 1\n}");
    expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

    expect(result.error?.prev instanceof WrapError).toBeTruthy();
    const prev = result.error?.prev as WrapError;
    expect(prev.name).toEqual("UriResolutionError");
    expect(prev.code).toEqual(WrapErrorCode.URI_NOT_FOUND);
    expect(prev.reason).toEqual("Unable to find URI wrap://ens/not-found.eth.");
    expect(prev.uri).toEqual("wrap://ens/not-found.eth");
    expect(prev.resolutionStack).toBeTruthy();
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

    expect(result.error?.name).toEqual("InvokeError");
    expect(result.error?.code).toEqual(WrapErrorCode.WASM_INVOKE_ABORTED);
    expect(result.error?.reason.startsWith("SubInvocation exception encountered")).toBeTruthy();
    expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/subinvoke-error/invoke/build")).toBeTruthy();
    expect(result.error?.method).toEqual("throwsInTwoSubinvokeLayers");
    expect(result.error?.args).toEqual(`{
  "a": 1,
  "b": 1
}`);
    expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

    expect(result.error?.prev instanceof WrapError).toBeTruthy();
    const prev = result.error?.prev as WrapError;
    expect(prev.name).toEqual("InvokeError");
    expect(prev.code).toEqual(WrapErrorCode.WASM_INVOKE_ABORTED);
    expect(prev.reason.startsWith("SubInvocation exception encountered")).toBeTruthy();
    expect(prev.uri).toEqual("wrap://ens/bad-math.eth");
    expect(prev.method).toEqual("subInvokeWillThrow");
    expect(prev.args).toEqual("{\n  \"0\": 130,\n  \"1\": 161,\n  \"2\": 97,\n  \"3\": 1,\n  \"4\": 161,\n  \"5\": 98,\n  \"6\": 1\n}");
    expect(prev.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

    expect(prev.prev instanceof WrapError).toBeTruthy();
    const prevOfPrev = prev.prev as WrapError;
    expect(prevOfPrev.name).toEqual("InvokeError");
    expect(prevOfPrev.code).toEqual(WrapErrorCode.WASM_INVOKE_ABORTED);
    expect(prevOfPrev.reason).toEqual("__wrap_abort: I threw an error!");
    expect(prevOfPrev.uri.endsWith("wrap://ens/bad-util.eth")).toBeTruthy();
    expect(prevOfPrev.method).toEqual("iThrow");
    expect(prevOfPrev.args).toEqual("{\n  \"0\": 129,\n  \"1\": 161,\n  \"2\": 97,\n  \"3\": 0\n}");
    expect(prevOfPrev.source).toEqual({ file: "src/index.ts", row: 5, col: 5 });
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

    expect(result.error?.name).toEqual("UriResolutionError");
    expect(result.error?.code).toEqual(WrapErrorCode.URI_RESOLVER);
    expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/simple-deprecated")).toBeTruthy();
    expect(result.error?.resolutionStack).toBeDefined();
    expect(`${result.error?.cause}`).toContain(`Unrecognized WrapManifest schema version "0.0.1"`);
  });
});
