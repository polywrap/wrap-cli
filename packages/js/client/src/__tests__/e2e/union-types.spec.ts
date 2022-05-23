import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("union-types", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  let ensUri: string;
  let ipfsUri: string;

  beforeAll(async () => {
    const {
      ipfs,
      ethereum,
      ensAddress: ens,
      resolverAddress,
      registrarAddress,
    } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;
    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/union-types`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });

    ensUri = `ens/testnet/${api.ensDomain}`;
    ipfsUri = `ipfs/${api.ipfsCid}`;
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

  it("sanity", async () => {
    const client = await getClient();

    const argUnionA = {
      prop: "test",
    };

    const argMethodErr = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          argMethod(
            arg: {
              type: ArgUnionC,
              value: $argUnionA
            }
          )
        }
      `,
      variables: {
        argUnionA,
      },
    });

    expect((argMethodErr.errors as Error[])[0].message).toMatch(
      /__w3_abort: Found invalid union member type 'ArgUnionC' for union 'ArgUnion'. Valid member types: ArgUnionA, ArgUnionB/gm
    );

    const argMethodErr2 = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          argMethod(
            arg: {
              type: ArgUnionA,
              value: $argUnionA
            }
          )
        }
      `,
      variables: {
        argUnionA: {
          propD: "test",
        },
      },
    });

    expect((argMethodErr2.errors as Error[])[0].message).toMatch(
      /__w3_abort: Missing required property: 'prop: String'/gm
    );

    const argMethoda = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          argMethod(
            arg: {
              type: ArgUnionA,
              value: $argUnionA
            }
          )
        }
      `,
      variables: {
        argUnionA,
      },
    });

    expect(argMethoda.errors).toBeFalsy();
    expect(argMethoda.data).toBeTruthy();
    expect(argMethoda.data.argMethod).toBe("test");

    const argUnionB = {
      prop: true,
    };

    const argMethodb = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          argMethod(
            arg: {
              type: ArgUnionB,
              value: $argUnionB
            }
          )
        }
      `,
      variables: {
        argUnionB,
      },
    });

    expect(argMethodb.errors).toBeFalsy();
    expect(argMethodb.data).toBeTruthy();
    expect(argMethodb.data.argMethod).toBe("true");

    const typeUnionAReturnMethod = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          returnMethod(
            arg: true
          )
        }
      `,
    });

    expect(typeUnionAReturnMethod.errors).toBeFalsy();
    expect(typeUnionAReturnMethod.data).toBeTruthy();
    expect(typeUnionAReturnMethod.data.returnMethod).toEqual({
      propA: 1,
    });

    const typeUnionBReturnMethod = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          returnMethod(
            arg: false
          )
        }
      `,
    });

    expect(typeUnionBReturnMethod.errors).toBeFalsy();
    expect(typeUnionBReturnMethod.data).toBeTruthy();
    expect(typeUnionBReturnMethod.data.returnMethod).toEqual({
      propB: true,
    });

    const arrayMethod = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          arrayMethod(
            arg: $argVal
          )
        }
      `,
      variables: {
        argVal: [
          {
            type: "ArgUnionA",
            value: {
              prop: "A",
            },
          },
          {
            type: "ArgUnionB",
            value: {
              prop: true,
            },
          },
          {
            type: "ArgUnionC",
            value: {
              foo: "C",
            },
          },
        ],
      },
    });

    expect(arrayMethod.errors).toBeFalsy();
    expect(arrayMethod.data).toBeTruthy();
    expect(arrayMethod.data.arrayMethod).toEqual([1, 2, 3]);

    const optionalAMethod = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          optionalMethod
        }
      `,
    });

    expect(optionalAMethod.errors).toBeFalsy();
    expect(optionalAMethod.data).toBeTruthy();
    expect(optionalAMethod.data.optionalMethod).toEqual(null);

    const optionalBMethod = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          optionalMethod(
            arg: $argVal
          )
        }
      `,
      variables: {
        argVal: {
          type: "ArgUnionA",
          value: {
            prop: "A",
          },
        },
      },
    });

    expect(optionalBMethod.errors).toBeFalsy();
    expect(optionalBMethod.data).toBeTruthy();
    expect(optionalBMethod.data.optionalMethod).toEqual([
      { propA: 1 },
      { propB: true },
    ]);
  });
});
