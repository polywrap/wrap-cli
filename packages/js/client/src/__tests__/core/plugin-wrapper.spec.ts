import { PolywrapClient, PluginModule } from "../..";
import { getClient } from "../utils/getClient";
import { sleepPlugin } from "sleep-plugin-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import path from "path";

jest.setTimeout(200000);

const defaultPlugins = [
  "wrap://ens/ipfs.polywrap.eth",
  "wrap://ens/ens-resolver.polywrap.eth",
  "wrap://ens/ethereum.polywrap.eth",
  "wrap://ens/http.polywrap.eth",
  "wrap://ens/js-logger.polywrap.eth",
  "wrap://ens/uts46.polywrap.eth",
  "wrap://ens/sha3.polywrap.eth",
  "wrap://ens/graph-node.polywrap.eth",
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
      manifest: {
        schema: ``,
        implements: [],
      },
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
            manifest: {
              schema: "",
              implements: [],
            },
          },
        },
      ],
    });

    const pluginUris = client.getPlugins().map((x) => x.uri.uri);

    expect(pluginUris).toEqual([implementationUri].concat(defaultPlugins));
  });

  test("getSchema -- plugin schema", async () => {
    const testPluginUri = "ens/test-plugin.eth";
    const pluginSchema = "type Module { someMethod(arg: String): String }";

    const pluginPackage = {
      factory: () => ({} as PluginModule<{}>),
      manifest: {
        schema: pluginSchema,
        implements: [],
      },
    };

    const client = new PolywrapClient({
      plugins: [
        {
          uri: testPluginUri,
          plugin: pluginPackage,
        },
      ],
    });

    const schema: string = await client.getSchema(testPluginUri);

    expect(schema).toStrictEqual(pluginSchema);
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

    expect(getResult.error).toBeFalsy();
    expect(getResult.data).toBeTruthy();
    expect(getResult.data).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 2)
    );

    const updateResult = await client.invoke({
      uri: implementationUri,
      method: "updateMap",
      args: {
        map: new Map<string, number>().set("b", 1).set("c", 5),
      },
    });

    expect(updateResult.error).toBeFalsy();
    expect(updateResult.data).toBeTruthy();
    expect(updateResult.data).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 3).set("c", 5)
    );
  });

  test("plugin registration - with plugin override", async () => {
    const pluginUriToOverride = defaultPlugins[0];

    const pluginPackage = {
      factory: () => ({} as PluginModule<{}>),
      manifest: {
        schema: "",
        implements: [],
      },
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
      manifest: {
        schema: "",
        implements: [],
      },
    };

    const pluginPackage2 = {
      factory: () => ({} as PluginModule<{}>),
      manifest: {
        schema: "",
        implements: [],
      },
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

    expect(registeredPlugin?.plugin).toEqual(pluginPackage1);
  });

  test("setPlugin - override existing plugin", async () => {
    const client = new PolywrapClient();

    const pluginUriToOverride = defaultPlugins[0];

    const pluginPackage = {
      factory: () => ({} as PluginModule<{}>),
      manifest: {
        schema: "",
        implements: [],
      },
    };

    client.setPlugin({
      uri: pluginUriToOverride,
      plugin: pluginPackage,
    });

    // check URIs
    const pluginUris = client.getPlugins().map((x) => x.uri.uri);
    expect(pluginUris).toEqual(defaultPlugins);

    // check plugin package
    const registeredPlugin = client
      .getPlugins()
      .find((x) => x.uri.uri === pluginUriToOverride);
    expect(registeredPlugin?.plugin).toEqual(pluginPackage);
  });

  test("setPlugin - add new plugin", async () => {
    const client = new PolywrapClient();

    const pluginUri = "wrap://ens/mock-uri.polywrap.eth";

    const pluginPackage = {
      factory: () => ({} as PluginModule<{}>),
      manifest: {
        schema: "",
        implements: [],
      },
    };

    client.setPlugin({
      uri: pluginUri,
      plugin: pluginPackage,
    });

    // check URIs
    const pluginUris = client.getPlugins().map((x) => x.uri.uri);
    expect(pluginUris).toEqual([...defaultPlugins, pluginUri]);

    // check plugin package
    const registeredPlugin = client
      .getPlugins()
      .find((x) => x.uri.uri === pluginUri);
    expect(registeredPlugin?.plugin).toEqual(pluginPackage);
  });

  test.only("setPlugin - does not affect running invocations", async () => {
    const sleepPluginUri = "wrap://ens/sleep-js.wrappers.eth";
    const longRunningInvocationUri = "wrap://fs/" + path.join(GetPathToTestWrappers(), "wasm-rs/long-running/build");

    const result: string[] = [];

    const client = new PolywrapClient({
      plugins: [
        {
          uri: sleepPluginUri,
          plugin: sleepPlugin({
            onWake: () => !!result.push("first")
          })
        },
      ],
    });

    const sleepLoop = client.invoke({
      uri: longRunningInvocationUri,
      method: "sleepLoop",
      args: {
        msPerSleep: 1000,
        repeats: 5,
      }
    });

    await new Promise(r => setTimeout(r, 2000));

    client.setPlugin({
      uri: sleepPluginUri,
      plugin: sleepPlugin({
        onWake: () => !!result.push("second")
      })
    });

    const { data, error } = await sleepLoop;
    expect(error).toBeFalsy();
    expect(data).toBeTruthy();

    expect(result).toStrictEqual(["first", "first", "first", "first", "first"]);
  });
});
