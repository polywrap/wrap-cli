import { createWeb3ApiClient, Web3ApiClientConfig } from "../";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";
import { Web3ApiClient } from "../Web3ApiClient";
import { getDefaultClientConfig } from "../default-client-config";
import {
  Uri,
  Plugin,
  Subscription,
  Web3ApiManifest,
  BuildManifest,
  MetaManifest,
  deserializeWeb3ApiManifest,
  deserializeBuildManifest,
  deserializeMetaManifest,
  coreInterfaceUris,
  PluginModule,
  PluginModules,
  msgpackDecode,
} from "@web3api/core-js";
import { readFileSync } from "fs";

jest.setTimeout(200000);

describe("Web3ApiClient", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens, registrarAddress, resolverAddress } = await initTestEnvironment();
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

  const mockPlugin = () => {
    class Query extends PluginModule {
      getData(_: unknown) { return 100; }
    }

    class Mutation extends PluginModule {
      deployContract(_: unknown): string { return "0x100" }
    }

    class MockPlugin implements Plugin {
      getModules(): PluginModules {
        return {
          query: new Query({}),
          mutation: new Mutation({}),
        };
      }
    }

    return {
      factory: () => new MockPlugin(),
      manifest: {
        schema: ``,
        implements: [],
      },
    };
  };

  const mockMapPlugin = () => {
    interface Config extends Record<string, unknown> {
      map: Map<string, number>;
    }

    class Query extends PluginModule<Config> {
      async getMap(_: unknown) { return this.config.map }
    }

    class Mutation extends PluginModule<Config> {
      updateMap(input: {
        map: Map<string, number>;
      }): Map<string, number> {
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

      private map = new Map().set("a", 1).set("b", 2)

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

  it("default client config", () => {
    const client = new Web3ApiClient();

    expect(client.getRedirects()).toStrictEqual([]);
    expect(client.getPlugins().map((x) => x.uri)).toStrictEqual([
      new Uri("w3://ens/ipfs.web3api.eth"),
      new Uri("w3://ens/ens.web3api.eth"),
      new Uri("w3://ens/ethereum.web3api.eth"),
      new Uri("w3://ens/http.web3api.eth"),
      new Uri("w3://ens/js-logger.web3api.eth"),
      new Uri("w3://ens/uts46.web3api.eth"),
      new Uri("w3://ens/sha3.web3api.eth"),
      new Uri("w3://ens/graph-node.web3api.eth"),
      new Uri("w3://ens/fs.web3api.eth"),
    ]);
    expect(client.getInterfaces()).toStrictEqual([
      {
        interface: coreInterfaceUris.uriResolver,
        implementations: [
          new Uri("w3://ens/ipfs.web3api.eth"),
          new Uri("w3://ens/ens.web3api.eth"),
          new Uri("w3://ens/fs.web3api.eth"),
        ],
      },
      {
        interface: coreInterfaceUris.logger,
        implementations: [new Uri("w3://ens/js-logger.web3api.eth")],
      },
    ]);
  });

  it("invoke with decode false/true works as expected", async () => {
    const client = await getClient();
    
    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });

    const ensUri = `ens/testnet/${api.ensDomain}`;
    
    // The decode option is defaulted to true
    {
      const result = await client.invoke<string>({
        uri: ensUri,
        module: "mutation",
        method: "deployContract",
        input: {
          connection: {
            networkNameOrChainId: "testnet",
          },
        },
      });

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(typeof result.data).toBe("string");
      expect(result.data).toContain("0x");
    }

    // When decode is set to false, an ArrayBuffer is returned
    {
      const result = await client.invoke({
        uri: ensUri,
        module: "mutation",
        method: "deployContract",
        input: {
          connection: {
            networkNameOrChainId: "testnet",
          },
        },
        noDecode: true,
      });

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data instanceof ArrayBuffer).toBeTruthy();
      expect(msgpackDecode(result.data as ArrayBuffer)).toContain("0x");
    }
  });

  it("client noDefaults flag works as expected", async () => {
    let client = new Web3ApiClient();
    expect(client.getPlugins().length !== 0).toBeTruthy();

    client = new Web3ApiClient({}, {});
    expect(client.getPlugins().length !== 0).toBeTruthy();

    client = new Web3ApiClient({}, { noDefaults: false });
    expect(client.getPlugins().length !== 0).toBeTruthy();

    client = new Web3ApiClient({}, { noDefaults: true });
    expect(client.getPlugins().length === 0).toBeTruthy();
  });

  it("invoke simple-storage with custom redirects", async () => {
    const client = await getClient({
      plugins: [
        {
          uri: "w3://ens/mock.web3api.eth",
          plugin: mockPlugin(),
        },
      ],
    });
    
    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });

    const ensUri = `ens/testnet/${api.ensDomain}`;

    const redirects = [
      {
        from: ensUri,
        to: "w3://ens/mock.web3api.eth",
      },
    ];

    const result = await client.invoke({
      uri: ensUri,
      module: "mutation",
      method: "deployContract",
      input: {},
      config: {
        redirects,
      },
    });

    expect(result.data).toBeTruthy();
    expect(result.data).toBe("0x100");
  });

  it("simple-storage with query time redirects", async () => {
    const client = await getClient({
      plugins: [
        {
          uri: "w3://ens/mock.web3api.eth",
          plugin: mockPlugin(),
        },
      ],
    });
    
    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress
    });

    const ensUri = `ens/testnet/${api.ensDomain}`;

    const redirects = [
      {
        from: ensUri,
        to: "w3://ens/mock.web3api.eth",
      },
    ];

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: ensUri,
      query: `
        mutation {
          deployContract(
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      config: {
        redirects,
      },
    });

    expect(deploy.errors).toBeFalsy();
    expect(deploy.data).toBeTruthy();
    expect(deploy.data?.deployContract).toBe("0x100");

    const get = await client.query<{
      getData: number;
    }>({
      uri: ensUri,
      query: `
        query {
          getData(
            address: "0x10"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      config: {
        redirects,
      },
    });

    expect(get.errors).toBeFalsy();
    expect(get.data).toBeTruthy();
    expect(get.data?.getData).toBe(100);

    const getFail = await client.query<{
      getData: number;
    }>({
      uri: ensUri,
      query: `
        query {
          getData(
            address: "0x10"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(getFail.errors).toBeTruthy();
    expect(getFail.data?.getData).toBeFalsy();
  });

  it("redirect registration", () => {
    const implementation1Uri = "w3://ens/some-implementation1.eth";
    const implementation2Uri = "w3://ens/some-implementation2.eth";

    const client = new Web3ApiClient({
      redirects: [
        {
          from: implementation1Uri,
          to: implementation2Uri,
        },
      ],
    });

    const redirects = client.getRedirects();

    expect(redirects).toEqual([
      {
        from: new Uri(implementation1Uri),
        to: new Uri(implementation2Uri),
      },
    ]);
  });

  it("plugin registration - with default plugins", () => {
    const implementationUri = "w3://ens/some-implementation.eth";
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

  it("interface registration", () => {
    const interfaceUri = "w3://ens/some-interface1.eth";
    const implementation1Uri = "w3://ens/some-implementation1.eth";
    const implementation2Uri = "w3://ens/some-implementation2.eth";

    const client = new Web3ApiClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementation1Uri, implementation2Uri],
        },
      ],
    });

    const interfaces = client.getInterfaces();

    const defaultClientConfig = getDefaultClientConfig();

    expect(interfaces).toEqual(
      [
        {
          interface: new Uri(interfaceUri),
          implementations: [
            new Uri(implementation1Uri),
            new Uri(implementation2Uri),
          ],
        },
      ].concat(defaultClientConfig.interfaces ?? [])
    );

    const implementations = client.getImplementations(interfaceUri);

    expect(implementations).toEqual([implementation1Uri, implementation2Uri]);
  });

  it("get all implementations of interface", async () => {
    const interface1Uri = "w3://ens/some-interface1.eth";
    const interface2Uri = "w3://ens/some-interface2.eth";
    const interface3Uri = "w3://ens/some-interface3.eth";

    const implementation1Uri = "w3://ens/some-implementation.eth";
    const implementation2Uri = "w3://ens/some-implementation2.eth";
    const implementation3Uri = "w3://ens/some-implementation3.eth";
    const implementation4Uri = "w3://ens/some-implementation4.eth";

    const client = await getClient({
      redirects: [
        {
          from: interface1Uri,
          to: interface2Uri,
        },
        {
          from: implementation1Uri,
          to: implementation2Uri,
        },
        {
          from: implementation2Uri,
          to: implementation3Uri,
        },
      ],
      plugins: [
        {
          uri: implementation4Uri,
          plugin: {
            factory: () => ({} as Plugin),
            manifest: {
              schema: "",
              implements: [],
            },
          },
        },
      ],
      interfaces: [
        {
          interface: interface1Uri,
          implementations: [implementation1Uri, implementation2Uri],
        },
        {
          interface: interface2Uri,
          implementations: [implementation3Uri],
        },
        {
          interface: interface3Uri,
          implementations: [implementation3Uri, implementation4Uri],
        },
      ],
    });

    const implementations1 = client.getImplementations(interface1Uri, {
      applyRedirects: true,
    });
    const implementations2 = client.getImplementations(interface2Uri, {
      applyRedirects: true,
    });
    const implementations3 = client.getImplementations(interface3Uri, {
      applyRedirects: true,
    });

    expect(implementations1).toEqual([
      implementation1Uri,
      implementation2Uri,
      implementation3Uri,
    ]);

    expect(implementations2).toEqual([
      implementation1Uri,
      implementation2Uri,
      implementation3Uri,
    ]);

    expect(implementations3).toEqual([implementation3Uri, implementation4Uri]);
  });

  it("plugins should not get registered with an interface uri (without default plugins)", () => {
    const interface1Uri = "w3://ens/some-interface1.eth";
    const interface2Uri = "w3://ens/some-interface2.eth";
    const interface3Uri = "w3://ens/some-interface3.eth";

    const implementationUri = "w3://ens/some-implementation.eth";

    expect(() => {
      new Web3ApiClient({
        plugins: [
          {
            uri: interface1Uri,
            plugin: {
              factory: () => ({} as Plugin),
              manifest: {
                schema: "",
                implements: [],
              },
            },
          },
          {
            uri: interface2Uri,
            plugin: {
              factory: () => ({} as Plugin),
              manifest: {
                schema: "",
                implements: [],
              },
            },
          },
        ],
        interfaces: [
          {
            interface: interface1Uri,
            implementations: [implementationUri],
          },
          {
            interface: interface2Uri,
            implementations: [implementationUri],
          },
          {
            interface: interface3Uri,
            implementations: [implementationUri],
          },
        ],
      });
    }).toThrow(
      `Plugins can't use interfaces for their URI. Invalid plugins: ${[
        interface1Uri,
        interface2Uri,
      ]}`
    );
  });

  it("plugins should not get registered with an interface uri (with default plugins)", async () => {
    const interfaceUri = "w3://ens/some-interface.eth";

    const implementationUri = "w3://ens/some-implementation.eth";

    await expect(async () => {
      await getClient({
        plugins: [
          {
            uri: interfaceUri,
            plugin: {
              factory: () => ({} as Plugin),
              manifest: {
                schema: "",
                implements: [],
              },
            },
          },
        ],
        interfaces: [
          {
            interface: interfaceUri,
            implementations: [implementationUri],
          },
        ],
      });
    }).rejects.toThrow(
      `Plugins can't use interfaces for their URI. Invalid plugins: ${[
        interfaceUri,
      ]}`
    );
  });

  it("get implementations - do not return plugins that are not explicitly registered", () => {
    const interfaceUri = "w3://ens/some-interface.eth";

    const implementation1Uri = "w3://ens/some-implementation1.eth";
    const implementation2Uri = "w3://ens/some-implementation2.eth";

    const client = new Web3ApiClient({
      plugins: [
        {
          uri: implementation1Uri,
          plugin: {
            factory: () => ({} as Plugin),
            manifest: {
              schema: "",
              implements: [new Uri(interfaceUri)],
            },
          },
        },
      ],
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementation2Uri],
        },
      ],
    });

    const getImplementationsResult = client.getImplementations(
      new Uri(interfaceUri),
      { applyRedirects: true }
    );

    expect(getImplementationsResult).toEqual([new Uri(implementation2Uri)]);
  });

  it("get implementations - return implementations for plugins which don't have interface stated in manifest", () => {
    const interfaceUri = "w3://ens/some-interface.eth";

    const implementation1Uri = "w3://ens/some-implementation1.eth";
    const implementation2Uri = "w3://ens/some-implementation2.eth";

    const client = new Web3ApiClient({
      plugins: [
        {
          uri: implementation1Uri,
          plugin: {
            factory: () => ({} as Plugin),
            manifest: {
              schema: "",
              implements: [],
            },
          },
        },
      ],
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementation1Uri, implementation2Uri],
        },
      ],
    });

    const getImplementationsResult = client.getImplementations(
      new Uri(interfaceUri),
      { applyRedirects: true }
    );

    expect(getImplementationsResult).toEqual([
      new Uri(implementation1Uri),
      new Uri(implementation2Uri),
    ]);
  });

  it("loadWeb3Api - pass string or Uri", async () => {
    const implementationUri = "w3://ens/some-implementation.eth";
    const schemaStr = "test-schema";

    const client = new Web3ApiClient({
      plugins: [
        {
          uri: implementationUri,
          plugin: {
            factory: () => ({} as Plugin),
            manifest: {
              schema: schemaStr,
              implements: [],
            },
          },
        },
      ],
    });

    const schemaWhenString = await client.getSchema(implementationUri);
    const schemaWhenUri = await client.getSchema(new Uri(implementationUri));

    expect(schemaWhenString).toEqual(schemaStr);
    expect(schemaWhenUri).toEqual(schemaStr);
  });

  it("getImplementations - pass string or Uri", async () => {
    const oldInterfaceUri = "ens/old.eth";
    const newInterfaceUri = "ens/new.eth";

    const implementation1Uri = "w3://ens/some-implementation1.eth";
    const implementation2Uri = "w3://ens/some-implementation2.eth";

    const client = new Web3ApiClient({
      redirects: [
        {
          from: oldInterfaceUri,
          to: newInterfaceUri,
        },
      ],
      interfaces: [
        {
          interface: oldInterfaceUri,
          implementations: [implementation1Uri],
        },
        {
          interface: newInterfaceUri,
          implementations: [implementation2Uri],
        },
      ],
    });

    let result = client.getImplementations(oldInterfaceUri);
    expect(result).toEqual([implementation1Uri]);

    result = client.getImplementations(oldInterfaceUri, {
      applyRedirects: true,
    });
    expect(result).toEqual([implementation1Uri, implementation2Uri]);

    let result2 = client.getImplementations(new Uri(oldInterfaceUri));
    expect(result2).toEqual([new Uri(implementation1Uri)]);

    result2 = client.getImplementations(new Uri(oldInterfaceUri), {
      applyRedirects: true,
    });
    expect(result2).toEqual([
      new Uri(implementation1Uri),
      new Uri(implementation2Uri),
    ]);
  });

  it("getManifest -- web3api manifest, build manifest, meta manifest", async () => {
    const client = await getClient();

    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });

    const ensUri = `ens/testnet/${api.ensDomain}`;

    const actualManifestStr: string = readFileSync(
      `${GetPathToTestApis()}/simple-storage/build/web3api.json`,
      "utf8"
    );
    const actualManifest: Web3ApiManifest = deserializeWeb3ApiManifest(
      actualManifestStr
    );
    const manifest: Web3ApiManifest = await client.getManifest(ensUri, {
      type: "web3api",
    });
    expect(manifest).toStrictEqual(actualManifest);

    const actualBuildManifestStr: string = readFileSync(
      `${GetPathToTestApis()}/simple-storage/build/web3api.build.json`,
      "utf8"
    );
    const actualBuildManifest: BuildManifest = deserializeBuildManifest(
      actualBuildManifestStr
    );
    const buildManifest: BuildManifest = await client.getManifest(ensUri, {
      type: "build",
    });
    expect(buildManifest).toStrictEqual(actualBuildManifest);

    const actualMetaManifestStr: string = readFileSync(
      `${GetPathToTestApis()}/simple-storage/build/web3api.meta.json`,
      "utf8"
    );
    const actualMetaManifest: MetaManifest = deserializeMetaManifest(
      actualMetaManifestStr
    );
    const metaManifest: MetaManifest = await client.getManifest(ensUri, {
      type: "meta",
    });
    expect(metaManifest).toStrictEqual(actualMetaManifest);
  });

  it("getSchema -- plugin schema", async () => {
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

  it("getFile -- simple-storage web3api", async () => {
    const client = await getClient();
    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });

    const ensUri = `ens/testnet/${api.ensDomain}`;

    const manifest: Web3ApiManifest = await client.getManifest(ensUri, {
      type: "web3api",
    });

    const fileStr: string = (await client.getFile(ensUri, {
      path: manifest.modules.query?.schema as string,
      encoding: "utf8",
    })) as string;
    expect(fileStr).toContain(`getData(
    address: String!
    connection: Ethereum_Connection
  ): Int!
