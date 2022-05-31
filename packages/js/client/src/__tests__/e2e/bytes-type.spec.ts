import {
  buildApi,
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

  const apiPath = `${GetPathToTestApis()}/bytes-type`;
  const apiUri = `fs/${apiPath}/build`

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;

    await buildApi(apiPath);;
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

    const response = await client.query<{
      bytesMethod: Buffer;
    }>({
      uri: apiUri,
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
});