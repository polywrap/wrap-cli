import {
  createPolywrapClient,
  Uri,
  PolywrapClientConfig,
  PolywrapClient,
  PluginModule,
} from "../..";
import {
  buildAndDeployWrapper,
  initTestEnvironment,
  runCLI,
  stopTestEnvironment,
  ensAddresses,
  providers
} from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { ResolveUriErrorType } from "@polywrap/core-js";

jest.setTimeout(200000);

describe("resolveUri", () => {
  let ipfsProvider: string;
  let ethProvider: string;

  beforeAll(async () => {
    await initTestEnvironment();
    ipfsProvider = providers.ipfs;
    ethProvider = providers.ethereum;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async (config?: Partial<PolywrapClientConfig>) => {
    return createPolywrapClient(
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
            testnet: ensAddresses.ensAddress,
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
    expect(result.wrapper).toBeFalsy();
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getUriResolvers()).toEqual([]);

    expect(result.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: uri,
        result: {
          uri: uri,
          wrapper: false,
        },
      },
    ]);
    expect(result.uriHistory.getUriResolvers()).toEqual([
      "RedirectsResolver",
      "CacheResolver",
      "PluginResolver",
      "ExtendableUriResolver",
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
    expect(result.wrapper).toBeFalsy();
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "RedirectsResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: fromUri,
        result: {
          uri: toUri2,
          wrapper: false,
        },
      },
      {
        uriResolver: "RedirectsResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: toUri2,
        result: {
          uri: toUri2,
          wrapper: false,
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
              return ({} as unknown) as PluginModule<{}>;
            },
            manifest: {
              abi: {},
              implements: [],
            },
          },
        },
      ],
    });

    const result = await client.resolveUri(pluginUri);

    expect(result.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "PluginResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: pluginUri,
        result: {
          uri: pluginUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: pluginUri,
        result: {
          uri: pluginUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: pluginUri,
        result: {
          uri: pluginUri,
          wrapper: true,
        },
      },
    ]);

    expect(result.wrapper).toBeTruthy();
    expect(result.uri).toEqual(pluginUri);
    expect(result.error).toBeFalsy();
  });

  it("can resolve wrapper", async () => {
    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-interface`,
    });
    const client = await getClient();

    const deployResult = await buildAndDeployWrapper({
      wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-wrapper`,
      ipfsProvider,
      ethereumProvider: ethProvider,
    });

    const ensUri = new Uri(`ens/testnet/${deployResult.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${deployResult.ipfsCid}`);

    const result = await client.resolveUri(ensUri);
    expect(result.wrapper).toBeTruthy();
    expect(result.uri).toEqual(ipfsUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "ExtendableUriResolver",
      "ExtendableUriResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
          implementationUri: new Uri("wrap://ens/ens-resolver.polywrap.eth"),
        },
      },
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: true,
          implementationUri: new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
        },
      },
    ]);
  });

  it("can resolve cache", async () => {
    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-interface`,
    });

    const client = await getClient();

    const deployResult = await buildAndDeployWrapper({
      wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-wrapper`,
      ipfsProvider,
      ethereumProvider: ethProvider,
    });

    const ensUri = new Uri(`ens/testnet/${deployResult.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${deployResult.ipfsCid}`);

    const result = await client.resolveUri(ipfsUri);

    expect(result.wrapper).toBeTruthy();
    expect(result.uri).toEqual(ipfsUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "ExtendableUriResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        sourceUri: ipfsUri,
        uriResolver: "CacheResolver",
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: true,
          implementationUri: new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
        },
      },
    ]);

    const result2 = await client.resolveUri(ensUri);

    expect(result2.wrapper).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "ExtendableUriResolver",
      "CacheResolver",
    ]);

    expect(result2.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        sourceUri: ensUri,
        uriResolver: "CacheResolver",
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
          implementationUri: new Uri("wrap://ens/ens-resolver.polywrap.eth"),
        },
      },
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        sourceUri: ipfsUri,
        uriResolver: "CacheResolver",
        result: {
          uri: ipfsUri,
          wrapper: true,
        },
      },
    ]);
  });

  it("can resolve cache - noCacheRead", async () => {
    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-interface`,
    });

    const client = await getClient();

    const deployResult = await buildAndDeployWrapper({
      wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-wrapper`,
      ipfsProvider,
      ethereumProvider: ethProvider,
    });

    const ensUri = new Uri(`ens/testnet/${deployResult.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${deployResult.ipfsCid}`);

    const result = await client.resolveUri(ipfsUri);

    expect(result.wrapper).toBeTruthy();
    expect(result.uri).toEqual(ipfsUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "ExtendableUriResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        sourceUri: ipfsUri,
        uriResolver: "CacheResolver",
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: true,
          implementationUri: new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
        },
      },
    ]);

    const result2 = await client.resolveUri(ensUri, { noCacheRead: true });

    expect(result2.wrapper).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "ExtendableUriResolver",
      "ExtendableUriResolver",
    ]);

    expect(result2.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
          implementationUri: new Uri("wrap://ens/ens-resolver.polywrap.eth"),
        },
      },
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: true,
          implementationUri: new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
        },
      },
    ]);
  });

  it("can resolve cache - noCacheWrite", async () => {
    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-interface`,
    });

    const client = await getClient();

    const deployResult = await buildAndDeployWrapper({
      wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-wrapper`,
      ipfsProvider,
      ethereumProvider: ethProvider,
    });

    const ensUri = new Uri(`ens/testnet/${deployResult.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${deployResult.ipfsCid}`);

    const result = await client.resolveUri(ipfsUri, { noCacheWrite: true });

    expect(result.wrapper).toBeTruthy();
    expect(result.uri).toEqual(ipfsUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "ExtendableUriResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: true,
          implementationUri: new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
        },
      },
    ]);

    const result2 = await client.resolveUri(ensUri);

    expect(result2.wrapper).toBeTruthy();
    expect(result2.uri).toEqual(ipfsUri);
    expect(result2.error).toBeFalsy();

    expect(result2.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "ExtendableUriResolver",
      "ExtendableUriResolver",
    ]);

    expect(result2.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
          implementationUri: new Uri("wrap://ens/ens-resolver.polywrap.eth"),
        },
      },
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ipfsUri,
        result: {
          uri: ipfsUri,
          wrapper: true,
          implementationUri: new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
        },
      },
    ]);
  });

  it("can resolve wrapper with redirects", async () => {
    await runCLI({
      args: ["build"],
      cwd: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-interface`,
    });

    const deployResult = await buildAndDeployWrapper({
      wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/interface-invoke/test-wrapper`,
      ipfsProvider,
      ethereumProvider: ethProvider,
    });

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

    expect(result.wrapper).toBeFalsy();
    expect(result.uri).toEqual(redirectUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "ExtendableUriResolver",
      "RedirectsResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: ensUri,
        result: {
          uri: ensUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: ensUri,
        result: {
          uri: ipfsUri,
          wrapper: false,
          implementationUri: new Uri("wrap://ens/ens-resolver.polywrap.eth"),
        },
      },
      {
        uriResolver: "RedirectsResolver",
        sourceUri: ipfsUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "RedirectsResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
    ]);
  });

  it("can resolve uri with custom resolver", async () => {
    const ensUri = new Uri(`ens/test`);
    const redirectUri = new Uri(`ens/redirect.eth`);

    const client = await new PolywrapClient({
      uriResolvers: [
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

    expect(result.wrapper).toBeFalsy();
    expect(result.uri).toEqual(redirectUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "CustomResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        uriResolver: "CustomResolver",
        sourceUri: ensUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CustomResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "RedirectsResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CacheResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "PluginResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "ExtendableUriResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
    ]);
  });

  it("can resolve uri with custom resolver at query-time", async () => {
    const ensUri = new Uri(`ens/test`);
    const redirectUri = new Uri(`ens/redirect.eth`);

    const client = await new PolywrapClient();

    const result = await client.resolveUri(ensUri, {
      config: {
        uriResolvers: [
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

    expect(result.wrapper).toBeFalsy();
    expect(result.uri).toEqual(redirectUri);
    expect(result.error).toBeFalsy();

    expect(result.uriHistory.getResolutionPath().getUriResolvers()).toEqual([
      "CustomResolver",
    ]);

    expect(result.uriHistory.stack).toEqual([
      {
        uriResolver: "CustomResolver",
        sourceUri: ensUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
      {
        uriResolver: "CustomResolver",
        sourceUri: redirectUri,
        result: {
          uri: redirectUri,
          wrapper: false,
        },
      },
    ]);
  });

  it("custom wrapper resolver does not cause infinite recursion when resolved at runtime", async () => {
    const client = await new PolywrapClient({
      interfaces: [
        {
          interface: "ens/uri-resolver.core.polywrap.eth",
          implementations: ["ens/test-resolver.eth"],
        },
      ],
    });

    const { error } = await client.resolveUri("ens/test.eth");

    expect(error).toBeTruthy();
    if (!error) {
      throw Error();
    }

    expect(error.type).toEqual(ResolveUriErrorType.InternalResolver);
    expect(error.error?.message).toEqual(
      "Could not load the following URI Resolver implementations: wrap://ens/test-resolver.eth"
    );
  });

  it("unresolvable custom wrapper resolver is found when preloaded", async () => {
    const client = await new PolywrapClient({
      interfaces: [
        {
          interface: "ens/uri-resolver.core.polywrap.eth",
          implementations: ["ens/test-resolver.eth"],
        },
      ],
    });

    const { success, failedUriResolvers } = await client.loadUriResolvers();
    expect(success).toBeFalsy();
    expect(failedUriResolvers).toEqual(["wrap://ens/test-resolver.eth"]);

    const { error } = await client.resolveUri("ens/test.eth");
    expect(error).toBeTruthy();

    if (!error) {
      throw Error();
    }

    expect(error.type).toEqual(ResolveUriErrorType.InternalResolver);
    expect(error.error?.message).toEqual(
      "Could not load the following URI Resolver implementations: wrap://ens/test-resolver.eth"
    );
  });

  it("can preload wrapper resolvers", async () => {
    const client = await new PolywrapClient();

    const { success, failedUriResolvers } = await client.loadUriResolvers();

    expect(success).toBeTruthy();
    expect(failedUriResolvers.length).toEqual(0);

    const { error, uri, wrapper } = await client.resolveUri("ens/test.eth");

    expect(error).toBeFalsy();
    expect(wrapper).toBeFalsy();
    expect(uri?.uri).toEqual("wrap://ens/test.eth");
  });
});
