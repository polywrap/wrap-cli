import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("wasm-getImpls", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  let interfaceUri: string;
  let implementationUri: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens, resolverAddress, registrarAddress } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;

    interfaceUri = "w3://ens/interface.eth";

    const implementationApi = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/implementations/test-use-getImpl`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });
    implementationUri = `w3://ens/testnet/${implementationApi.ensDomain}`;
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


  it("e2e getImplementations capability", async () => {


    const client = await getClient({
      interfaces: [
        {
          interface: interfaceUri,
          implementations: [implementationUri],
        },
      ],
    });

    expect(client.getImplementations(interfaceUri)).toEqual([
      implementationUri,
    ]);

    const query = await client.query<{
      queryMethod: string;
      abstractQueryMethod: string;
    }>({
      uri: implementationUri,
      query: `
        query {
          queryImplementations
        }
      `,
      variables: {},
    });

    expect(query.errors).toBeFalsy();
    expect(query.data).toBeTruthy();
    expect((query.data as any).queryImplementations).toEqual([
      implementationUri,
    ]);
  });
});