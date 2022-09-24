import { PolywrapClient, PluginModule, PluginPackage } from "../..";
import { getClient } from "../utils/getClient";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

jest.setTimeout(200000);

const defaultPlugins = [
  "wrap://ens/ipfs.polywrap.eth",
  "wrap://ens/ens-resolver.polywrap.eth",
  "wrap://ens/ethereum.polywrap.eth",
  "wrap://ens/http.polywrap.eth",
  "wrap://ens/js-logger.polywrap.eth",
  "wrap://ens/fs.polywrap.eth",
  "wrap://ens/fs-resolver.polywrap.eth",
  "wrap://ens/ipfs-resolver.polywrap.eth",
];

describe("plugin-wrapper", () => {
  const mockMapPlugin = () => {
    interface Config extends Record<string, unknown> {
      map: Map<string, number>;
    }

    class MockMapPlugin extends PluginModule<Config> {
      async getMap(_: unknown) {
        return this.config.map;
      }

      updateMap(args: { map: Map<string, number> }): Map<string, number> {
        for (const key of args.map.keys()) {
          this.config.map.set(
            key,
            (this.config.map.get(key) || 0) + (args.map.get(key) || 0)
          );
        }
        return this.config.map;
      }
    }

    return {
      factory: () =>
        new MockMapPlugin({
          map: new Map().set("a", 1).set("b", 2),
        }),
      manifest: {} as WrapManifest,
    };
  };

  test("plugin registration - with default plugins", () => {
    const implementationUri = "wrap://ens/some-implementation.eth";

    const client = new PolywrapClient({
      plugins: [
        {
          uri: implementationUri,
          plugin: {
            factory: () => ({} as PluginModule<{}>),
            manifest: {} as WrapManifest,
          },
        },
      ],
    });

    const pluginUris = client.getPlugins().map((x) => x.uri.uri);

    expect(pluginUris).toEqual(defaultPlugins.concat([implementationUri]));
  });

  it("plugin map types", async () => {
    const implementationUri = "wrap://ens/some-implementation.eth";
    const mockPlugin = mockMapPlugin();
    const client = await getClient({
      plugins: [
        {
          uri: implementationUri,
          plugin: mockPlugin,
        },
      ],
    });

    const getResult = await client.invoke({
      uri: implementationUri,
      method: "getMap",
    });

    if (!getResult.ok) fail(getResult.error);
    expect(getResult.value).toBeTruthy();
    expect(getResult.value).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 2)
    );

    const updateResult = await client.invoke({
      uri: implementationUri,
      method: "updateMap",
      args: {
        map: new Map<string, number>().set("b", 1).set("c", 5),
      },
    });

    if (!updateResult.ok) fail(updateResult.error);
    expect(updateResult.value).toBeTruthy();
    expect(updateResult.value).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 3).set("c", 5)
    );
  });

  test("plugin registration - with plugin override", async () => {
    const pluginUriToOverride = defaultPlugins[0];

    const pluginPackage = {
      factory: () => ({} as PluginModule<{}>),
      manifest: {} as WrapManifest,
    };

    const client = new PolywrapClient({
      plugins: [
        {
          uri: pluginUriToOverride,
          plugin: pluginPackage,
        },
      ],
    });

    const pluginUris = client.getPlugins().map((x) => x.uri.uri);

    expect(pluginUris).toEqual(defaultPlugins);

    const registeredPlugin = client
      .getPlugins()
      .find((x) => x.uri.uri === pluginUriToOverride);

    expect(registeredPlugin?.plugin).toEqual(pluginPackage);
  });

  test("plugin registration - with multiple plugin overrides", async () => {
    const pluginUriToOverride = defaultPlugins[0];

    const pluginPackage1 = {
      factory: () => ({} as PluginModule<{}>),
      manifest: {} as WrapManifest,
    };

    const pluginPackage2 = {
      factory: () => ({} as PluginModule<{}>),
      manifest: {} as WrapManifest,
    };

    const client = new PolywrapClient({
      plugins: [
        {
          uri: pluginUriToOverride,
          plugin: pluginPackage1,
        },
        {
          uri: pluginUriToOverride,
          plugin: pluginPackage2,
        },
      ],
    });

    const pluginUris = client.getPlugins().map((x) => x.uri.uri);

    expect(pluginUris).toEqual(defaultPlugins);

    const registeredPlugin = client
      .getPlugins()
      .find((x) => x.uri.uri === pluginUriToOverride);

    expect(registeredPlugin?.plugin).toEqual(pluginPackage2);
  });

  test("get plugin package by uri", async () => {
    interface SamplePluginConfig {
      bar: string;
    }
    class SamplePluginModule extends PluginModule<SamplePluginConfig> {}
    const config: SamplePluginConfig = { bar: "test" };

    const pluginPackage = <PluginPackage<SamplePluginConfig>>{
      factory: () => new SamplePluginModule(config),
      manifest: {},
    };

    const client = new PolywrapClient(
      {
        plugins: [
          {
            uri: "wrap://ens/some.plugin.eth",
            plugin: pluginPackage,
          },
        ],
      }
    );

    const plugin = await client.getPluginByUri(
      "wrap://ens/some.plugin.eth"
    );

    expect(plugin).toStrictEqual(pluginPackage);
  });

  test("get manifest should fetch wrap manifest from plugin", async () => {
    const client = await getClient();
    const manifest = await client.getManifest("ens/ipfs.polywrap.eth");
    if (!manifest.ok) fail(manifest.error);
    expect(manifest.value.type).toEqual("plugin");
    expect(manifest.value.name).toEqual("Ipfs");
  });
});