`);

    const fileBuffer: ArrayBuffer = (await client.getFile(ensUri, {
      path: manifest.modules.query?.schema!,
    })) as ArrayBuffer;
    const decoder = new TextDecoder("utf8");
    const text = decoder.decode(fileBuffer);
    expect(text).toContain(`getData(
    address: String!
    connection: Ethereum_Connection
  ): Int!
`);

    await expect(() =>
      client.getManifest(new Uri("w3://ens/ipfs.web3api.eth"), {
        type: "web3api",
      })
    ).rejects.toThrow(
      "client.getManifest(...) is not implemented for Plugins."
    );
    await expect(() =>
      client.getFile(new Uri("w3://ens/ipfs.web3api.eth"), {
        path: "./index.js",
      })
    ).rejects.toThrow("client.getFile(...) is not implemented for Plugins.");
  });

  it("simple-storage: subscribe", async () => {
    const client = await getClient();

    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });

    const ensUri = `ens/testnet/${api.ensDomain}`;
    const ipfsUri = `ipfs/${api.ipfsCid}`;

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: ensUri,
      query: `
        mutation {
          deployContract(
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(deploy.errors).toBeFalsy();
    expect(deploy.data).toBeTruthy();
    expect(deploy.data?.deployContract.indexOf("0x")).toBeGreaterThan(-1);

    const address = deploy.data?.deployContract;

    // test subscription
    let results: number[] = [];
    let value = 0;

    const setter = setInterval(async () => {
      await client.query<{
        setData: string;
      }>({
        uri: ipfsUri,
        query: `
        mutation {
          setData(
            address: $address
            value: $value
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
        variables: {
          address: address,
          value: value++,
        },
      });
    }, 4000);

    const getSubscription: Subscription<{
      getData: number;
    }> = client.subscribe<{
      getData: number;
    }>({
      uri: ensUri,
      query: `
        query {
          getData(
            address: $address
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        address,
      },
      frequency: { ms: 4500 },
    });

    for await (let query of getSubscription) {
      expect(query.errors).toBeFalsy();
      const val = query.data?.getData;
      if (val !== undefined) {
        results.push(val);
        if (val >= 2) {
          break;
        }
      }
    }
    clearInterval(setter);

    expect(results).toStrictEqual([0, 1, 2]);
  });

  it("simple-storage: subscription early stop", async () => {
    const client = await getClient();

    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });
    const ensUri = `ens/testnet/${api.ensDomain}`;
    const ipfsUri = `ipfs/${api.ipfsCid}`;

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: ensUri,
      query: `
        mutation {
          deployContract(
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(deploy.errors).toBeFalsy();
    expect(deploy.data).toBeTruthy();
    expect(deploy.data?.deployContract.indexOf("0x")).toBeGreaterThan(-1);

    const address = deploy.data?.deployContract;

    // test subscription
    let results: number[] = [];
    let value = 0;

    const setter = setInterval(async () => {
      await client.query<{
        setData: string;
      }>({
        uri: ipfsUri,
        query: `
          mutation {
            setData(
              address: $address
              value: $value
              connection: {
                networkNameOrChainId: "testnet"
              }
            )
          }
        `,
        variables: {
          address: address,
          value: value++,
        },
      });
    }, 4000);

    const getSubscription: Subscription<{
      getData: number;
    }> = client.subscribe<{
      getData: number;
    }>({
      uri: ensUri,
      query: `
          query {
            getData(
              address: $address
              connection: {
                networkNameOrChainId: "testnet"
              }
            )
          }
        `,
      variables: {
        address,
      },
      frequency: { ms: 4500 },
    });

    new Promise(async () => {
      for await (let query of getSubscription) {
        expect(query.errors).toBeFalsy();
        const val = query.data?.getData;
        if (val !== undefined) {
          results.push(val);
          if (val >= 2) {
            break;
          }
        }
      }
    });
    await new Promise((r) => setTimeout(r, 8000));
    getSubscription.stop();
    clearInterval(setter);

    expect(results).toContain(0);
    expect(results).not.toContain(2);
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

  it("merge user-defined interface implementations with each other", async () => {
    const interfaceUri = "w3://ens/interface.eth";
    const implementationUri1 = "w3://ens/implementation1.eth";
    const implementationUri2 = "w3://ens/implementation2.eth";

    const client = new Web3ApiClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri1],
        },
        {
          interface: interfaceUri,
          implementations: [implementationUri2],
        },
      ],
    });

    const interfaces = client
      .getInterfaces()
      .filter((x) => x.interface.uri === interfaceUri);
    expect(interfaces.length).toEqual(1);

    const implementationUris = interfaces[0].implementations;

    expect(implementationUris).toEqual([
      new Uri(implementationUri1),
      new Uri(implementationUri2),
    ]);
  });

  it("merge user-defined interface implementations with defaults", async () => {
    const interfaceUri = coreInterfaceUris.uriResolver.uri;
    const implementationUri1 = "w3://ens/implementation1.eth";
    const implementationUri2 = "w3://ens/implementation2.eth";

    const client = new Web3ApiClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri1],
        },
        {
          interface: interfaceUri,
          implementations: [implementationUri2],
        },
      ],
    });

    const interfaces = client
      .getInterfaces()
      .filter((x) => x.interface.uri === interfaceUri);
    expect(interfaces.length).toEqual(1);

    const implementationUris = interfaces[0].implementations;

    expect(implementationUris).toEqual([
      new Uri(implementationUri1),
      new Uri(implementationUri2),
      ...getDefaultClientConfig().interfaces.find(
        (x) => x.interface.uri === interfaceUri
      )!.implementations,
    ]);
  });
});
