import {
  buildApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("invalid-types", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  const apiPath = `${GetPathToTestApis()}/invalid-types`
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



  test("invalid bool type", async () => {
    const client = await getClient();

    const invalidBoolIntSent = await client.query({
      uri: apiUri,
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
  });

  test("invalid int type", async () => {
    const client = await getClient();

    const invalidIntBoolSent = await client.query({
      uri: apiUri,
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
  });

  test("invalid uint type", async () => {
    const client = await getClient();

    const invalidUIntArraySent = await client.query({
      uri: apiUri,
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
  });

  test("invalid bytes type", async () => {
    const client = await getClient();

    const invalidBytesFloatSent = await client.query({
      uri: apiUri,
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
  });

  test("invalid array type", async () => {
    const client = await getClient();

    const invalidArrayMapSent = await client.query({
      uri: apiUri,
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
});