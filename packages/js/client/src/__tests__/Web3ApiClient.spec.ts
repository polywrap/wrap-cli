import { createWeb3ApiClient, Web3ApiClientConfig } from "../";
import {
  buildAndDeployApi,
  initTestEnvironment,
  runCLI,
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
  Client,
  PluginModules,
} from "@web3api/core-js";
import * as MsgPack from "@msgpack/msgpack";
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
          addresses: {
            testnet: ensAddress,
          },
        },
      },
      config
    );
  };

  const mockPlugin = () => {
    class MockPlugin extends Plugin {
      getModules(_client: Client): PluginModules {
        return {
          query: {
            getData: async (_: unknown) => 100,
          },
          mutation: {
            deployContract: (_: unknown): string => "0x100",
          },
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

  it("default client config", () => {
    const client = new Web3ApiClient();

    expect(client.getRedirects()).toStrictEqual([]);
    expect(
        client.getPlugins().map(x => x.uri)
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
        client.getInterfaces()
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
        implementations: [new Uri("w3://ens/js-logger.web3api.eth")],
      },
    ]);
  });

  it("invoke with decode false/true works as expected", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfsProvider,
      ensAddress
    );

    const ensUri = `ens/testnet/${api.ensDomain}`;
    const client = await getClient();

    // The decode option is defaulted to true
    {
      const result = await client.invoke<string>({
        uri: ensUri,
        module: "mutation",
        method: "deployContract",
        input: {
          connection: {
            networkNameOrChainId: "testnet"
          }
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
            networkNameOrChainId: "testnet"
          }
        },
        noDecode: true
      });

      expect(result.error).toBeFalsy();
      expect(result.data).toBeTruthy();
      expect(result.data instanceof ArrayBuffer).toBeTruthy();
      expect(MsgPack.decode(result.data as ArrayBuffer)).toContain("0x");
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
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfsProvider,
      ensAddress
    );

    const ensUri = `ens/testnet/${api.ensDomain}`;

    const redirects = [
      {
        from: ensUri,
        to: "w3://ens/mock.web3api.eth",
      },
    ];

    const client = await getClient({
      plugins: [
        {
          uri: "w3://ens/mock.web3api.eth",
          plugin: mockPlugin(),
        },
      ],
    });

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
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfsProvider,
      ensAddress
    );

    const ensUri = `ens/testnet/${api.ensDomain}`;

    const redirects = [
      {
        from: ensUri,
        to: "w3://ens/mock.web3api.eth",
      },
    ];

    const client = await getClient({
      plugins: [
        {
          uri: "w3://ens/mock.web3api.eth",
          plugin: mockPlugin(),
        },
      ],
    });

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
            }
          }
        }
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

  it("asyncify", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/asyncify`,
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

    if (!deploy.data) {
      return;
    }

    const address = deploy.data.deployContract;

    const subsequentInvokes = await client.query<{
      subsequentInvokes: string;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          subsequentInvokes(
            address: "${address}"
            numberOfTimes: 40
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    const expected = Array.from(new Array(40), (_, index) => index.toString());

    expect(subsequentInvokes.errors).toBeFalsy();
    expect(subsequentInvokes.data).toBeTruthy();
    expect(subsequentInvokes.data?.subsequentInvokes).toEqual(expected);

    const localVarMethod = await client.query<{
      localVarMethod: boolean;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          localVarMethod(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(localVarMethod.errors).toBeFalsy();
    expect(localVarMethod.data).toBeTruthy();
    expect(localVarMethod.data?.localVarMethod).toEqual(true);

    const globalVarMethod = await client.query<{
      globalVarMethod: boolean;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          globalVarMethod(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(globalVarMethod.errors).toBeFalsy();
    expect(globalVarMethod.data).toBeTruthy();
    expect(globalVarMethod.data?.globalVarMethod).toEqual(true);

    const largeStr = new Array(10000).join("web3api ");

    const setDataWithLargeArgs = await client.query<{
      setDataWithLargeArgs: string;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          setDataWithLargeArgs(
            address: "${address}"
            value: $largeStr
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        largeStr,
      },
    });

    expect(setDataWithLargeArgs.errors).toBeFalsy();
    expect(setDataWithLargeArgs.data).toBeTruthy();
    expect(setDataWithLargeArgs.data?.setDataWithLargeArgs).toEqual(largeStr);

    const setDataWithManyArgs = await client.query<{
      setDataWithManyArgs: string;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          setDataWithManyArgs(
            address: "${address}"
            valueA: $valueA
            valueB: $valueB
            valueC: $valueC
            valueD: $valueD
            valueE: $valueE
            valueF: $valueF
            valueG: $valueG
            valueH: $valueH
            valueI: $valueI
            valueJ: $valueJ
            valueK: $valueK
            valueL: $valueL
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        valueA: "web3api a",
        valueB: "web3api b",
        valueC: "web3api c",
        valueD: "web3api d",
        valueE: "web3api e",
        valueF: "web3api f",
        valueG: "web3api g",
        valueH: "web3api h",
        valueI: "web3api i",
        valueJ: "web3api j",
        valueK: "web3api k",
        valueL: "web3api l",
      },
    });

    expect(setDataWithManyArgs.errors).toBeFalsy();
    expect(setDataWithManyArgs.data).toBeTruthy();
    expect(setDataWithManyArgs.data?.setDataWithManyArgs).toEqual(
      "web3api aweb3api bweb3api cweb3api dweb3api eweb3api fweb3api gweb3api hweb3api iweb3api jweb3api kweb3api l"
    );

    const createObj = (i: number) => {
      return {
        propA: `a-${i}`,
        propB: `b-${i}`,
        propC: `c-${i}`,
        propD: `d-${i}`,
        propE: `e-${i}`,
        propF: `f-${i}`,
        propG: `g-${i}`,
        propH: `h-${i}`,
        propI: `i-${i}`,
        propJ: `j-${i}`,
        propK: `k-${i}`,
        propL: `l-${i}`,
      };
    };

    const setDataWithManyStructuredArgs = await client.query<{
      setDataWithManyStructuredArgs: string;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          setDataWithManyStructuredArgs(
            address: "${address}"
            valueA: $valueA
            valueB: $valueB
            valueC: $valueC
            valueD: $valueD
            valueE: $valueE
            valueF: $valueF
            valueG: $valueG
            valueH: $valueH
            valueI: $valueI
            valueJ: $valueJ
            valueK: $valueK
            valueL: $valueL
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        valueA: createObj(1),
        valueB: createObj(2),
        valueC: createObj(3),
        valueD: createObj(4),
        valueE: createObj(5),
        valueF: createObj(6),
        valueG: createObj(7),
        valueH: createObj(8),
        valueI: createObj(9),
        valueJ: createObj(10),
        valueK: createObj(11),
        valueL: createObj(12),
      },
    });

    expect(setDataWithManyStructuredArgs.errors).toBeFalsy();
    expect(setDataWithManyStructuredArgs.data).toBeTruthy();
    expect(
      setDataWithManyStructuredArgs.data?.setDataWithManyStructuredArgs
    ).toBe(true);
  });

  it("simple-storage", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
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

    if (!deploy.data) {
      return;
    }

    const address = deploy.data.deployContract;
    const set = await client.query<{
      setData: string;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          setData(
            address: "${address}"
            value: $value
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        value: 55,
      },
    });

    expect(set.errors).toBeFalsy();
    expect(set.data).toBeTruthy();
    expect(set.data?.setData.indexOf("0x")).toBeGreaterThan(-1);

    const getWithStringType = await client.query<{
      getData: number;
      secondGetData: number;
      thirdGetData: number;
    }>({
      uri: ensUri,
      query: `
        query {
          getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
          secondGetData: getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
          thirdGetData: getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(getWithStringType.errors).toBeFalsy();
    expect(getWithStringType.data).toBeTruthy();
    expect(getWithStringType.data?.getData).toBe(55);
    expect(getWithStringType.data?.secondGetData).toBe(55);
    expect(getWithStringType.data?.thirdGetData).toBe(55);

    const getWithUriType = await client.query<{
      getData: number;
      secondGetData: number;
      thirdGetData: number;
    }>({
      uri: ensUri,
      query: `
        query {
          getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
          secondGetData: getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
          thirdGetData: getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(getWithUriType.errors).toBeFalsy();
    expect(getWithUriType.data).toBeTruthy();
    expect(getWithUriType.data?.getData).toBe(55);
    expect(getWithUriType.data?.secondGetData).toBe(55);
    expect(getWithUriType.data?.thirdGetData).toBe(55);
  });

  it("object-types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/object-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const client = await getClient();

    const method1a = await client.query<{
      method1: {
        prop: string;
        nested: {
          prop: string;
        };
      }[];
    }>({
      uri: ensUri,
      query: `
        query {
          method1(
            arg1: {
              prop: "arg1 prop"
              nested: {
                prop: "arg1 nested prop"
              }
            }
          )
        }
      `,
    });

    expect(method1a.errors).toBeFalsy();
    expect(method1a.data).toBeTruthy();
    expect(method1a.data).toMatchObject({
      method1: [
        {
          prop: "arg1 prop",
          nested: {
            prop: "arg1 nested prop",
          },
        },
        {
          prop: "",
          nested: {
            prop: "",
          },
        },
      ],
    });

    const method1b = await client.query<{
      method1: {
        prop: string;
        nested: {
          prop: string;
        };
      }[];
    }>({
      uri: ensUri,
      query: `
        query {
          method1(
            arg1: {
              prop: "arg1 prop"
              nested: {
                prop: "arg1 nested prop"
              }
            }
            arg2: {
              prop: "arg2 prop"
              circular: {
                prop: "arg2 circular prop"
              }
            }
          )
        }
      `,
    });

    expect(method1b.errors).toBeFalsy();
    expect(method1b.data).toBeTruthy();
    expect(method1b.data).toMatchObject({
      method1: [
        {
          prop: "arg1 prop",
          nested: {
            prop: "arg1 nested prop",
          },
        },
        {
          prop: "arg2 prop",
          nested: {
            prop: "arg2 circular prop",
          },
        },
      ],
    });

    const method2a = await client.query<{
      method2: {
        prop: string;
        nested: {
          prop: string;
        };
      } | null;
    }>({
      uri: ensUri,
      query: `
        query {
          method2(
            arg: {
              prop: "arg prop"
              nested: {
                prop: "arg nested prop"
              }
            }
          )
        }
      `,
    });

    expect(method2a.errors).toBeFalsy();
    expect(method2a.data).toBeTruthy();
    expect(method2a.data).toMatchObject({
      method2: {
        prop: "arg prop",
        nested: {
          prop: "arg nested prop",
        },
      },
    });

    const method2b = await client.query<{
      method2: {
        prop: string;
        nested: {
          prop: string;
        };
      } | null;
    }>({
      uri: ensUri,
      query: `
        query {
          method2(
            arg: {
              prop: "null"
              nested: {
                prop: "arg nested prop"
              }
            }
          )
        }
      `,
    });

    expect(method2b.errors).toBeFalsy();
    expect(method2b.data).toBeTruthy();
    expect(method2b.data).toMatchObject({
      method2: null,
    });

    const method3 = await client.query<{
      method3: ({
        prop: string;
        nested: {
          prop: string;
        };
      } | null)[];
    }>({
      uri: ensUri,
      query: `
        query {
          method3(
            arg: {
              prop: "arg prop"
              nested: {
                prop: "arg nested prop"
              }
            }
          )
        }
      `,
    });

    expect(method3.errors).toBeFalsy();
    expect(method3.data).toBeTruthy();
    expect(method3.data).toMatchObject({
      method3: [
        null,
        {
          prop: "arg prop",
          nested: {
            prop: "arg nested prop",
          },
        },
      ],
    });

    const method5 = await client.query<{
      method5: {
        prop: string;
        nested: {
          prop: string;
        };
      };
    }>({
      uri: ensUri,
      query: `
        query {
          method5(
            arg: {
              prop: [49, 50, 51, 52]
            }
          )
        }
      `,
    });

    expect(method5.errors).toBeFalsy();
    expect(method5.data).toBeTruthy();
    expect(method5.data).toMatchObject({
      method5: {
        prop: "1234",
        nested: {
          prop: "nested prop",
        },
      },
    });
  });

  it("bigint-type", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/bigint-type`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const client = await getClient();

    {
      const response = await client.query<{
        method: string;
      }>({
        uri: ensUri,
        query: `query {
          method(
            arg1: "123456789123456789"
            obj: {
              prop1: "987654321987654321"
            }
          )
        }`,
      });

      const result =
        BigInt("123456789123456789") * BigInt("987654321987654321");

      expect(response.errors).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        method: result.toString(),
      });
    }

    {
      const response = await client.query<{
        method: string;
      }>({
        uri: ensUri,
        query: `query {
          method(
            arg1: "123456789123456789"
            arg2: "123456789123456789123456789123456789"
            obj: {
              prop1: "987654321987654321"
              prop2: "987654321987654321987654321987654321"
            }
          )
        }`,
      });

      const result =
        BigInt("123456789123456789") *
        BigInt("123456789123456789123456789123456789") *
        BigInt("987654321987654321") *
        BigInt("987654321987654321987654321987654321");

      expect(response.errors).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        method: result.toString(),
      });
    }
  });

  it("JSON-type", async () => {
    type Json = string;

    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/json-type`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;
    const client = await getClient();

    const value = { foo: "bar", bar: "baz" };
    const parseResponse = await client.query<{
      parse: Json;
    }>({
      uri: ensUri,
      query: `query {
        parse(value: $value)
      }`,
      variables: {
        value: JSON.stringify(value),
      },
    });

    expect(parseResponse.data?.parse).toEqual(JSON.stringify(value));

    const values = [
      JSON.stringify({ bar: "foo" }),
      JSON.stringify({ baz: "fuz" }),
    ];
    const stringifyResponse = await client.query<{
      stringify: Json;
    }>({
      uri: ensUri,
      query: `query {
        stringify(
          values: $values
        )
      }`,
      variables: {
        values,
      },
    });

    expect(stringifyResponse.data?.stringify).toEqual(values.join(""));

    const object = {
      jsonA: JSON.stringify({ foo: "bar" }),
      jsonB: JSON.stringify({ fuz: "baz" }),
    };
    const stringifyObjectResponse = await client.query<{
      stringifyObject: string;
    }>({
      uri: ensUri,
      query: `query {
        stringifyObject(
          object: $object
        )
      }`,
      variables: {
        object,
      },
    });

    expect(stringifyObjectResponse.data?.stringifyObject).toEqual(
      object.jsonA + object.jsonB
    );

    const methodJSONResponse = await client.query<{
      methodJSON: Json;
    }>({
      uri: ensUri,
      query: `query {
        methodJSON(valueA: 5, valueB: "foo", valueC: true)
      }`,
    });

    const methodJSONResult = JSON.stringify({
      valueA: 5,
      valueB: "foo",
      valueC: true,
    });
    expect(methodJSONResponse.data?.methodJSON).toEqual(methodJSONResult);
  });

  it("bytes-type", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/bytes-type`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const client = await getClient();

    const response = await client.query<{
      bytesMethod: Buffer;
    }>({
      uri: ensUri,
      query: `
        query {
          bytesMethod(
            arg: {
              prop: $buffer
            }
          )
        }
      `,
      variables: {
        buffer: Buffer.from("Argument Value"),
      },
    });

    expect(response.errors).toBeFalsy();
    expect(response.data).toBeTruthy();
    expect(response.data).toMatchObject({
      bytesMethod: Buffer.from("Argument Value Sanity!").buffer,
    });
  });

  it("enum-types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/enum-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const client = await getClient();

    const method1a = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method1(
            en: 5
          )
        }
      `,
    });

    expect(method1a.errors).toBeTruthy();
    expect((method1a.errors as Error[])[0].message).toMatch(
      /__w3_abort: Invalid value for enum 'Enum': 5/gm
    );

    const method1b = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method1(
            en: 2
            optEnum: 1
          )
        }
      `,
    });

    expect(method1b.errors).toBeFalsy();
    expect(method1b.data).toBeTruthy();
    expect(method1b.data).toMatchObject({
      method1: 2,
    });

    const method1c = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method1(
            en: 1
            optEnum: INVALID
          )
        }
      `,
    });

    expect(method1c.errors).toBeTruthy();
    // @ts-ignore
    expect(method1c.errors[0].message).toMatch(
      /__w3_abort: Invalid key for enum 'Enum': INVALID/gm
    );

    const method2a = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method2(
            enumArray: [OPTION1, 0, OPTION3]
          )
        }
      `,
    });

    expect(method2a.errors).toBeFalsy();
    expect(method2a.data).toBeTruthy();
    expect(method2a.data).toMatchObject({
      method2: [0, 0, 2],
    });
  });

  it("should work with large types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/large-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;
    const client = await getClient();

    const largeStr = new Array(10000).join("web3api ");
    const largeBytes = new Uint8Array(Buffer.from(largeStr));
    const largeStrArray = [];
    const largeBytesArray = [];

    for (let i = 0; i < 100; i++) {
      largeStrArray.push(largeStr);
      largeBytesArray.push(largeBytes);
    }

    const largeTypesMethodCall = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method(
            largeCollection: {
              largeStr: $largeStr
              largeBytes: $largeBytes
              largeStrArray: $largeStrArray
              largeBytesArray: $largeBytesArray
            }
          )
        }
      `,
      variables: {
        largeStr: largeStr,
        largeBytes: largeBytes,
        largeStrArray: largeStrArray,
        largeBytesArray: largeBytesArray,
      },
    });

    expect(largeTypesMethodCall.data).toBeTruthy();
    expect(largeTypesMethodCall.data).toEqual({
      method: {
        largeStr: largeStr,
        largeBytes: largeBytes,
        largeStrArray: largeStrArray,
        largeBytesArray: largeBytesArray,
      },
    });
  });

  it("number-types under and overflows", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/number-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;
    const client = await getClient();

    const i8Underflow = await client.query<{
      i8Method: number;
    }>({
      uri: ensUri,
      query: `
      query {
        i8Method(
          first: $firstInt
          second: $secondInt
        )
      }
    `,
      variables: {
        firstInt: -129, // min i8 = -128
        secondInt: 10,
      },
    });
    expect(i8Underflow.errors).toBeTruthy();
    expect(i8Underflow.errors?.[0].message).toMatch(
      /integer overflow: value = -129; bits = 8/
    );
    expect(i8Underflow.data?.i8Method).toBeUndefined();

    const u8Overflow = await client.query<{
      u8Method: number;
    }>({
      uri: ensUri,
      query: `
        query {
          u8Method(
            first: $firstInt
            second: $secondInt
          )
        }
      `,
      variables: {
        firstInt: 256, // max u8 = 255
        secondInt: 10,
      },
    });
    expect(u8Overflow.errors).toBeTruthy();
    expect(u8Overflow.errors?.[0].message).toMatch(
      /unsigned integer overflow: value = 256; bits = 8/
    );
    expect(u8Overflow.data?.u8Method).toBeUndefined();

    const i16Underflow = await client.query<{
      i16Method: number;
    }>({
      uri: ensUri,
      query: `
      query {
        i16Method(
          first: $firstInt
          second: $secondInt
        )
      }
    `,
      variables: {
        firstInt: -32769, // min i16 = -32768
        secondInt: 10,
      },
    });
    expect(i16Underflow.errors).toBeTruthy();
    expect(i16Underflow.errors?.[0].message).toMatch(
      /integer overflow: value = -32769; bits = 16/
    );
    expect(i16Underflow.data?.i16Method).toBeUndefined();

    const u16Overflow = await client.query<{
      u16Method: number;
    }>({
      uri: ensUri,
      query: `
        query {
          u16Method(
            first: $firstInt
            second: $secondInt
          )
        }
      `,
      variables: {
        firstInt: 65536, // max u16 = 65535
        secondInt: 10,
      },
    });
    expect(u16Overflow.errors).toBeTruthy();
    expect(u16Overflow.errors?.[0].message).toMatch(
      /unsigned integer overflow: value = 65536; bits = 16/
    );
    expect(u16Overflow.data?.u16Method).toBeUndefined();

    const i32Underflow = await client.query<{
      i32Method: number;
    }>({
      uri: ensUri,
      query: `
      query {
        i32Method(
          first: $firstInt
          second: $secondInt
        )
      }
    `,
      variables: {
        firstInt: -2147483649, // min i32 = -2147483648
        secondInt: 10,
      },
    });
    expect(i32Underflow.errors).toBeTruthy();
    expect(i32Underflow.errors?.[0].message).toMatch(
      /integer overflow: value = -2147483649; bits = 32/
    );
    expect(i32Underflow.data?.i32Method).toBeUndefined();

    const u32Overflow = await client.query<{
      u32Method: number;
    }>({
      uri: ensUri,
      query: `
        query {
          u32Method(
            first: $firstInt
            second: $secondInt
          )
        }
      `,
      variables: {
        firstInt: 4294967296, // max u32 = 4294967295
        secondInt: 10,
      },
    });
    expect(u32Overflow.errors).toBeTruthy();
    expect(u32Overflow.errors?.[0].message).toMatch(
      /unsigned integer overflow: value = 4294967296; bits = 32/
    );
    expect(u32Overflow.data?.u32Method).toBeUndefined();
  });

  it("invalid type errors", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/invalid-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;
    const client = await getClient();

    const invalidBoolIntSent = await client.query({
      uri: ensUri,
      query: `
        query {
          boolMethod(
            arg: $integer
          )
        }
      `,
      variables: {
        integer: 10,
      },
    });
    expect(invalidBoolIntSent.errors).toBeTruthy();
    expect(invalidBoolIntSent.errors?.[0].message).toMatch(
      /Property must be of type 'bool'. Found 'int'./
    );

    const invalidIntBoolSent = await client.query({
      uri: ensUri,
      query: `
      query {
        intMethod(
          arg: $bool
        )
      }
    `,
      variables: {
        bool: true,
      },
    });
    expect(invalidIntBoolSent.errors).toBeTruthy();
    expect(invalidIntBoolSent.errors?.[0].message).toMatch(
      /Property must be of type 'int'. Found 'bool'./
    );

    const invalidUIntArraySent = await client.query({
      uri: ensUri,
      query: `
      query {
        uIntMethod(
          arg: $array
        )
      }
    `,
      variables: {
        array: [10],
      },
    });
    expect(invalidUIntArraySent.errors).toBeTruthy();
    expect(invalidUIntArraySent.errors?.[0].message).toMatch(
      /Property must be of type 'uint'. Found 'array'./
    );

    const invalidBytesFloatSent = await client.query({
      uri: ensUri,
      query: `
      query {
        bytesMethod(
          arg: $float
        )
      }
    `,
      variables: {
        float: 10.15,
      },
    });
    expect(invalidBytesFloatSent.errors).toBeTruthy();
    expect(invalidBytesFloatSent.errors?.[0].message).toMatch(
      /Property must be of type 'bytes'. Found 'float64'./
    );

    const invalidArrayMapSent = await client.query({
      uri: ensUri,
      query: `
      query {
        arrayMethod(
          arg: $object
        )
      }
    `,
      variables: {
        object: {
          prop: "prop",
        },
      },
    });
    expect(invalidArrayMapSent.errors).toBeTruthy();
    expect(invalidArrayMapSent.errors?.[0].message).toMatch(
      /Property must be of type 'array'. Found 'map'./
    );
  });

  it("environment types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/environment-types`,
      ipfsProvider,
      ensAddress
    );

    const ensUri = `ens/testnet/${api.ensDomain}`;
    const client = await getClient({
      environments: [
        {
          uri: "w3://" + ensUri,
          common: {
            object: {
              prop: "object string"
            },
            str: "string",
            optFilledStr: "optional string",
            number: 10,
            bool: true,
            en: "FIRST",
          },
          mutation: {
            mutStr: "mutation string",
          },
          query: {
            queryStr: "query string",
          }
        }
      ]
    });

    const queryEnv = await client.query({
      uri: ensUri,
      query: `
        query {
          environment(
            arg: "string"
          )
        }
      `,
    });
    expect(queryEnv.errors).toBeFalsy();
    expect(queryEnv.data?.environment).toEqual({
      str: "string",
      optFilledStr: "optional string",
      optStr: null,
      number: 10,
      optNumber: null,
      bool: true,
      optBool: null,
      object: {
        prop: "object string"
      },
      optObject: null,
      en: 0,
      optEnum: null,
      queryStr: "query string"
    });

    const mutationEnv = await client.query({
      uri: ensUri,
      query: `
        mutation {
          mutEnvironment(
            arg: "string"
          )
        }
      `,
    });
    expect(mutationEnv.errors).toBeFalsy();
    expect(mutationEnv.data?.mutEnvironment).toEqual({
      str: "string",
      optFilledStr: "optional string",
      optStr: null,
      number: 10,
      optNumber: null,
      bool: true,
      optBool: null,
      object: {
        prop: "object string"
      },
      en: 0,
      optEnum: null,
      optObject: null,
      mutStr: "mutation string"
    });
  });

  it("environment client types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/environment-client-types`,
      ipfsProvider,
      ensAddress
    );

    const ensUri = `ens/testnet/${api.ensDomain}`;
    const client = await getClient({
      environments: [
        {
          uri: "w3://" + ensUri,
          mutation: {
            str: "string",
          },
          query: {
            str: "string",
          }
        }
      ]
    });

    const queryEnv = await client.query({
      uri: ensUri,
      query: `
        query {
          environment(
            arg: "string"
          )
        }
      `,
    });
    expect(queryEnv.errors).toBeFalsy();
    expect(queryEnv.data?.environment).toEqual({
      str: "string",
      optStr: null,
      defStr: "default string"
    });

    const mutationEnv = await client.query({
      uri: ensUri,
      query: `
        mutation {
          mutEnvironment(
            arg: "string"
          )
        }
      `,
    });
    expect(mutationEnv.errors).toBeFalsy();
    expect(mutationEnv.data?.mutEnvironment).toEqual({
      str: "string",
      optStr: null,
      defMutStr: "default mutation string"
    });
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

  it("e2e interface implementations", async () => {
    let interfaceApi = await buildAndDeployApi(
      `${GetPathToTestApis()}/implementations/test-interface`,
      ipfsProvider,
      ensAddress
    );
    const interfaceUri = `w3://ens/testnet/${interfaceApi.ensDomain}`;

    const implementationApi = await buildAndDeployApi(
      `${GetPathToTestApis()}/implementations/test-api`,
      ipfsProvider,
      ensAddress
    );
    const implementationUri = `w3://ens/testnet/${implementationApi.ensDomain}`;

    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    expect(client.getImplementations(interfaceUri)).toEqual([
      implementationUri,
    ]);

    const query = await client.query<{
      queryMethod: string;
      abstractQueryMethod: string;
    }>({
      uri: implementationUri,
      query: `
        query {
          queryMethod(
            arg: $argument1
          )
          abstractQueryMethod(
            arg: $argument2
          )
        }
      `,
      variables: {
        argument1: {
          uint8: 1,
          str: "Test String 1",
        },
        argument2: {
          str: "Test String 2",
        },
      },
    });

    expect(query.errors).toBeFalsy();
    expect(query.data).toBeTruthy();
    expect(query.data?.queryMethod).toEqual({
      uint8: 1,
      str: "Test String 1",
    });

    expect(query.data?.abstractQueryMethod).toBe("Test String 2");

    const mutation = await client.query<{
      mutationMethod: string;
      abstractMutationMethod: string;
    }>({
      uri: implementationUri,
      query: `
      mutation {
          mutationMethod(
            arg: $argument1
          )
          abstractMutationMethod(
            arg: $argument2
          )
        }
      `,
      variables: {
        argument1: 1,
        argument2: 2,
      },
    });

    expect(mutation.errors).toBeFalsy();
    expect(mutation.data).toBeTruthy();
    expect(mutation.data?.mutationMethod).toBe(1);
    expect(mutation.data?.abstractMutationMethod).toBe(2);
  });

  it("getManifest -- web3api manifest, build manifest, meta manifest", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfsProvider,
      ensAddress
    );
    const client = await getClient();
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const actualManifestStr: string = readFileSync(
      `${GetPathToTestApis()}/simple-storage/build/web3api.yaml`,
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
      `${GetPathToTestApis()}/simple-storage/build/web3api.build.yaml`,
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
      `${GetPathToTestApis()}/simple-storage/build/web3api.meta.yaml`,
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
`
    );
  });

  it("getFile -- simple-storage web3api", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfsProvider,
      ensAddress
    );
    const client = await getClient();
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
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
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
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
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

  it("e2e getImplementations capability", async () => {
    const interfaceUri = "w3://ens/interface.eth"

    const implementationApi = await buildAndDeployApi(
      `${GetPathToTestApis()}/implementations/test-use-getImpl`,
      ipfsProvider,
      ensAddress
    );
    const implementationUri = `w3://ens/testnet/${implementationApi.ensDomain}`;

    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        }
      ],
    });

    expect(client.getImplementations(interfaceUri))
      .toEqual([implementationUri]);

    const query = await client.query<{
      queryMethod: string;
      abstractQueryMethod: string;
    }>({
      uri: implementationUri,
      query: `
        query {
          queryImplementations
        }
      `,
      variables: {},
    });

    expect(query.errors).toBeFalsy();
    expect(query.data).toBeTruthy();
    expect((query.data as any).queryImplementations).toEqual([implementationUri]);
  });

  it("e2e Interface invoke method", async () => {
    const interfaceUri = "w3://ens/interface.eth";
    // Build interface polywrapper
    await runCLI({ args: ["build"], cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`});

    const implementationApi = await buildAndDeployApi(
      `${GetPathToTestApis()}/interface-invoke/test-implementation`,
      ipfsProvider,
      ensAddress
    );
    const implementationUri = `w3://ens/testnet/${implementationApi.ensDomain}`;

    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        }
      ],
    });

    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/interface-invoke/test-api`,
      ipfsProvider,
      ensAddress
    );
    const apiUri = `w3://ens/testnet/${api.ensDomain}`;

    const query = await client.query<{
      queryMethod: string;
    }>({
      uri: apiUri,
      query: `query{
        queryMethod(
          arg: {
            uint8: 1,
            str: "Test String 1",
          }
        )
      }`,
    });

    console.log(query)

    expect(query.errors).toBeFalsy();
    expect(query.data).toBeTruthy();
    expect(query.data?.queryMethod).toEqual({
      uint8: 1,
      str: "Test String 1",
    });

    const mutation = await client.query<{
      mutationMethod: string;
    }>({
      uri: apiUri,
      query: `mutation {
        mutationMethod(
          arg: 1
        )
      }`
    });

    expect(mutation.errors).toBeFalsy();
    expect(mutation.data).toBeTruthy();
    expect(mutation.data?.mutationMethod).toBe(1);
  });

});
