import {
  buildApi,
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

  const apiPath = `${GetPathToTestApis()}/bigint-type`
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


  it("sanity", async () => {
    const client = await getClient();
    {
      const response = await client.query<{
        method: string;
      }>({
        uri: apiUri,
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
        uri: apiUri,
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