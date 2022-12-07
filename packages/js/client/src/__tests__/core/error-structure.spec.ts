import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { Uri, PolywrapClient } from "../..";
// import { buildWrapper } from "@polywrap/test-env-js";
import { WrapError, WrapErrorCode } from "@polywrap/core-js";

jest.setTimeout(360000);

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

describe("error structure", () => {

  let client: PolywrapClient;

  beforeAll(async () => {
    // await buildWrapper(simpleWrapperPath);
    // await buildWrapper(badUtilWrapperPath);
    // await buildWrapper(badMathWrapperPath);
    // await buildWrapper(subinvokeErrorWrapperPath);

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
    expect(result.error?.text.startsWith("Unable to find URI ")).toBeTruthy();
    expect(result.error?.uri.endsWith("monorepo/packages/test-cases/cases/wrappers/wasm-as/simple/build-not-found")).toBeTruthy();
    expect(result.error?.resolutionStack).toBeTruthy();
  });

  test("Invoke a wrapper with malformed arguments", async () => {
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
    expect(result.error?.text.startsWith("__wrap_abort:")).toBeTruthy();
    expect(result.error?.uri.endsWith("monorepo/packages/test-cases/cases/wrappers/wasm-as/simple/build")).toBeTruthy();
    expect(result.error?.method).toEqual("simpleMethod");
    expect(result.error?.args).toEqual("{\n  \"arg\": 3\n}");
    expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/msgpack/ReadDecoder.ts", row: 167, col: 5 });
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
    expect(result.error?.text.startsWith("Could not find invoke function")).toBeTruthy();
    expect(result.error?.uri.endsWith("monorepo/packages/test-cases/cases/wrappers/wasm-as/simple/build")).toBeTruthy();
    expect(result.error?.method).toEqual("complexMethod");
    expect(result.error?.args).toEqual("{\n  \"arg\": \"test\"\n}");
    expect(result.error?.toString().split("51").length).toEqual(2);
    expect(result.error?.cause).toBeUndefined();
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
    expect(result.error?.text.startsWith("SubInvocation exception encountered")).toBeTruthy();
    expect(result.error?.uri.endsWith("monorepo/packages/test-cases/cases/wrappers/wasm-as/subinvoke-error/invoke/build")).toBeTruthy();
    expect(result.error?.method).toEqual("subWrapperNotFound");
    expect(result.error?.args).toEqual("{\n  \"a\": 1,\n  \"b\": 1\n}");
    expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

    expect(result.error?.cause instanceof WrapError).toBeTruthy();
    const cause = result.error?.cause as WrapError;
    expect(cause.name).toEqual("UriResolutionError");
    expect(cause.code).toEqual(WrapErrorCode.URI_NOT_FOUND);
    expect(cause.text).toEqual("Unable to find URI wrap://ens/not-found.eth.");
    expect(cause.uri).toEqual("wrap://ens/not-found.eth");
    expect(cause.resolutionStack).toBeTruthy();
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
    expect(result.error?.text.startsWith("SubInvocation exception encountered")).toBeTruthy();
    expect(result.error?.uri.endsWith("monorepo/packages/test-cases/cases/wrappers/wasm-as/subinvoke-error/invoke/build")).toBeTruthy();
    expect(result.error?.method).toEqual("throwsInTwoSubinvokeLayers");
    expect(result.error?.args).toEqual(`{
  "a": 1,
  "b": 1
}`);
    expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

    expect(result.error?.cause instanceof WrapError).toBeTruthy();
    const cause = result.error?.cause as WrapError;
    expect(cause.name).toEqual("InvokeError");
    expect(cause.code).toEqual(WrapErrorCode.WASM_INVOKE_ABORTED);
    expect(cause.text.startsWith("SubInvocation exception encountered")).toBeTruthy();
    expect(cause.uri).toEqual("wrap://ens/bad-math.eth");
    expect(cause.method).toEqual("subInvokeWillThrow");
    expect(cause.args).toEqual("{\n  \"0\": 130,\n  \"1\": 161,\n  \"2\": 97,\n  \"3\": 1,\n  \"4\": 161,\n  \"5\": 98,\n  \"6\": 1\n}");
    expect(cause.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

    expect(cause.cause instanceof WrapError).toBeTruthy();
    const causeOfCause = cause.cause as WrapError;
    expect(causeOfCause.name).toEqual("InvokeError");
    expect(causeOfCause.code).toEqual(WrapErrorCode.WASM_INVOKE_ABORTED);
    expect(causeOfCause.text).toEqual("__wrap_abort: I threw an error!");
    expect(causeOfCause.uri.endsWith("wrap://ens/bad-util.eth")).toBeTruthy();
    expect(causeOfCause.method).toEqual("iThrow");
    expect(causeOfCause.args).toEqual("{\n  \"0\": 129,\n  \"1\": 161,\n  \"2\": 97,\n  \"3\": 0\n}");
    expect(causeOfCause.source).toEqual({ file: "src/index.ts", row: 5, col: 5 });
  });

  test("Invoke a wrapper of incompatible version", async () => {
    const result = await client.invoke<string>({
      uri: incompatibleWrapperUri.uri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toEqual("test");
  });
});
