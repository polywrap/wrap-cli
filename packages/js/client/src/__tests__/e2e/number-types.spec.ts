import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("number-types", () => {
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
      apiAbsPath: `${GetPathToTestApis()}/number-types`,
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

  test("i8 underflow", async () => {
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
  });

  test("u8 overflow", async () => {
    const client = await getClient();

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
  });

  test("i16 underflow", async () => {
    const client = await getClient();

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
  });

  test("u16 overflow", async () => {
    const client = await getClient();
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
  });

  test("i32 underflow", async () => {
    const client = await getClient();
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
  });

  test("u32 overflow", async () => {
    const client = await getClient();
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
});