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
    expect(result.uri).toEqual(pluginUri);
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
    const ensUri = new Uri(`ens/testnet/${deployResult.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${deployResult.ipfsCid}`);

    const result = await client.resolveUri(ensUri);

    expect(result.api).toBeTruthy();
    expect(result.uri).toEqual(ipfsUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.stack).toEqual([
      {
        sourceUri: ensUri.uri,
        resolver: "ApiResolver: w3://ens/ens.web3api.eth"
      },
      {
        sourceUri: ipfsUri.uri,
        resolver: "ApiResolver: w3://ens/ipfs.web3api.eth"
      }
    ]);
  });

  it("can resolve cache", async () => {
    await runCLI({ args: ["build"], cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`});

    const client = await getClient();

    const deployResult = await buildAndDeployApi(
      `${GetPathToTestApis()}/interface-invoke/test-api`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = new Uri(`ens/testnet/${deployResult.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${deployResult.ipfsCid}`);

    const result = await client.resolveUri(ipfsUri);

    expect(result.api).toBeTruthy();
    expect(result.uri).toEqual(ipfsUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.stack).toEqual([
      {
        sourceUri: ipfsUri.uri,
        resolver: "ApiResolver: w3://ens/ipfs.web3api.eth"
      }
    ]);

    const result2 = await client.resolveUri(ensUri);

    expect(result2.api).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory.stack).toEqual([
      {
        sourceUri: ensUri.uri,
        resolver: "ApiResolver: w3://ens/ens.web3api.eth"
      },
      {
        sourceUri: ipfsUri.uri,
        resolver: "CacheResolver"
      }
    ]);
  });

  it("can resolve cache - noCacheRead", async () => {
    await runCLI({ args: ["build"], cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`});

    const client = await getClient();

    const deployResult = await buildAndDeployApi(
      `${GetPathToTestApis()}/interface-invoke/test-api`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = new Uri(`ens/testnet/${deployResult.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${deployResult.ipfsCid}`);

    const result = await client.resolveUri(ipfsUri);

    expect(result.api).toBeTruthy();
    expect(result.uri).toEqual(ipfsUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.stack).toEqual([
      {
        sourceUri: ipfsUri.uri,
        resolver: "ApiResolver: w3://ens/ipfs.web3api.eth"
      }
    ]);

    const result2 = await client.resolveUri(ensUri, { noCacheRead: true });

    expect(result2.api).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory.stack).toEqual([
      {
        sourceUri: ensUri.uri,
        resolver: "ApiResolver: w3://ens/ens.web3api.eth"
      },
      {
        sourceUri: ipfsUri.uri,
        resolver: "ApiResolver: w3://ens/ipfs.web3api.eth"
      }
    ]);
  });

  it("can resolve cache - noCacheWrite", async () => {
    await runCLI({ args: ["build"], cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`});

    const client = await getClient();

    const deployResult = await buildAndDeployApi(
      `${GetPathToTestApis()}/interface-invoke/test-api`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = new Uri(`ens/testnet/${deployResult.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${deployResult.ipfsCid}`);

    const result = await client.resolveUri(ipfsUri, { noCacheWrite: true });

    expect(result.api).toBeTruthy();
    expect(result.uri).toEqual(ipfsUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.stack).toEqual([
      {
        sourceUri: ipfsUri.uri,
        resolver: "ApiResolver: w3://ens/ipfs.web3api.eth"
      }
    ]);

    const result2 = await client.resolveUri(ensUri);

    expect(result2.api).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory.stack).toEqual([
      {
        sourceUri: ensUri.uri,
        resolver: "ApiResolver: w3://ens/ens.web3api.eth"
      },
      {
        sourceUri: ipfsUri.uri,
        resolver: "ApiResolver: w3://ens/ipfs.web3api.eth"
      }
    ]);
  });

  it("can resolve api with redirects", async () => {
    await runCLI({ args: ["build"], cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`});

    const deployResult = await buildAndDeployApi(
      `${GetPathToTestApis()}/interface-invoke/test-api`,
      ipfsProvider,
      ensAddress
    );

    const ensUri = new Uri(`ens/testnet/${deployResult.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${deployResult.ipfsCid}`);
    const redirectUri = new Uri(`ens/redirect.eth`);

    const client = await getClient({
      redirects: [
        {
          from: ipfsUri.uri,
          to: redirectUri.uri
        }
      ]
    });

    const result = await client.resolveUri(ensUri);

    expect(result.api).toBeFalsy();
    expect(result.uri).toEqual(redirectUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.stack).toEqual([
      {
        sourceUri: ensUri.uri,
        resolver: "ApiResolver: w3://ens/ens.web3api.eth"
      },
      {
        sourceUri: ipfsUri.uri,
        resolver: "RedirectsResolver"
      }
    ]);
  });

  it("can resolve uri with custom resolver", async () => {
    const client = await getClient();

    const sourceUri = new Uri("ens/source.eth");
    const apiUri = new Uri("ens/api.eth");
    const customResolverName = "TestResolver";

    const result = await client.resolveUri(sourceUri, undefined, [
      {
        name: customResolverName,
        resolveUri: async (uri: Uri) => {
          return {
            uri: apiUri,
          };
        }
      }
    ]);

    expect(result.uri).toEqual(apiUri);
    expect(result.api).toBeFalsy();
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.stack).toEqual([
      {
        sourceUri: sourceUri.uri,
        resolver: customResolverName
      }
    ]);
  });
});
