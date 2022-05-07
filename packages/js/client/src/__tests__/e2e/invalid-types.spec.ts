import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("bytes-type", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  let ensUri: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens, resolverAddress, registrarAddress } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;

    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/invalid-types`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });

    ensUri = `ens/testnet/${api.ensDomain}`;
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
  });

  test("invalid int type", async () => {
    const client = await getClient();

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
  });

  test("invalid uint type", async () => {
    const client = await getClient();

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
  });

  test("invalid bytes type", async () => {
    const client = await getClient();

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
  });

  test("invalid array type", async () => {
    const client = await getClient();

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
});