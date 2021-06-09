import {
  Api,
  ApiResolver,
  Client,
  InvokeApiOptions,
  InvokeApiResult,
  Manifest,
  Plugin,
  PluginModules,
  PluginPackage,
  QueryApiOptions,
  QueryApiResult,
  Uri,
  UriRedirect,
  resolveUri,
} from "../";
import { InterfaceImplementations } from "../types";

describe("resolveUri", () => {
  const client = (
    redirects: UriRedirect<Uri>[],
    implementations: InterfaceImplementations<Uri>[],
    apis: Record<string, PluginModules>,
  ): Client => ({
    redirects: () => redirects,
    implementations: () => implementations,
    query: <
      TData extends Record<string, unknown> = Record<string, unknown>,
      TVariables extends Record<string, unknown> = Record<string, unknown>,
    >(_options: QueryApiOptions<TVariables, string>): Promise<QueryApiResult<TData>> => {
      return Promise.resolve({
        data: ({
          foo: "foo",
        } as Record<string, unknown>) as TData
      });
    },
    invoke: <TData = unknown>(
      options: InvokeApiOptions<string>
    ): Promise<InvokeApiResult<TData>> => {
      return Promise.resolve({
        data: apis[options.uri]?.[options.module]?.[options.method](
          options.input as Record<string, unknown>,
          {} as Client
        ) as TData,
      });
    },
  });

  const createPluginApi = (uri: Uri, plugin: PluginPackage): Api => {
    return {
      invoke: () =>
        Promise.resolve({
          uri,
          plugin,
        } as InvokeApiResult),
        getSchema: (_client: Client): Promise<string> =>
          Promise.resolve("")
    };
  };

  const createApi = (uri: Uri, manifest: Manifest, apiResolver: Uri): Api => {
    return {
      invoke: () =>
        Promise.resolve({
          uri,
          manifest,
          apiResolver,
        } as InvokeApiResult),
      getSchema: (_client: Client): Promise<string> =>
        Promise.resolve("")
    };
  };

  const ensApi: PluginModules = {
    query: {
      tryResolveUri: (
        input: { authority: string; path: string },
        _client: Client
      ) => {
        return {
          uri: input.authority === "ens" ? "ipfs/QmHash" : undefined,
        };
      },
    },
  };

  const ipfsApi: PluginModules = {
    query: {
      tryResolveUri: (
        input: { authority: string; path: string },
        _client: Client
      ) => {
        return {
          manifest:
            input.authority === "ipfs" ? "format: 0.0.1-prealpha.1\ndog: cat" : undefined,
        };
      },
    },
  };

  const pluginApi: PluginModules = {
    query: {
      tryResolveUri: (
        input: { authority: string; path: string },
        _client: Client
      ) => {
        return {
          manifest:
            input.authority === "my" ? "format: 0.0.1-prealpha.1" : undefined,
        };
      },
    },
  };

  const redirects: UriRedirect<Uri>[] = [
    {
      from: new Uri("ens/my-plugin"),
      to: {
        factory: () => ({} as Plugin),
        manifest: {
          schema: "",
          implemented: [new Uri("w3/api-resolver")],
          imported: [],
        },
      },
    },
  ]
  
  const implementations: InterfaceImplementations<Uri>[] = [
    {
      interface: new Uri("w3/api-resolver"),
      implementations: [
        new Uri("ens/ens"),
        new Uri("ens/ipfs")
      ]
    },
  ];

  const apis: Record<string, PluginModules> = {
    "w3://ens/ens": ensApi,
    "w3://ens/ipfs": ipfsApi,
    "w3://ens/my-plugin": pluginApi,
  };

  it("sanity", () => {
    const api = new Uri("w3://ens/ens");
    const file = new Uri("w3/some-file");
    const path = "w3/some-path";
    const query = ApiResolver.Query;
    const uri = new Uri("w3/some-uri");

    expect(query.tryResolveUri(client(redirects, implementations, apis), api, uri)).toBeDefined();
    expect(query.getFile(client(redirects, implementations, apis), file, path)).toBeDefined();
  });

  it("works in the typical case", async () => {
    const result = await resolveUri(
      new Uri("ens/test.eth"),
      client(redirects, implementations, apis),
      createPluginApi,
      createApi,
      true
    );

    const apiIdentity = await result.invoke(
      {} as InvokeApiOptions,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("ipfs/QmHash"),
      manifest: {
        format: "0.0.1-prealpha.1"
      },
      apiResolver: new Uri("ens/ipfs"),
    });
  });

  it("uses a plugin that implements api-resolver", async () => {
    const result = await resolveUri(
      new Uri("my/something-different"),
      client(redirects, implementations, apis),
      createPluginApi,
      createApi,
      true
    );

    const apiIdentity = await result.invoke(
      {} as InvokeApiOptions,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("my/something-different"),
      manifest: {
        format: "0.0.1-prealpha.1"
      },
      apiResolver: new Uri("ens/my-plugin"),
    });
  });

  it("works when direct query a Web3API that implements the api-resolver", async () => {
    const result = await resolveUri(
      new Uri("ens/ens"),
      client(redirects, implementations, apis),
      createPluginApi,
      createApi,
      true
    );

    const apiIdentity = await result.invoke(
      {} as InvokeApiOptions,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("ipfs/QmHash"),
      manifest: {
        format: "0.0.1-prealpha.1",
        dog: "cat"
      },
      apiResolver: new Uri("ens/ipfs"),
    });
  });

  it("works when direct query a plugin Web3API that implements the api-resolver", async () => {
    const result = await resolveUri(
      new Uri("my/something-different"),
      client(redirects, implementations, apis),
      createPluginApi,
      createApi,
      true
    );

    const apiIdentity = await result.invoke(
      {} as InvokeApiOptions,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("my/something-different"),
      manifest: {
        format: "0.0.1-prealpha.1"
      },
      apiResolver: new Uri("ens/my-plugin"),
    });
  });

  it("throws when circular redirect loops are found", async () => {
    const circular: UriRedirect<Uri>[] = [
      ...redirects,
      {
        from: new Uri("some/api"),
        to: new Uri("ens/api"),
      },
      {
        from: new Uri("ens/api"),
        to: new Uri("some/api"),
      },
    ];

    expect.assertions(1);

    return resolveUri(
      new Uri("some/api"),
      client(circular, implementations, apis),
      createPluginApi,
      createApi,
      true
    ).catch((e) =>
      expect(e.message).toMatch(/Infinite loop while resolving URI/)
    );
  });

  it("throws when redirect missing the from property", async () => {
    const missingFromProperty: UriRedirect<Uri>[] = [
      ...redirects,
      {
        from: new Uri("some/api"),
        to: new Uri("ens/api"),
      },
      {
        from: null as any,
        to: new Uri("another/api"),
      },
    ];

    expect.assertions(1);

    return resolveUri(
      new Uri("some/api"),
      client(missingFromProperty, implementations, apis),
      createPluginApi,
      createApi,
      true
    ).catch((e) =>
      expect(e.message).toMatch("Redirect missing the from property.\nEncountered while resolving w3://some/api")
    );
  });

  it("works when a Web3API redirects to a Plugin", async () => {
    const uriToPlugin: UriRedirect<Uri>[] = [
      ...redirects,
      {
        from: new Uri("some/api"),
        to: {
          factory: () => ({} as Plugin),
          manifest: {
            schema: "",
            implemented: [new Uri("w3/api-resolver")],
            imported: [],
          },
        },
      },
    ];

    const result = await resolveUri(
      new Uri("some/api"),
      client(uriToPlugin, implementations, apis),
      createPluginApi,
      createApi,
      true
    );

    const apiIdentity = await result.invoke(
      {} as InvokeApiOptions,
      {} as Client
    );

    expect(apiIdentity.error).toBeUndefined();
  });

  it("throw when URI does not resolve to an API", async () => {

    const faultyIpfsApi: PluginModules = {
      query: {
        tryResolveUri: (
          input: { authority: string; path: string },
          _client: Client
        ) => {
          return {
            manifest: null
          };
        },
      },
    };

    const uri = new Uri("some/api");

    expect.assertions(1);

    await resolveUri(
      uri,
      client(redirects, implementations, {
        ...apis,
        "w3://ens/ipfs": faultyIpfsApi
      }),
      createPluginApi,
      createApi,
      true
    ).catch((e) =>
      expect(e.message).toMatch(`No Web3API found at URI: ${uri.uri}`)
    );
  });
});

// TODO:
// plugin that has a URI which is being redirected
// plugin which has from = uri-resolver, then have another redirect uri-resolver to something else (could easily break...)
// nested web3api that's a URI resolver available through another URI authority ([ens => crypto], [crypto => new])
