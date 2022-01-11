import { Client, Contextualized, createWeb3ApiClient, Uri, Web3ApiClientConfig } from "..";
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
    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          api: false
        }
      },
      {
        resolver: "PluginResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          api: false
        }
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          api: false,
        }
      },
    ]);
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
        resolver: "RedirectsResolver",
        sourceUri: fromUri,
        result: {
          uri: toUri2,
          api: false
        }
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          api: false
        }
      },
      {
        resolver: "PluginResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          api: false
        }
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          api: false,
        }
      },
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
    console.log(JSON.stringify(result.uriHistory, null, 2));

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: pluginUri,
        result: {
          uri: pluginUri,
          api: false
        }
      },
      {
        resolver: "PluginResolver",
        sourceUri: pluginUri,
        result: {
          uri: pluginUri,
          api: true
        }
      }
    ]);

    expect(result.api).toBeTruthy();
    expect(result.uri).toEqual(pluginUri);
    expect(result.error).toBeFalsy();
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

    console.log(result.uriHistory);
    expect(result.api).toBeTruthy();
    expect(result.uri).toEqual(ipfsUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false
        }
      },
      {
        resolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false
        }
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          api: false,
          resolverUri: new Uri("w3://ens/ens.web3api.eth"),
        }
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false
        }
      },
      {
        resolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false
        }
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: true,
          resolverUri: new Uri("w3://ens/ipfs.web3api.eth"),
        }
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

    expect(result.uriHistory.getResolutionPath().getResolvers())
      .toEqual([
        "ApiAggregatorResolver",
      ]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false
        }
      },
      {
        resolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false
        }
      },
      {
        sourceUri: ipfsUri,
        resolver: "CacheResolver",
        result: {
          uri: ipfsUri,
          api: false,
        }
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: true,
          resolverUri: new Uri("w3://ens/ipfs.web3api.eth"),
        }
      }
    ]);

    const result2 = await client.resolveUri(ensUri);

    expect(result2.api).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory.getResolutionPath().getResolvers())
      .toEqual([
        "ApiAggregatorResolver",
        "CacheResolver"
      ]);

    expect(result2.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false
        }
      },
      {
        resolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false
        }
      },
      {
        sourceUri: ensUri,
        resolver: "CacheResolver",
        result: {
          uri: ensUri,
          api: false,
        }
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          api: false,
          resolverUri: new Uri("w3://ens/ens.web3api.eth"),
        }
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false
        }
      },
      {
        resolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false
        }
      },
      {
        sourceUri: ipfsUri,
        resolver: "CacheResolver",
        result: {
          uri: ipfsUri,
          api: true,
        }
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

    expect(result.uriHistory).toEqual([
      {
        sourceUri: ipfsUri,
        resolver: "ApiResolver: w3://ens/ipfs.web3api.eth"
      }
    ]);

    const result2 = await client.resolveUri(ensUri, { noCacheRead: true });

    expect(result2.api).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory).toEqual([
      {
        sourceUri: ensUri,
        resolver: "ApiResolver: w3://ens/ens.web3api.eth"
      },
      {
        sourceUri: ipfsUri,
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

    expect(result.uriHistory).toEqual([
      {
        sourceUri: ipfsUri,
        resolver: "ApiResolver: w3://ens/ipfs.web3api.eth"
      }
    ]);

    const result2 = await client.resolveUri(ensUri);

    expect(result2.api).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory).toEqual([
      {
        sourceUri: ensUri,
        resolver: "ApiResolver: w3://ens/ens.web3api.eth"
      },
      {
        sourceUri: ipfsUri,
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

    expect(result.uriHistory).toEqual([
      {
        sourceUri: ensUri,
        resolver: "ApiResolver: w3://ens/ens.web3api.eth"
      },
      {
        sourceUri: ipfsUri,
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
        resolveUri: async (uri: Uri, client: Client, options: Contextualized) => {
          return {
            uri: apiUri,
          };
        }
      }
    ]);

    expect(result.uri).toEqual(apiUri);
    expect(result.api).toBeFalsy();
    expect(result.error).toBeFalsy();

    expect(result.uriHistory).toEqual([
      {
        sourceUri: sourceUri.uri,
        resolver: customResolverName
      }
    ]);
  });
});
