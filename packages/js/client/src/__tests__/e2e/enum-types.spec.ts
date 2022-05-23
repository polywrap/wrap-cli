import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("enum-types", () => {
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
      apiAbsPath: `${GetPathToTestApis()}/enum-types`,
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
