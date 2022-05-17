import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("json-type", () => {
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
      apiAbsPath: `${GetPathToTestApis()}/json-type`,
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

  it("fromJson", async () => {
    const client = await getClient();

    const parse = await client.invoke<{ x: number; y: number }>({
      uri: ensUri,
      module: "query",
      method: "fromJson",
      input: {
        json: JSON.stringify({ x: 1, y: 2 }),
      },
    });

    expect(parse.error).toBeFalsy();
    expect(parse.data).toBeTruthy();
    expect(parse.data).toMatchObject({
      x: 1,
      y: 2,
    });
  });

  it("toJson", async () => {
    const client = await getClient();

    const stringify = await client.invoke<{ str: string }>({
      uri: ensUri,
      module: "query",
      method: "toJson",
      input: {
        pair: {
          x: 1,
          y: 2,
        },
      },
    });

    expect(stringify.error).toBeFalsy();
    expect(stringify.data).toBeTruthy();
    expect(stringify.data).toBe(
      JSON.stringify({
        x: 1,
        y: 2,
      })
    );
  });
});