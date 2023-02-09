import { buildWrapper } from "@polywrap/test-env-js";
import { msgpackDecode } from "@polywrap/msgpack-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import { Uri, PolywrapClient, IWrapPackage } from "../..";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import { UriResolver } from "@polywrap/uri-resolvers-js";
import { ErrResult } from "../utils/resultTypes";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { mockPluginRegistration } from "../helpers/mockPluginRegistration";

jest.setTimeout(200000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;
const simpleWrapperUri = new Uri(`fs/${simpleWrapperPath}/build`);

describe("wasm-wrapper", () => {
  beforeAll(async () => {
    await buildWrapper(simpleWrapperPath, undefined, true);
  });

  const mockPlugin = (): IWrapPackage => {
    class MockPlugin extends PluginModule<{}> {
      simpleMethod(_: unknown): string {
        return "plugin response";
      }
    }

    return new PluginPackage(new MockPlugin({}), {} as WrapManifest);
  };

  test("can invoke with string URI", async () => {
    const client = new PolywrapClient();
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
    const client = new PolywrapClient();
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
    const client = new PolywrapClient();
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
    const client = new PolywrapClient();
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
    const client = new PolywrapClient({
      redirects: [
        {
          from: simpleWrapperUri.uri,
          to: "wrap://ens/mock.polywrap.eth",
        },
      ],
      resolvers: [
        {
          uri: "wrap://ens/mock.polywrap.eth",
          package: mockPlugin(),
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
    let builder = new ClientConfigBuilder().add({
      packages: { "wrap://ens/mock.polywrap.eth": mockPlugin() },
    }).addDefaults();

    const client = new PolywrapClient(builder.build());

    const clientResult = await client.invoke({
      uri: simpleWrapperUri.uri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    if (!clientResult.ok) fail(clientResult.error);
    expect(clientResult.value).toBeTruthy();
    expect(clientResult.value).toEqual("test");

    const redirects = {
      [simpleWrapperUri.uri]: "wrap://ens/mock.polywrap.eth",
    };

    builder = builder.add({ redirects });

    const newClient = new PolywrapClient(builder.build());

    const newClientResult = await newClient.invoke({
      uri: simpleWrapperUri.uri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    if (!newClientResult.ok) fail(newClientResult.error);
    expect(newClientResult.value).toBeTruthy();
    expect(newClientResult.value).toEqual("plugin response");
  });

  test("get file from wrapper", async () => {
    const client = new PolywrapClient();

    const expectedManifest = new Uint8Array(
      await fs.promises.readFile(`${simpleWrapperPath}/build/wrap.info`)
    );

    const receivedManifestResult = await client.getFile(simpleWrapperUri, {
      path: "./wrap.info",
    });
    if (!receivedManifestResult.ok) fail(receivedManifestResult.error);
    const receivedManifest = receivedManifestResult.value as Uint8Array;

    expect(receivedManifest).toEqual(expectedManifest);

    const expectedWasmModule = new Uint8Array(
      await fs.promises.readFile(`${simpleWrapperPath}/build/wrap.wasm`)
    );

    const receivedWasmModuleResult = await client.getFile(simpleWrapperUri, {
      path: "./wrap.wasm",
    });
    if (!receivedWasmModuleResult.ok) fail(receivedWasmModuleResult.error);
    const receivedWasmModule = receivedWasmModuleResult.value as Uint8Array;

    expect(receivedWasmModule).toEqual(expectedWasmModule);

    const pluginClient = new PolywrapClient(
      {
        resolver: UriResolver.from([
          mockPluginRegistration("ens/mock-plugin.eth"),
        ]),
      },
      {
        noDefaults: true,
      }
    );

    let pluginGetFileResult = await pluginClient.getFile(
      "ens/mock-plugin.eth",
      {
        path: "./index.js",
      }
    );

    pluginGetFileResult = pluginGetFileResult as ErrResult;
    expect(pluginGetFileResult.error?.message).toContain(
      "client.getFile(...) is not implemented for Plugins."
    );
  });
});
