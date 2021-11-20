import {
  ClientConfig,
  createWeb3ApiClient,
} from "../";
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
} from '@web3api/core-js';
import { readFileSync } from "fs";

jest.setTimeout(200000);

describe("Web3ApiClient", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async (config?: ClientConfig) => {
    return createWeb3ApiClient({
      ethereum: {
        networks: {
          testnet: {
            provider: ethProvider,
          },
        },
      },
      ipfs: { provider: ipfsProvider },
      ens: {
        addresses: {
          testnet: ensAddress,
        },
      },
    }, config);
  }

  it("default client config", () => {
    const client = new Web3ApiClient();

    expect(client.redirects()).toStrictEqual([]);
    expect(
        client.plugins().map(x => x.uri)
      ).toStrictEqual([
        new Uri("w3://ens/ipfs.web3api.eth"),
        new Uri("w3://ens/ens.web3api.eth"),
        new Uri("w3://ens/ethereum.web3api.eth"),
        new Uri("w3://ens/http.web3api.eth"),
        new Uri("w3://ens/js-logger.web3api.eth"),
        new Uri("w3://ens/uts46.web3api.eth"),
        new Uri("w3://ens/sha3.web3api.eth"),
        new Uri("w3://ens/graph-node.web3api.eth"),
        new Uri("w3://ens/fs.web3api.eth")
      ]);
    expect(
        client.interfaces()
      ).toStrictEqual([
      {
        interface: coreInterfaceUris.uriResolver,
        implementations: [
          new Uri("w3://ens/ipfs.web3api.eth"),
          new Uri("w3://ens/ens.web3api.eth"),
          new Uri("w3://ens/fs.web3api.eth")
        ]
      },
      {
        interface: coreInterfaceUris.logger,
        implementations: [
          new Uri("w3://ens/js-logger.web3api.eth")
        ],
      },
    ]);
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

    const redirects = client.redirects();

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

    const pluginUris = client.plugins().map((x) => x.uri.uri);

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

    const interfaces = client.interfaces();

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

    expect(implementations).toEqual([
      implementation1Uri,
      implementation2Uri
    ]);
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
          implementations: [
            implementation1Uri,
            implementation2Uri
          ],
        },
        {
          interface: interface2Uri,
          implementations: [
            implementation3Uri
          ],
        },
        {
          interface: interface3Uri,
          implementations: [
            implementation3Uri,
            implementation4Uri
          ],
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
            implementations: [
              implementationUri
            ],
          },
          {
            interface: interface2Uri,
            implementations: [
              implementationUri
            ],
          },
          {
            interface: interface3Uri,
            implementations: [
              implementationUri
            ],
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
            implementations: [
              implementationUri
            ],
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
          implementations: [
            implementation2Uri
          ],
        },
      ],
    });

    const getImplementationsResult = client.getImplementations(
        new Uri(interfaceUri),
        { applyRedirects: true }
      );

    expect(getImplementationsResult).toEqual([
      new Uri(implementation2Uri)
    ]);
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
            }
          }
        }
      ],
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [
            implementation1Uri,
            implementation2Uri
          ],
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
              }
            }
          }
        ]
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

    result = client.getImplementations(oldInterfaceUri, { applyRedirects: true });
    expect(result).toEqual([implementation1Uri, implementation2Uri]);

    let result2 = client.getImplementations(new Uri(oldInterfaceUri));
    expect(result2).toEqual([new Uri(implementation1Uri)]);

    result2 = client.getImplementations(new Uri(oldInterfaceUri), { applyRedirects: true });
    expect(result2).toEqual([new Uri(implementation1Uri), new Uri(implementation2Uri)]);
  });

  it("getManifest -- web3api manifest, build manifest, meta manifest", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensAddress
    );
    const client = await getClient();
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const actualManifestStr: string = readFileSync(`${GetPathToTestApis()}/wasm-as/simple-storage/build/web3api.yaml`, 'utf8');
    const actualManifest: Web3ApiManifest = deserializeWeb3ApiManifest(actualManifestStr);
    const manifest: Web3ApiManifest = await client.getManifest(ensUri, {
      type: 'web3api'
    });
    expect(manifest).toStrictEqual(actualManifest);

    const actualBuildManifestStr: string = readFileSync(`${GetPathToTestApis()}/wasm-as/simple-storage/build/web3api.build.yaml`, 'utf8');
    const actualBuildManifest: BuildManifest = deserializeBuildManifest(actualBuildManifestStr);
    const buildManifest: BuildManifest = await client.getManifest(ensUri, {
      type: 'build'
    });
    expect(buildManifest).toStrictEqual(actualBuildManifest);

    const actualMetaManifestStr: string = readFileSync(`${GetPathToTestApis()}/wasm-as/simple-storage/build/web3api.meta.yaml`, 'utf8');
    const actualMetaManifest: MetaManifest = deserializeMetaManifest(actualMetaManifestStr);
    const metaManifest: MetaManifest = await client.getManifest(ensUri, {
      type: 'meta'
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
scalar JSON

directive @imported(
  uri: String!
  namespace: String!
  nativeType: String!
) on OBJECT | ENUM

directive @imports(
  types: [String!]!
) on OBJECT
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
`);
  });

  it("getFile -- simple-storage web3api", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensAddress
    );
    const client = await getClient();
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const manifest: Web3ApiManifest = await client.getManifest(ensUri, {
      type: 'web3api'
    });

    const fileStr: string = await client.getFile(ensUri, {
      path: manifest.modules.query?.schema as string,
      encoding: 'utf8'
    }) as string;
    expect(fileStr).toContain(`getData(
    address: String!
    connection: Ethereum_Connection
  ): Int!
`);

    const fileBuffer: ArrayBuffer = await client.getFile(ensUri, {
      path: manifest.modules.query?.schema!,
    }) as ArrayBuffer;
    const decoder = new TextDecoder('utf8');
    const text = decoder.decode(fileBuffer);
    expect(text).toContain(`getData(
    address: String!
    connection: Ethereum_Connection
  ): Int!
`);

    await expect(() => client.getManifest(new Uri("w3://ens/ipfs.web3api.eth"), {
      type: "web3api"
    })).rejects.toThrow("client.getManifest(...) is not implemented for Plugins.");
    await expect(() => client.getFile(new Uri("w3://ens/ipfs.web3api.eth"), {
      path: "./index.js",
    })).rejects.toThrow("client.getFile(...) is not implemented for Plugins.");
  });

  it("simple-storage: subscribe", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensAddress
    );
    const client = await getClient();
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

    const setter = setInterval(async() => {
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
        address
      },
      frequency: { ms: 4500 }
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
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/wasm-as/simple-storage`,
      ipfsProvider,
      ensAddress
    );
    const client = await getClient();
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

    const setter = setInterval(async() => {
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
        address
      },
      frequency: { ms: 4500 }
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
      }
    );
    await new Promise(r => setTimeout(r, 8000));
    getSubscription.stop();
    clearInterval(setter);

    expect(results).toContain(0);
    expect(results).not.toContain(2);
  });
});
