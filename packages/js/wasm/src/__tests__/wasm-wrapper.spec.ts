import { buildWrapper } from "@polywrap/test-env-js";
import { msgpackDecode } from "@polywrap/msgpack-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { PolywrapClientConfig, createPolywrapClient } from "@polywrap/client-js"
import { Uri, PluginModule } from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

jest.setTimeout(200000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;
const simpleWrapperUri = new Uri(`fs/${simpleWrapperPath}/build`);



const getClient = async (config?: Partial<PolywrapClientConfig>) => {
  return createPolywrapClient({}, config);
};

describe("wasm-wrapper", () => {
  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath);
  });

  const mockPlugin = () => {
    class MockPlugin extends PluginModule<{}> {
      simpleMethod(_: unknown): string {
        return "plugin response";
      }
    }

    return {
      factory: () => new MockPlugin({}),
      manifest: {} as WrapManifest,
    };
  };

  test("can invoke with string URI", async () => {
    const client = await getClient();
    const result = await client.invoke<string>({
      uri: simpleWrapperUri.uri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(typeof result.value).toBe("string");
    expect(result.value).toEqual("test");
  });

  test("can invoke with typed URI", async () => {
    const client = await getClient();
    const result = await client.invoke<string, Uri>({
      uri: simpleWrapperUri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(typeof result.value).toBe("string");
    expect(result.value).toEqual("test");
  });

  test("invoke with decode defaulted to true works as expected", async () => {
    const client = await getClient();
    const result = await client.invoke<string>({
      uri: simpleWrapperUri.uri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(typeof result.value).toBe("string");
    expect(result.value).toEqual("test");
  });

  test("invoke with decode set to false works as expected", async () => {
    const client = await getClient();
    const result = await client.invoke({
      uri: simpleWrapperUri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
      encodeResult: true,
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(result.value instanceof Uint8Array).toBeTruthy();
    expect(msgpackDecode(result.value as Uint8Array)).toEqual("test");
  });

  it("should invoke wrapper with custom redirects", async () => {
    const client = await getClient({
      redirects: [
        {
          from: simpleWrapperUri.uri,
          to: "wrap://ens/mock.polywrap.eth",
        },
      ],
      plugins: [
        {
          uri: "wrap://ens/mock.polywrap.eth",
          plugin: mockPlugin(),
        },
      ],
    });

    const result = await client.invoke({
      uri: simpleWrapperUri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual("plugin response");
  });
});
