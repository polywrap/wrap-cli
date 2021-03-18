import {
  createWeb3ApiClient
} from "../";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(50000);

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

  it("simple-storage", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfsProvider,
      ensAddress
    );

    const client = await createWeb3ApiClient({
      ethereum: { provider: ethProvider },
      ipfs: { provider: ipfsProvider },
      ens: { address: ensAddress }
    });

    const ensUri = `ens/${api.ensDomain}`;
    const ipfsUri = `ipfs/${api.ipfsCid}`;

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: ensUri,
      query: `
        mutation {
          deployContract
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

    const get = await client.query<{
      getData: number;
      secondGetData: number;
      thirdGetData: number;
    }>({
      uri: ensUri,
      query: `
        query {
          getData(
            address: "${address}"
          )
          secondGetData: getData(
            address: "${address}"
          )
          thirdGetData: getData(
            address: "${address}"
          )
        }
      `,
    });

    expect(get.errors).toBeFalsy();
    expect(get.data).toBeTruthy();
    expect(get.data?.getData).toBe(55);
    expect(get.data?.secondGetData).toBe(55);
    expect(get.data?.thirdGetData).toBe(55);
  });

  it("object-types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/object-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/${api.ensDomain}`;

    const client = await createWeb3ApiClient({
      ethereum: { provider: ethProvider },
      ipfs: { provider: ipfsProvider },
      ens: { address: ensAddress }
    });

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

    const method4 = await client.query<{
      method4: ({
        prop: string;
        nested: {
          prop: string;
        };
      } | null)[];
    }>({
      uri: ensUri,
      query: `
        query {
          method4(
            arg: {
              prop: {
                root: {
                  prop: {

                  }
                }
              }
            }
          )
        }
      `,
    });

    expect(method4.errors).toBeTruthy();
    if (method4.errors) {
      expect(method4.errors[0].message).toMatch(
        /__w3_abort: Missing required property: 'root: InfiniteRoot'/gm
      );
    }

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

  it("bytes-type", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/bytes-type`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/${api.ensDomain}`;

    const client = await createWeb3ApiClient({
      ethereum: { provider: ethProvider },
      ipfs: { provider: ipfsProvider },
      ens: { address: ensAddress }
    });

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
    const ensUri = `ens/${api.ensDomain}`;

    const client = await createWeb3ApiClient({
      ethereum: { provider: ethProvider },
      ipfs: { provider: ipfsProvider },
      ens: { address: ensAddress }
    });

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
});
