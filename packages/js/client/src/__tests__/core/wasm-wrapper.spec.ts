import {
  buildWrapper,
  ensAddresses,
  initTestEnvironment,
  stopTestEnvironment,
  providers
} from "@polywrap/test-env-js";
import {
  Uri,
  createPolywrapClient,
  PolywrapClientConfig,
  PluginModule,
  Subscription,
  PolywrapManifest,
  BuildManifest,
  MetaManifest,
  deserializePolywrapManifest,
  deserializeBuildManifest,
  deserializeMetaManifest,
  msgpackDecode
} from "../..";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";

jest.setTimeout(200000);

describe("wasm-wrapper", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`
  const wrapperUri = `fs/${wrapperPath}/build`

  beforeAll(async () => {
    await initTestEnvironment();
    ipfsProvider = providers.ipfs;
    ethProvider = providers.ethereum;
    ensAddress = ensAddresses.ensAddress;

    await buildWrapper(wrapperPath);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async (config?: Partial<PolywrapClientConfig>) => {
    return createPolywrapClient(
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
    class MockPlugin extends PluginModule<{}> {
      getData(_: unknown) {
        return 100;
      }
      deployContract(_: unknown): string {
        return "0x100";
      }
    }

    return {
      factory: () => new MockPlugin({}),
      manifest: {
        schema: ``,
        implements: [],
      },
    };
  };

  test("invoke with decode defaulted to true works as expected", async () => {
    const client = await getClient();
    const result = await client.invoke<string>({
      uri: wrapperUri,
      method: "deployContract",
      args: {
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
      uri: wrapperUri,
      method: "deployContract",
      args: {
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
      encodeResult: true,
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data instanceof Uint8Array).toBeTruthy();
    expect(msgpackDecode(result.data as Uint8Array)).toContain("0x");
  });

  it("should invoke wrapper with custom redirects", async () => {
    const client = await getClient({
      plugins: [
        {
          uri: "wrap://ens/mock.polywrap.eth",
          plugin: mockPlugin(),
        },
      ],
    });

    const redirects = [
      {
        from: wrapperUri,
        to: "wrap://ens/mock.polywrap.eth",
      },
    ];

    const result = await client.invoke({
      uri: wrapperUri,
      method: "deployContract",
      args: {},
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
          uri: "wrap://ens/mock.polywrap.eth",
          plugin: mockPlugin(),
        },
      ],
    });

    const redirects = [
      {
        from: wrapperUri,
        to: "wrap://ens/mock.polywrap.eth",
      },
    ];

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: wrapperUri,
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
      uri: wrapperUri,
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
      uri: wrapperUri,
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

  test("getManifest -- polywrap manifest, build manifest, meta manifest", async () => {
    const client = await getClient();

    const actualManifestStr: string = fs.readFileSync(
      `${GetPathToTestWrappers()}/wasm-as/simple-storage/build/polywrap.json`,
      "utf8"
    );
    const actualManifest: PolywrapManifest = deserializePolywrapManifest(
      actualManifestStr
    );
    const manifest: PolywrapManifest = await client.getManifest(wrapperUri, {
      type: "polywrap",
    });
    expect(manifest).toStrictEqual(actualManifest);

    const actualBuildManifestStr: string = fs.readFileSync(
      `${GetPathToTestWrappers()}/wasm-as/simple-storage/build/polywrap.build.json`,
      "utf8"
    );
    const actualBuildManifest: BuildManifest = deserializeBuildManifest(
      actualBuildManifestStr
    );
    const buildManifest: BuildManifest = await client.getManifest(wrapperUri, {
      type: "build",
    });
    expect(buildManifest).toStrictEqual(actualBuildManifest);

    const actualMetaManifestStr: string = fs.readFileSync(
      `${GetPathToTestWrappers()}/wasm-as/simple-storage/build/polywrap.meta.json`,
      "utf8"
    );
    const actualMetaManifest: MetaManifest = deserializeMetaManifest(
      actualMetaManifestStr
    );
    const metaManifest: MetaManifest = await client.getManifest(wrapperUri, {
      type: "meta",
    });
    expect(metaManifest).toStrictEqual(actualMetaManifest);
  });

  test("getFile -- simple-storage polywrap", async () => {
    const client = await getClient();

    const manifest: PolywrapManifest = await client.getManifest(wrapperUri, {
      type: "polywrap",
    });

    const fileStr: string = (await client.getFile(wrapperUri, {
      path: manifest.schema as string,
      encoding: "utf8",
    })) as string;
    expect(fileStr).toContain(`getData(
    address: String!
    connection: Ethereum_Connection
  ): Int!
`);

    const fileBuffer: Uint8Array = (await client.getFile(wrapperUri, {
      path: manifest.schema!,
    })) as Uint8Array;
    const decoder = new TextDecoder("utf8");
    const text = decoder.decode(fileBuffer);
    expect(text).toContain(`getData(
    address: String!
    connection: Ethereum_Connection
  ): Int!
`);

    await expect(() =>
      client.getManifest(new Uri("wrap://ens/ipfs.polywrap.eth"), {
        type: "polywrap",
      })
    ).rejects.toThrow(
      "client.getManifest(...) is not implemented for Plugins."
    );
    await expect(() =>
      client.getFile(new Uri("wrap://ens/ipfs.polywrap.eth"), {
        path: "./index.js",
      })
    ).rejects.toThrow("client.getFile(...) is not implemented for Plugins.");
  });

  test("subscribe", async () => {
    const client = await getClient();

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: wrapperUri,
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
        uri: wrapperUri,
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
      uri: wrapperUri,
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
      uri: wrapperUri,
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
        uri: wrapperUri,
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
      uri: wrapperUri,
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