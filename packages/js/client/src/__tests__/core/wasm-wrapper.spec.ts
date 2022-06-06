import {
  buildApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import {
  Uri,
  createWeb3ApiClient,
  Web3ApiClientConfig,
  Plugin,
  PluginModule,
  Subscription,
  Web3ApiManifest,
  BuildManifest,
  MetaManifest,
  deserializeWeb3ApiManifest,
  deserializeBuildManifest,
  deserializeMetaManifest,
  msgpackDecode
} from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";
import fs from "fs";

jest.setTimeout(200000);

describe("wasm-wrapper", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  const apiPath = `${GetPathToTestApis()}/wasm-as/simple-storage`
  const apiUri = `fs/${apiPath}/build`

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;

    await buildApi(apiPath);
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

  const mockPlugin = () => {
    class Main extends PluginModule {
      getData(_: unknown) {
        return 100;
      }
      deployContract(_: unknown): string {
        return "0x100";
      }
    }

    class MockPlugin implements Plugin {
      getModule(): PluginModule {
        return new Main({})
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

  test("invoke with decode defaulted to true works as expected", async () => {
    const client = await getClient();
    const result = await client.invoke<string>({
      uri: apiUri,
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
  });

  test("invoke with decode set to false works as expected", async () => {
    const client = await getClient();
    const result = await client.invoke({
      uri: apiUri,
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
  });

  it("should invoke wrapper with custom redirects", async () => {
    const client = await getClient({
      plugins: [
        {
          uri: "w3://ens/mock.web3api.eth",
          plugin: mockPlugin(),
        },
      ],
    });

    const redirects = [
      {
        from: apiUri,
        to: "w3://ens/mock.web3api.eth",
      },
    ];

    const result = await client.invoke({
      uri: apiUri,
      method: "deployContract",
      input: {},
      config: {
        redirects,
      },
    });

    expect(result.data).toBeTruthy();
    expect(result.data).toBe("0x100");
  });

  it("should allow query time redirects", async () => {
    const client = await getClient({
      plugins: [
        {
          uri: "w3://ens/mock.web3api.eth",
          plugin: mockPlugin(),
        },
      ],
    });

    const redirects = [
      {
        from: apiUri,
        to: "w3://ens/mock.web3api.eth",
      },
    ];

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: apiUri,
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
      uri: apiUri,
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
      uri: apiUri,
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

  test("getManifest -- web3api manifest, build manifest, meta manifest", async () => {
    const client = await getClient();

    const actualManifestStr: string = fs.readFileSync(
      `${GetPathToTestApis()}/wasm-as/simple-storage/build/web3api.json`,
      "utf8"
    );
    const actualManifest: Web3ApiManifest = deserializeWeb3ApiManifest(
      actualManifestStr
    );
    const manifest: Web3ApiManifest = await client.getManifest(apiUri, {
      type: "web3api",
    });
    expect(manifest).toStrictEqual(actualManifest);

    const actualBuildManifestStr: string = fs.readFileSync(
      `${GetPathToTestApis()}/wasm-as/simple-storage/build/web3api.build.json`,
      "utf8"
    );
    const actualBuildManifest: BuildManifest = deserializeBuildManifest(
      actualBuildManifestStr
    );
    const buildManifest: BuildManifest = await client.getManifest(apiUri, {
      type: "build",
    });
    expect(buildManifest).toStrictEqual(actualBuildManifest);

    const actualMetaManifestStr: string = fs.readFileSync(
      `${GetPathToTestApis()}/wasm-as/simple-storage/build/web3api.meta.json`,
      "utf8"
    );
    const actualMetaManifest: MetaManifest = deserializeMetaManifest(
      actualMetaManifestStr
    );
    const metaManifest: MetaManifest = await client.getManifest(apiUri, {
      type: "meta",
    });
    expect(metaManifest).toStrictEqual(actualMetaManifest);
  });

  test("getFile -- simple-storage web3api", async () => {
    const client = await getClient();

    const manifest: Web3ApiManifest = await client.getManifest(apiUri, {
      type: "web3api",
    });

    const fileStr: string = (await client.getFile(apiUri, {
      path: manifest.schema as string,
      encoding: "utf8",
    })) as string;
    expect(fileStr).toContain(`getData(
    address: String!
    connection: Ethereum_Connection
  ): Int!
`);

    const fileBuffer: ArrayBuffer = (await client.getFile(apiUri, {
      path: manifest.schema!,
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

  test("subscribe", async () => {
    const client = await getClient();

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: apiUri,
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
        uri: apiUri,
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
      uri: apiUri,
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

  test("subscription early stop", async () => {
    const client = await getClient();

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: apiUri,
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
        uri: apiUri,
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
      uri: apiUri,
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
});