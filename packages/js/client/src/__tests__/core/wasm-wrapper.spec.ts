import {
  buildWrapper,
  ensAddresses,
  initTestEnvironment,
  stopTestEnvironment,
  providers,
} from "@polywrap/test-env-js";
import { msgpackDecode } from "@polywrap/msgpack-js";
import {
  Uri,
  createPolywrapClient,
  PolywrapClientConfig,
  PluginModule,
  Subscription,
} from "../..";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";

jest.setTimeout(200000);

describe("wasm-wrapper", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`;
  const wrapperUri = `fs/${wrapperPath}/build`;

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
        ipfs: {},
        ens: {
          addresses: {
            testnet: ensAddress,
          },
        },
      },
      {
        ...config,
        envs: [
          {
            uri: "wrap://ens/ipfs.polywrap.eth",
            env: {
              provider: ipfsProvider,
            },
          },
        ],
      }
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

  test("getFile -- simple-storage polywrap", async () => {
    const client = await getClient();
    const expectedSchema = await fs.promises.readFile(
      `${wrapperPath}/build/schema.graphql`,
      "utf8"
    );

    const fileStr: string = (await client.getFile(wrapperUri, {
      path: "./schema.graphql",
      encoding: "utf8",
    })) as string;

    expect(fileStr).toEqual(expectedSchema);

    const fileBuffer: Uint8Array = (await client.getFile(wrapperUri, {
      path: "./schema.graphql",
    })) as Uint8Array;
    const decoder = new TextDecoder("utf8");
    const text = decoder.decode(fileBuffer);

    expect(text).toEqual(expectedSchema);

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

    const getSubscription: Subscription<number> = client.subscribe<number>({
      uri: wrapperUri,
      method: "getData",
      args: {
        address: address,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
      frequency: { ms: 4500 },
    });

    for await (let query of getSubscription) {
      expect(query.error).toBeFalsy();
      const val = query.data;
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

    const getSubscription: Subscription<number> = client.subscribe<number>({
      uri: wrapperUri,
      method: "getData",
      args: {
        address: address,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
      frequency: { ms: 4500 },
    });

    new Promise(async () => {
      for await (let query of getSubscription) {
        expect(query.error).toBeFalsy();
        const val = query.data;
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
