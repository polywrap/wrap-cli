import {
  Api,
  Client,
  InvokeApiOptions,
  InvokeApiResult,
  Manifest,
  SchemaDocument,
  Plugin,
  PluginModules,
  PluginPackage,
  QueryApiOptions,
  QueryApiResult,
  resolveUri,
  Uri,
  UriRedirect,
} from "../";

describe("resolveUri", () => {
  const client = (
    redirects: UriRedirect[],
    apis: Record<string, PluginModules>
  ): Client => ({
    redirects: () => redirects,
    query: (_options: QueryApiOptions): Promise<QueryApiResult> => {
      return Promise.resolve({
        data: {
          foo: "foo",
        },
      });
    },
    invoke: (options: InvokeApiOptions): Promise<InvokeApiResult> => {
      return Promise.resolve({
        data: apis[options.uri.uri][options.module][options.method](
          options.input,
          {} as Client
        ),
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
            input.authority === "ipfs" ? `{ "version": "hey" }` : undefined,
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
            input.authority === "my" ? `{ "version": "foo" }` : undefined,
        };
      },
    },
  };

  const redirects: UriRedirect[] = [
    {
      from: new Uri("w3/api-resolver"),
      to: new Uri("ens/ens"),
    },
    {
      from: new Uri("w3/api-resolver"),
      to: new Uri("ens/ipfs"),
    },
    {
      from: new Uri("ens/my-plugin"),
      to: {
        factory: () => ({} as Plugin),
        manifest: {
          schema: {} as SchemaDocument,
          implemented: [new Uri("w3/api-resolver")],
          imported: [],
        },
      },
    },
  ];

  const apis: Record<string, PluginModules> = {
    "w3://ens/ens": ensApi,
    "w3://ens/ipfs": ipfsApi,
    "w3://ens/my-plugin": pluginApi,
  };

  it("works in the typical case", async () => {
    const result = await resolveUri(
      new Uri("ens/test.eth"),
      client(redirects, apis),
      createPluginApi,
      createApi
    );

    const apiIdentity = await result.invoke({} as InvokeApiOptions, {} as Client);

    expect(apiIdentity).toMatchObject({
      uri: new Uri("ens/test.eth"),
      manifest: {
        version: "hey",
      },
      apiResolver: new Uri("ens/ipfs"),
    });
  });

  it("uses a plugin that implements api-resolver", async () => {
    const result = await resolveUri(
      new Uri("my/something-different"),
      client(redirects, apis),
      createPluginApi,
      createApi
    );

    const apiIdentity = await result.invoke({} as InvokeApiOptions, {} as Client);

    expect(apiIdentity).toMatchObject({
      uri: new Uri("my/something-different"),
      manifest: {
        version: "foo",
      },
      apiResolver: new Uri("ens/my-plugin"),
    });
  });

  it("works when direct query a Web3API that implements the api-resolver", async () => {
    const result = await resolveUri(
      new Uri("ens/ens"),
      client(redirects, apis),
      createPluginApi,
      createApi
    );

    const apiIdentity = await result.invoke({} as InvokeApiOptions, {} as Client);

    expect(apiIdentity).toMatchObject({
      uri: new Uri("ens/ens"),
      manifest: {
        version: "hey",
      },
      apiResolver: new Uri("ens/ipfs"),
    });
  });

  it("works when direct query a plugin Web3API that implements the api-resolver", async () => {
    const result = await resolveUri(
      new Uri("my/something-different"),
      client(redirects, apis),
      createPluginApi,
      createApi
    );

    const apiIdentity = await result.invoke({} as InvokeApiOptions, {} as Client);

    expect(apiIdentity).toMatchObject({
      uri: new Uri("my/something-different"),
      manifest: {
        version: "foo",
      },
      apiResolver: new Uri("ens/my-plugin"),
    });
  });

  it("throws when circular redirect loops are found", async () => {
    const circular: UriRedirect[] = [
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
      client(circular, apis),
      createPluginApi,
      createApi
    ).catch((e) =>
      expect(e.message).toMatch(/Infinite loop while resolving URI/)
    );
  });
});

// TODO:
// plugin that has a URI which is being redirected
// plugin which has from = uri-resolver, then have another redirect uri-resolver to something else (could easily break...)
// nested web3api that's a URI resolver available through another URI authority ([ens => crypto], [crypto => new])
