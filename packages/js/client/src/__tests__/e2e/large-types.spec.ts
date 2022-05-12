import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("large-types", () => {
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
      apiAbsPath: `${GetPathToTestApis()}/large-types`,
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


  it("should work with large types", async () => {
    const client = await getClient();
    const largeStr = new Array(10000).join("web3api ");
    const largeBytes = new Uint8Array(Buffer.from(largeStr));
    const largeStrArray = [];
    const largeBytesArray = [];

    for (let i = 0; i < 100; i++) {
      largeStrArray.push(largeStr);
      largeBytesArray.push(largeBytes);
    }

    const largeTypesMethodCall = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method(
            largeCollection: {
              largeStr: $largeStr
              largeBytes: $largeBytes
              largeStrArray: $largeStrArray
              largeBytesArray: $largeBytesArray
            }
          )
        }
      `,
      variables: {
        largeStr: largeStr,
        largeBytes: largeBytes,
        largeStrArray: largeStrArray,
        largeBytesArray: largeBytesArray,
      },
    });

    expect(largeTypesMethodCall.data).toBeTruthy();
    expect(largeTypesMethodCall.data).toEqual({
      method: {
        largeStr: largeStr,
        largeBytes: largeBytes,
        largeStrArray: largeStrArray,
        largeBytesArray: largeBytesArray,
      },
    });
  });
});