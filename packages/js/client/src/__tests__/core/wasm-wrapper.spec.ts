import { buildWrapper } from "@polywrap/test-env-js";
import { msgpackDecode } from "@polywrap/msgpack-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import { Uri, PluginModule, Subscription, PolywrapClient } from "../..";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { getClient } from "../utils/getClient";
import { makeMemoryStoragePlugin } from "../e2e/memory-storage";
import { ErrResult } from "../utils/resultTypes";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";

jest.setTimeout(200000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;
const simpleWrapperUri = new Uri(`fs/${simpleWrapperPath}/build`);

const memoryStoragePluginUri = "wrap://ens/memory-storage.polywrap.eth";

const simpleMemoryWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-memory`;
const simpleMemoryWrapperUri = new Uri(`fs/${simpleMemoryWrapperPath}/build`);

describe("wasm-wrapper", () => {
  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath);
    await buildWrapper(simpleMemoryWrapperPath);
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

  it("should allow clone + reconfigure of redirects", async () => {
    const client = await getClient({
      plugins: [
        {
          uri: "wrap://ens/mock.polywrap.eth",
          plugin: mockPlugin(),
        },
      ],
    });

    const redirects = [
      {
        from: simpleWrapperUri.uri,
        to: "wrap://ens/mock.polywrap.eth",
      },
    ];

    const newConfig = new ClientConfigBuilder()
      .add(client.getConfig())
      .add({ redirects })
      .build();

    const newClient = new PolywrapClient(
      newConfig
    );

    const result = await newClient.invoke({
      uri: simpleWrapperUri.uri,
      method: "simpleMethod",
      args: {
        arg: "test",
      }
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual("plugin response");
  });

  test("get file from wrapper", async () => {
    const client = await getClient();

    const expectedManifest = new Uint8Array(
      await fs.promises.readFile(`${simpleWrapperPath}/build/wrap.info`)
    );

    const receivedManifestResult = await client.getFile(
      simpleWrapperUri,
      {
        path: "./wrap.info",
      }
    );
    if (!receivedManifestResult.ok) fail(receivedManifestResult.error);
    const receivedManifest = receivedManifestResult.value as Uint8Array;

    expect(receivedManifest).toEqual(expectedManifest);

    const expectedWasmModule = new Uint8Array(
      await fs.promises.readFile(`${simpleWrapperPath}/build/wrap.wasm`)
    );

    const receivedWasmModuleResult = await client.getFile(
      simpleWrapperUri,
      {
        path: "./wrap.wasm",
      }
    );
    if (!receivedWasmModuleResult.ok) fail(receivedWasmModuleResult.error);
    const receivedWasmModule = receivedWasmModuleResult.value as Uint8Array;

    expect(receivedWasmModule).toEqual(expectedWasmModule);

    const pluginClient = await getClient({
      plugins: [
        {
          uri: "ens/mock-plugin.eth",
          plugin: {
            factory: () => ({} as PluginModule<{}>),
            manifest: {} as WrapManifest
          },
        },
      ],
    });

    let pluginGetFileResult = await pluginClient.getFile("ens/mock-plugin.eth", {
      path: "./index.js",
    });

    pluginGetFileResult = pluginGetFileResult as ErrResult;
    expect(pluginGetFileResult.error?.message).toContain("client.getFile(...) is not implemented for Plugins.");
  });

  test("subscribe", async () => {
    const client = await getClient({
      plugins: [
        {
          uri: memoryStoragePluginUri,
          plugin: makeMemoryStoragePlugin({}),
        },
      ],
    });

    // test subscription
    let expectedResults: number[] = [];
    let results: number[] = [];
    let value = 0;

    const setter = setInterval(async () => {
      expectedResults.push(value);

      await client.invoke({
        uri: simpleMemoryWrapperUri.uri,
        method: "setData",
        args: {
          value: value++,
        },
      });
    }, 500);

    const getSubscription: Subscription<number> = client.subscribe<number>({
      uri: simpleMemoryWrapperUri.uri,
      method: "getData",
      frequency: { ms: 650 },
    });

    for await (let result of getSubscription) {
      if (!result.ok) fail(result.error);
      const val = result.value;

      if (val !== undefined) {
        results.push(val);
        if (results.length >= 2) {
          break;
        }
      }
    }
    clearInterval(setter);

    expect(results).toStrictEqual(expectedResults);
  });

  test("subscription early stop", async () => {
    const client = await getClient({
      plugins: [
        {
          uri: memoryStoragePluginUri,
          plugin: makeMemoryStoragePlugin({}),
        },
      ],
    });

    // test subscription
    let results: number[] = [];
    let value = 0;

    const setter = setInterval(async () => {
      await client.invoke({
        uri: simpleMemoryWrapperUri.uri,
        method: "setData",
        args: {
          value: value++,
        },
      });
    }, 500);

    const getSubscription: Subscription<number> = client.subscribe<number>({
      uri: simpleMemoryWrapperUri.uri,
      method: "getData",
      frequency: { ms: 550 },
    });

    new Promise(async () => {
      for await (let result of getSubscription) {
        if (!result.ok) fail(result.error);
        const val = result.value;

        if (val !== undefined) {
          results.push(val);
          if (val >= 2) {
            break;
          }
        }
      }
    });
    await new Promise((r) => setTimeout(r, 1000));
    getSubscription.stop();
    clearInterval(setter);

    expect(results).toContain(0);
    expect(results).not.toContain(2);
  });
});
