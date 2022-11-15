import { buildWrapper } from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { Uri, PolywrapClient } from "../..";

jest.setTimeout(360000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;
const simpleWrapperUri = new Uri(`fs/${simpleWrapperPath}/build`);

const subinvokeErrorWrapperPath = `${GetPathToTestWrappers()}/wasm-as/subinvoke-error/invoke`;
const subinvokeErrorWrapperUri = new Uri(`fs/${subinvokeErrorWrapperPath}/build`);

const badMathWrapperPath = `${GetPathToTestWrappers()}/wasm-as/subinvoke-error/0-subinvoke`;
const badMathWrapperUri = new Uri(`fs/${badMathWrapperPath}/build`);

const badUtilWrapperPath = `${GetPathToTestWrappers()}/wasm-as/subinvoke-error/1-subinvoke`;
const badUtilWrapperUri = new Uri(`fs/${badUtilWrapperPath}/build`);

// const incompatibleVersionWrapperUri = new Uri("");

describe("error structure", () => {

  let client: PolywrapClient;

  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath);
    await buildWrapper(badUtilWrapperPath);
    await buildWrapper(badMathWrapperPath);
    await buildWrapper(subinvokeErrorWrapperPath);

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

    console.log(result)

    if (!result.ok) fail(result.error);
    expect(result.value).toEqual("test");
  });

  test("Invoke a wrapper with malformed arguments", async () => {
    const result = await client.invoke<string>({
      uri: simpleWrapperUri.uri,
      method: "simpleMethod",
      args: {
        arg: 3,
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toEqual("test");
  });

  test("Invoke a wrapper method that doesn't exist", async () => {
    const result = await client.invoke<string>({
      uri: simpleWrapperUri.uri,
      method: "complexMethod",
      args: {
        arg: "test",
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toEqual("test");
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

    if (!result.ok) fail(result.error);
    expect(result.value).toEqual("test");
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

    if (!result.ok) fail(result.error);
    expect(result.value).toEqual(3);
  });

  // test("Invoke a wrapper of incompatible version", async () => {
  //   const result = await client.invoke<string>({
  //     uri: incompatibleVersionWrapperUri.uri,
  //     method: "simpleMethod",
  //     args: {
  //       arg: "test",
  //     },
  //   });
  //
  //   console.log(result)
  //
  //   if (!result.ok) fail(result.error);
  //   expect(result.value).toEqual("test");
  // });
});
