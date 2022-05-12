import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("bigint-type", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  let ensUri: string;
  let ipfsUri: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens, resolverAddress, registrarAddress } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;

    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/bigint-type`,
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
    {
      const response = await client.query<{
        method: string;
      }>({
        uri: ensUri,
        query: `query {
          method(
            arg1: "123456789123456789"
            obj: {
              prop1: "987654321987654321"
            }
          )
        }`,
      });

      const result =
        BigInt("123456789123456789") * BigInt("987654321987654321");

      expect(response.errors).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        method: result.toString(),
      });
    }

    {
      const response = await client.query<{
        method: string;
      }>({
        uri: ensUri,
        query: `query {
          method(
            arg1: "123456789123456789"
            arg2: "123456789123456789123456789123456789"
            obj: {
              prop1: "987654321987654321"
              prop2: "987654321987654321987654321987654321"
            }
          )
        }`,
      });

      const result =
        BigInt("123456789123456789") *
        BigInt("123456789123456789123456789123456789") *
        BigInt("987654321987654321") *
        BigInt("987654321987654321987654321987654321");

      expect(response.errors).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        method: result.toString(),
      });
    }
  });
});