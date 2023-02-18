import { msgpackDecode } from "@polywrap/msgpack-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import { Uri, PolywrapClient, IWrapPackage } from "../..";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import { UriResolver } from "@polywrap/uri-resolvers-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { mockPluginRegistration, ErrResult } from "../helpers";

jest.setTimeout(200000);

const wrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/rs`;
const wrapperUri = new Uri(`fs/${wrapperPath}`);

describe("wasm-wrapper", () => {
  const mockPlugin = (): IWrapPackage => {
    class MockPlugin extends PluginModule<{}> {
      add(_: unknown): string {
        return "plugin response";
      }
    }

    return new PluginPackage(new MockPlugin({}), {} as WrapManifest);
  };

  test("can invoke with string URI", async () => {
    const client = new PolywrapClient();
    const result = await client.invoke<number>({
      uri: wrapperUri.uri,
      method: "add",
      args: {
        a: 1,
        b: 1
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(typeof result.value).toBe("number");
    expect(result.value).toEqual(2);
  });

  test("can invoke with typed URI", async () => {
    const client = new PolywrapClient();
    const result = await client.invoke<number, Uri>({
      uri: wrapperUri,
      method: "add",
      args: {
        a: 1,
        b: 1
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(typeof result.value).toBe("number");
    expect(result.value).toEqual(2);
  });

  test("invoke with decode defaulted to true works as expected", async () => {
    const client = new PolywrapClient();
    const result = await client.invoke<number>({
      uri: wrapperUri.uri,
      method: "add",
      args: {
        a: 1,
        b: 1
      },
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(typeof result.value).toBe("number");
    expect(result.value).toEqual(2);
  });

  test("invoke with decode set to false works as expected", async () => {
    const client = new PolywrapClient();
    const result = await client.invoke({
      uri: wrapperUri,
      method: "add",
      args: {
        a: 1,
        b: 1
      },
      encodeResult: true,
    });

    if (!result.ok) fail(result.error);
    expect(result.value).toBeTruthy();
    expect(result.value instanceof Uint8Array).toBeTruthy();
    expect(msgpackDecode(result.value as Uint8Array)).toEqual(2);
  });

  it("should invoke wrapper with custom redirects", async () => {
    const client = new PolywrapClient({
      redirects: [
        {
          from: wrapperUri.uri,
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
      uri: wrapperUri,
      method: "add",
      args: {
        a: 1,
        b: 1
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
      uri: wrapperUri.uri,
      method: "add",
      args: {
        a: 1,
        b: 1
      },
    });

    if (!clientResult.ok) fail(clientResult.error);
    expect(clientResult.value).toBeTruthy();
    expect(clientResult.value).toEqual(2);

    const redirects = {
      [wrapperUri.uri]: "wrap://ens/mock.polywrap.eth",
    };

    builder = builder.add({ redirects });

    const newClient = new PolywrapClient(builder.build());

    const newClientResult = await newClient.invoke({
      uri: wrapperUri.uri,
      method: "add",
      args: {
        a: 1,
        b: 1
      },
    });

    if (!newClientResult.ok) fail(newClientResult.error);
    expect(newClientResult.value).toBeTruthy();
    expect(newClientResult.value).toEqual("plugin response");
  });

  test("get file from wrapper", async () => {
    const client = new PolywrapClient();

    const expectedManifest = new Uint8Array(
      await fs.promises.readFile(`${wrapperPath}/wrap.info`)
    );

    const receivedManifestResult = await client.getFile(wrapperUri, {
      path: "./wrap.info",
    });
    if (!receivedManifestResult.ok) fail(receivedManifestResult.error);
    const receivedManifest = receivedManifestResult.value as Uint8Array;

    expect(receivedManifest).toEqual(expectedManifest);

    const expectedWasmModule = new Uint8Array(
      await fs.promises.readFile(`${wrapperPath}/wrap.wasm`)
    );

    const receivedWasmModuleResult = await client.getFile(wrapperUri, {
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
