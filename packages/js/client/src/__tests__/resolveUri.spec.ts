import {
  Client,
  Plugin,
  createWeb3ApiClient,
  Uri,
  Web3ApiClientConfig,
  Web3ApiClient,
} from "..";
import {
  buildAndDeployApi,
  initTestEnvironment,
  runCLI,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";
import { ResolveUriError } from "@web3api/core-js";

jest.setTimeout(200000);

describe("Web3ApiClient - resolveUri", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  const startTestEnvironment = async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
  };

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
    expect(result.api).toBeFalsy();
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getResolvers()).toEqual([]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          api: false,
        },
      },
      {
        resolver: "CacheResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          api: false,
        },
      },
    ]);
    expect(result.uriHistory.getResolvers()).toEqual([
      "RedirectsResolver",
      "PluginResolver",
      "CacheResolver",
      "ApiAggregatorResolver",
    ]);
    expect(result.uriHistory.getUris()).toMatchObject([new Uri("ens/uri.eth")]);
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
        },
      ],
    });

    const result = await client.resolveUri(fromUri);

    expect(result.uri).toEqual(toUri2);
    expect(result.api).toBeFalsy();
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "RedirectsResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: fromUri,
        result: {
          uri: toUri2,
          api: false,
        },
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          api: false,
        },
      },
      {
        resolver: "CacheResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          api: false,
        },
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
              return ({
                getModules: (client: Client) => {
                  return {};
                },
              } as unknown) as Plugin;
            },
            manifest: {
              schema: "",
              implements: [],
            },
          },
        },
      ],
    });

    const result = await client.resolveUri(pluginUri);

    expect(result.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "PluginResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: pluginUri,
        result: {
          uri: pluginUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: pluginUri,
        result: {
          uri: pluginUri,
          api: true,
        },
      },
    ]);

    expect(result.api).toBeTruthy();
    expect(result.uri).toEqual(pluginUri);
    expect(result.error).toBeFalsy();
  });

  it("can resolve api", async () => {
    await startTestEnvironment();

    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`,
    });

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

    expect(result.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "ApiAggregatorResolver",
      "ApiAggregatorResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "CacheResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          api: false,
          resolverUri: new Uri("w3://ens/ens.web3api.eth"),
        },
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "CacheResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: true,
          resolverUri: new Uri("w3://ens/ipfs.web3api.eth"),
        },
      },
    ]);

    await stopTestEnvironment();
  });

  it("can resolve cache", async () => {
    await startTestEnvironment();

    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`,
    });

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

    expect(result.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "ApiAggregatorResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        sourceUri: ipfsUri,
        resolver: "CacheResolver",
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: true,
          resolverUri: new Uri("w3://ens/ipfs.web3api.eth"),
        },
      },
    ]);

    const result2 = await client.resolveUri(ensUri);

    expect(result2.api).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "ApiAggregatorResolver",
      "CacheResolver",
    ]);

    expect(result2.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        sourceUri: ensUri,
        resolver: "CacheResolver",
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          api: false,
          resolverUri: new Uri("w3://ens/ens.web3api.eth"),
        },
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        sourceUri: ipfsUri,
        resolver: "CacheResolver",
        result: {
          uri: ipfsUri,
          api: true,
        },
      },
    ]);

    await stopTestEnvironment();
  });

  it("can resolve cache - noCacheRead", async () => {
    await startTestEnvironment();

    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`,
    });

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

    expect(result.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "ApiAggregatorResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        sourceUri: ipfsUri,
        resolver: "CacheResolver",
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: true,
          resolverUri: new Uri("w3://ens/ipfs.web3api.eth"),
        },
      },
    ]);

    const result2 = await client.resolveUri(ensUri, { noCacheRead: true });

    expect(result2.api).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "ApiAggregatorResolver",
      "ApiAggregatorResolver",
    ]);

    expect(result2.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          api: false,
          resolverUri: new Uri("w3://ens/ens.web3api.eth"),
        },
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: true,
          resolverUri: new Uri("w3://ens/ipfs.web3api.eth"),
        },
      },
    ]);

    await stopTestEnvironment();
  });

  it("can resolve cache - noCacheWrite", async () => {
    await startTestEnvironment();

    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`,
    });

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

    expect(result.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "ApiAggregatorResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "CacheResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: true,
          resolverUri: new Uri("w3://ens/ipfs.web3api.eth"),
        },
      },
    ]);

    const result2 = await client.resolveUri(ensUri);

    expect(result2.api).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "ApiAggregatorResolver",
      "ApiAggregatorResolver",
    ]);

    expect(result2.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "CacheResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          api: false,
          resolverUri: new Uri("w3://ens/ens.web3api.eth"),
        },
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "CacheResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          api: true,
          resolverUri: new Uri("w3://ens/ipfs.web3api.eth"),
        },
      },
    ]);

    await stopTestEnvironment();
  });

  it("can resolve api with redirects", async () => {
    await startTestEnvironment();

    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestApis()}/interface-invoke/test-interface`,
    });

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
          to: redirectUri.uri,
        },
      ],
    });

    const result = await client.resolveUri(ensUri);

    expect(result.api).toBeFalsy();
    expect(result.uri).toEqual(redirectUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "ApiAggregatorResolver",
      "RedirectsResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "CacheResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          api: false,
          resolverUri: new Uri("w3://ens/ens.web3api.eth"),
        },
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
      {
        resolver: "CacheResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
    ]);

    await stopTestEnvironment();
  });

  it("can resolve uri with custom resolver", async () => {
    const ensUri = new Uri(`ens/test`);
    const redirectUri = new Uri(`ens/redirect.eth`);

    const client = await new Web3ApiClient({
      resolvers: [
        {
          name: "CustomResolver",
          resolveUri: async (uri: Uri) => {
            if (uri.uri === ensUri.uri) {
              return {
                uri: redirectUri,
              };
            }

            return {
              uri: uri,
            };
          },
        },
      ],
    });

    const result = await client.resolveUri(ensUri);

    expect(result.api).toBeFalsy();
    expect(result.uri).toEqual(redirectUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "CustomResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "CustomResolver",
        sourceUri: ensUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
      {
        resolver: "CustomResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
      {
        resolver: "RedirectsResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
      {
        resolver: "PluginResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
      {
        resolver: "CacheResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
      {
        resolver: "ApiAggregatorResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
    ]);
  });

  it("can resolve uri with custom resolver at query-time", async () => {
    const ensUri = new Uri(`ens/test`);
    const redirectUri = new Uri(`ens/redirect.eth`);

    const client = await new Web3ApiClient();

    const result = await client.resolveUri(ensUri, {
      config: {
        resolvers: [
          {
            name: "CustomResolver",
            resolveUri: async (uri: Uri) => {
              if (uri.uri === ensUri.uri) {
                return {
                  uri: redirectUri,
                };
              }

              return {
                uri: uri,
              };
            },
          },
        ],
      },
    });

    expect(result.api).toBeFalsy();
    expect(result.uri).toEqual(redirectUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getResolvers()).toEqual([
      "CustomResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        resolver: "CustomResolver",
        sourceUri: ensUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
      {
        resolver: "CustomResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          api: false,
        },
      },
    ]);
  });

  it("custom wrapper resolver does not cause infinite recursion when resolved at runtime", async () => {
    const client = await new Web3ApiClient({
      interfaces: [
        {
          interface: "ens/uri-resolver.core.web3api.eth",
          implementations: ["ens/test-resolver.eth"],
        },
      ],
    });

    const { error } = await client.resolveUri("ens/test.eth");

    expect(error).toBeTruthy();
    if (!error) {
      throw Error();
    }

    expect(error.type).toEqual(ResolveUriError.CustomResolverError);
    expect(error.message).toEqual(
      "Could not load the following API resolvers: w3://ens/test-resolver.eth"
    );
  });

  it("unresolvable custom wrapper resolver is found when preloaded", async () => {
    const client = await new Web3ApiClient({
      interfaces: [
        {
          interface: "ens/uri-resolver.core.web3api.eth",
          implementations: ["ens/test-resolver.eth"],
        },
      ],
    });

    const { success, failedResolverUris } = await client.tryLoadApiResolvers();
    expect(success).toBeFalsy();
    expect(failedResolverUris).toEqual(["w3://ens/test-resolver.eth"]);

    const { error } = await client.resolveUri("ens/test.eth");
    expect(error).toBeTruthy();

    if (!error) {
      throw Error();
    }

    expect(error.type).toEqual(ResolveUriError.CustomResolverError);
    expect(error.message).toEqual(
      "Could not load the following API resolvers: w3://ens/test-resolver.eth"
    );
  });

  it("can preload API resolvers", async () => {
    const client = await new Web3ApiClient();

    const { success, failedResolverUris } = await client.tryLoadApiResolvers();

    console.log(failedResolverUris);
    expect(success).toBeTruthy();
    expect(failedResolverUris.length).toEqual(0);

    const { error, uri, api } = await client.resolveUri("ens/test.eth");

    expect(error).toBeFalsy();
    expect(api).toBeFalsy();
    expect(uri?.uri).toEqual("w3://ens/test.eth");
  });
});
