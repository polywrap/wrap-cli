import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import {
  createWeb3ApiClient,
  PluginModule,
  Plugin,
  Web3ApiClientConfig,
  PluginModules,
} from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("map-type", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  beforeAll(async () => {
    const {
      ipfs,
      ethereum,
      ensAddress: ens,
      resolverAddress,
      registrarAddress,
    } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async (config?: Partial<Web3ApiClientConfig>) => {
    return createWeb3ApiClient(
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

  test("WASM Map type", async () => {
    const client = await getClient();
    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/map-type`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const mapClass = new Map<string, number>().set("Hello", 1).set("Heyo", 50);
    const mapRecord: Record<string, number> = {
      Hello: 1,
      Heyo: 50,
    };

    const returnMapResponse1 = await client.invoke<Map<string, number>>({
      uri: ensUri,
      module: "query",
      method: "returnMap",
      input: {
        map: mapClass,
      },
    });
    expect(returnMapResponse1.error).toBeUndefined();
    expect(returnMapResponse1.data).toEqual(mapClass);

    const returnMapResponse2 = await client.invoke<Map<string, number>>({
      uri: ensUri,
      module: "query",
      method: "returnMap",
      input: {
        map: mapRecord,
      },
    });
    expect(returnMapResponse2.error).toBeUndefined();
    expect(returnMapResponse2.data).toEqual(mapClass);

    const getKeyResponse1 = await client.invoke<number>({
      uri: ensUri,
      module: "query",
      method: "getKey",
      input: {
        map: mapClass,
        key: "Hello",
      },
    });
    expect(getKeyResponse1.error).toBeUndefined();
    expect(getKeyResponse1.data).toEqual(mapClass.get("Hello"));

    const getKeyResponse2 = await client.invoke<number>({
      uri: ensUri,
      module: "query",
      method: "getKey",
      input: {
        map: mapRecord,
        key: "Heyo",
      },
    });
    expect(getKeyResponse2.error).toBeUndefined();
    expect(getKeyResponse2.data).toEqual(mapRecord.Heyo);
  });

  test("Plugin Map type", async () => {
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
});
