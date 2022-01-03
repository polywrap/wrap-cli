import { Client, createWeb3ApiClient, Uri, Web3ApiClientConfig } from "..";
import {
  buildAndDeployApi,
  initTestEnvironment,
  runCLI,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("Web3ApiClient - resolveUri", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
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
          addresses: {
            testnet: ensAddress,
          },
        },
      },
      config
    );
  };

  it("sanity", async () => {
    const uri = new Uri("ens/uri.eth");
   
    const client = await getClient();

    const result = await client.resolveUri(uri);

    expect(result.uri).toEqual(uri);
    expect(result.uriHistory.stack).toEqual([]);
  });

  it("can resolve redirects", async () => {
    const fromUri = new Uri("ens/from.eth");
    const toUri1 = new Uri("ens/to1.eth");
    const toUri2 = new Uri("ens/to2.eth");
   
    const client = await getClient({
      redirects: [
        {
          from: fromUri.uri,
          to: toUri1.uri,
        },
        {
          from: toUri1.uri,
          to: toUri2.uri,
        }
      ]
    });

    const result = await client.resolveUri(fromUri);

    expect(result.uri).toEqual(toUri2);
    expect(result.api).toBeFalsy();
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.stack).toEqual([
      {
        sourceUri: fromUri.uri,
        resolver: "RedirectsResolver"
      }
    ]);
  });

  it("can resolve plugin", async () => {
    const pluginUri = new Uri("ens/plugin.eth");
   
    const client = await getClient({
      plugins: [
        {
          uri: pluginUri.uri,
          plugin: {
            factory: () => {
              return {
                getModules: (client: Client) => {
                  return {};
                }
              };
            },
            manifest: {
              schema: "",
              implements: []
            }
          }
        }
      ]
    });

    const result = await client.resolveUri(pluginUri);

    expect(result.api).toBeTruthy();
    expect(result.uri).toBe(pluginUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.stack).toEqual([
      {
        sourceUri: pluginUri.uri,
        resolver: "PluginResolver"
      }
    ]);
  });

  it("can resolve api", async () => {
    await runCLI({ args: ["build"], cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`});

    const client = await getClient();

    const deployResult = await buildAndDeployApi(
      `${GetPathToTestApis()}/interface-invoke/test-api`,
      ipfsProvider,
      ensAddress
    );
    const apiUri = new Uri(`w3://ens/testnet/${deployResult.ensDomain}`);

    const result = await client.resolveUri(apiUri);

    expect(result.api).toBeTruthy();
    expect(result.uri).toBeTruthy();
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.stack).toEqual([
      {
        sourceUri: apiUri.uri,
        resolver: "UriResolverImplementationsResolver"
      },
      {
        sourceUri: "w3://ipfs/QmZsGybrGU97miDxRfNPmrfrEoHxm6EXLqYcf9QyYzUTAc",
        resolver: "UriResolverImplementationsResolver"
      }
    ]);
  });
});
