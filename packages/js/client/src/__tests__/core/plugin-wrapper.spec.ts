import {
  Web3ApiClientConfig,
  Plugin,
  Web3ApiClient,
  createWeb3ApiClient,
  PluginModule,
  PluginModules,
} from "../..";

jest.setTimeout(200000);

const defaultPlugins = [
  "w3://ens/ipfs.web3api.eth",
  "w3://ens/ens.web3api.eth",
  "w3://ens/ethereum.web3api.eth",
  "w3://ens/http.web3api.eth",
  "w3://ens/js-logger.web3api.eth",
  "w3://ens/uts46.web3api.eth",
  "w3://ens/sha3.web3api.eth",
  "w3://ens/graph-node.web3api.eth",
  "w3://ens/fs.web3api.eth",
];

describe("plugin-wrapper", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  const getClient = async (config?: Partial<Web3ApiClientConfig>) => {
    const client = await createWeb3ApiClient(
      {
        ethereum: {
          networks: {
            testnet: {
              provider: ethProvider,
            },
          },
        },
        ipfs: { provider: ipfsProvider },
        ens: {
          query: {
            addresses: {
              testnet: ensAddress,
            },
          },
        },
      },
      config
    );

    return client;
  };

  const mockMapPlugin = () => {
    interface Config extends Record<string, unknown> {
      map: Map<string, number>;
    }

    class Query extends PluginModule<Config> {
      async getMap(_: unknown) {
        return this.config.map;
      }
    }

    class Mutation extends PluginModule<Config> {
      updateMap(input: { map: Map<string, number> }): Map<string, number> {
        for (const key of input.map.keys()) {
          this.config.map.set(
            key,
            (this.config.map.get(key) || 0) + (input.map.get(key) || 0)
          );
        }
        return this.config.map;
      }
    }

    class MockMapPlugin implements Plugin {
      private map = new Map().set("a", 1).set("b", 2);

      getModules(): PluginModules {
        return {
          query: new Query({ map: this.map }),
          mutation: new Mutation({ map: this.map }),
        };
      }
    }

    return {
      factory: () => new MockMapPlugin(),
      manifest: {
        schema: ``,
        implements: [],
      },
    };
  };

  test("plugin registration - with default plugins", () => {
    const implementationUri = "w3://ens/some-implementation.eth";

    const client = new Web3ApiClient({
      plugins: [
        {
          uri: implementationUri,
          plugin: {
            factory: () => ({} as Plugin),
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
    const client = await getClient();
    const schema: string = await client.getSchema(
      "w3://ens/js-logger.web3api.eth"
    );

    expect(schema).toStrictEqual(
      `### Web3API Header START ###
scalar UInt
scalar UInt8
scalar UInt16
scalar UInt32
scalar Int
scalar Int8
scalar Int16
scalar Int32
scalar Bytes
scalar BigInt
scalar BigNumber
scalar JSON
scalar Map

directive @imported(
  uri: String!
  namespace: String!
  nativeType: String!
) on OBJECT | ENUM

directive @imports(
  types: [String!]!
) on OBJECT

directive @capability(
  type: String!
  uri: String!
  namespace: String!
) repeatable on OBJECT

directive @enabled_interface on OBJECT

directive @annotate(type: String!) on FIELD

### Web3API Header END ###

type Query implements Logger_Query @imports(
  types: [
    "Logger_Query",
    "Logger_LogLevel"
  ]
) {
  log(
    level: Logger_LogLevel!
    message: String!
  ): Boolean!
}

### Imported Queries START ###

type Logger_Query @imported(
  uri: "ens/logger.core.web3api.eth",
  namespace: "Logger",
  nativeType: "Query"
) {
  log(
    level: Logger_LogLevel!
    message: String!
  ): Boolean!
}

### Imported Queries END ###

### Imported Objects START ###

enum Logger_LogLevel @imported(
  uri: "ens/logger.core.web3api.eth",
  namespace: "Logger",
  nativeType: "LogLevel"
) {
  DEBUG
  INFO
  WARN
  ERROR
}

### Imported Objects END ###
`
    );
  });

  it("plugin map types", async () => {
    const implementationUri = "w3://ens/some-implementation.eth";
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
      factory: () => ({} as Plugin),
      manifest: {
        schema: "",
        implements: [],
      },
    };

    const client = new Web3ApiClient({
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
      factory: () => ({} as Plugin),
      manifest: {
        schema: "",
        implements: [],
      },
    };

    const pluginPackage2 = {
      factory: () => ({} as Plugin),
      manifest: {
        schema: "",
        implements: [],
      },
    };

    const client = new Web3ApiClient({
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
});
