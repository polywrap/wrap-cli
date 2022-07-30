import {
  PolywrapClientConfig,
  PolywrapClient,
  createPolywrapClient,
  PluginModule,
} from "../..";

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
  const getClient = async (config?: Partial<PolywrapClientConfig>) => {
    return await createPolywrapClient(
      {},
      config
    );
  };

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
      factory: () => new MockMapPlugin({
        map: new Map().set("a", 1).set("b", 2)
      }),
      manifest: {
        abi: {},
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
              abi: {},
              implements: [],
            },
          },
        },
      ],
    });

    const pluginUris = client.getPlugins().map((x) => x.uri.uri);

    expect(pluginUris).toEqual([implementationUri].concat(defaultPlugins));
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

    const queryEnv = await client.query({
      uri: implementationUri,
      query: `
      query {
        getMap
      }
    `,
    });

    expect(queryEnv.errors).toBeFalsy();
    expect(queryEnv.data).toBeTruthy();
    expect(queryEnv.data?.getMap).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 2)
    );

    const mutationEnv = await client.query({
      uri: implementationUri,
      query: `
      mutation {
        updateMap(map: $map)
      }
      `,
      variables: {
        map: new Map<string, number>().set("b", 1).set("c", 5),
      },
    });

    expect(mutationEnv.errors).toBeFalsy();
    expect(mutationEnv.data).toBeTruthy();
    expect(mutationEnv.data?.updateMap).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 3).set("c", 5)
    );
  });

  test("plugin registration - with plugin override", async () => {
    const pluginUriToOverride = defaultPlugins[0];

    const pluginPackage = {
      factory: () => ({} as PluginModule<{}>),
      manifest: {
        abi: {},
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
        abi: {},
        implements: [],
      },
    };

    const pluginPackage2 = {
      factory: () => ({} as PluginModule<{}>),
      manifest: {
        abi: {},
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

  test("get manifest should fetch wrap manifest from plugin", async () => {
    const client = await getClient()
    const manifest = await client.getManifest("ens/ipfs.polywrap.eth")
    expect(manifest.type).toEqual("plugin")
  })
});
