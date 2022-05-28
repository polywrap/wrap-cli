import {
  UriResolverInterface,
  coreInterfaceUris,
  Client,
  InvokeApiOptions,
  InvokeApiResult,
  Web3ApiManifest,
  Plugin,
  PluginModules,
  PluginPackage,
  QueryApiOptions,
  QueryApiResult,
  Uri,
  UriRedirect,
  AnyManifestArtifact,
  ManifestArtifactType,
  UriResolver,
  resolveUri,
  RedirectsResolver,
  ExtendableUriResolver,
  PluginResolver,
  Api,
  Env,
  GetFileOptions,
  GetImplementationsOptions,
  GetManifestOptions,
  InterfaceImplementations,
  PluginRegistration,
  SubscribeOptions,
  Subscription,
} from "..";

describe("resolveUri", () => {
  const client = (
    apis: Record<string, PluginModules>,
    plugins: PluginRegistration<Uri>[] = [],
    interfaces: InterfaceImplementations<Uri>[] = [],
    redirects: UriRedirect<Uri>[] = []
  ): Client =>
    (({
      getEnvByUri: () => undefined,
      getRedirects: () => redirects,
      getPlugins: () => plugins,
      getInterfaces: () => interfaces,
      query: <
        TData extends Record<string, unknown> = Record<string, unknown>,
        TVariables extends Record<string, unknown> = Record<string, unknown>
      >(
        _options: QueryApiOptions<TVariables, string | Uri>
      ): Promise<QueryApiResult<TData>> => {
        return Promise.resolve({
          data: ({
            foo: "foo",
          } as Record<string, unknown>) as TData,
        });
      },
      invoke: <TData = unknown>(
        options: InvokeApiOptions<string | Uri>
      ): Promise<InvokeApiResult<TData>> => {
        let uri = options.uri;
        if (Uri.isUri(uri)) {
          uri = uri.uri;
        }
        return Promise.resolve({
          data: apis[uri]?.[options.module]?.[options.method](
            options.input as Record<string, unknown>,
            {} as Client
          ) as TData,
        });
      },
      subscribe: <
        TData extends Record<string, unknown> = Record<string, unknown>
      >(
        _options: SubscribeOptions<Record<string, unknown>, string | Uri>
      ): Subscription<TData> => {
        return {
          frequency: 0,
          isActive: false,
          stop: () => {},
          async *[Symbol.asyncIterator](): AsyncGenerator<
            QueryApiResult<TData>
          > {},
        };
      },
      getSchema: (uri: Uri | string): Promise<string> => {
        return Promise.resolve("");
      },
      getManifest: <
        TUri extends Uri | string,
        TManifestType extends ManifestArtifactType
      >(
        uri: TUri,
        options: GetManifestOptions<TManifestType>
      ) => {
        const manifest = {
          format: "0.0.1-prealpha.9",
          language: "",
          modules: {},
          __type: "Web3ApiManifest",
        };
        return Promise.resolve(manifest as AnyManifestArtifact<TManifestType>);
      },
      getFile: () => {
        return Promise.resolve("");
      },
      getImplementations: <TUri extends Uri | string>(
        uri: TUri,
        options: GetImplementationsOptions
      ) => {
        return [uri];
      },
    } as unknown) as Client);

  const createPluginApi = (uri: Uri, plugin: PluginPackage): Api => {
    return {
      invoke: () =>
        Promise.resolve({
          uri,
          plugin,
        } as InvokeApiResult),
      getSchema: (_client: Client): Promise<string> => Promise.resolve(""),
      getFile: (options: GetFileOptions, client: Client) => Promise.resolve(""),
      getManifest: <TManifestType extends ManifestArtifactType>(
        options: GetManifestOptions<TManifestType>,
        client: Client
      ) => {
        const manifest = {
          format: "0.0.1-prealpha.9",
          language: "",
          modules: {},
          __type: "Web3ApiManifest",
        };
        return Promise.resolve(manifest as AnyManifestArtifact<TManifestType>);
      },
    };
  };

  const createApi = (
    uri: Uri,
    manifest: Web3ApiManifest,
    uriResolver: string
  ): Api => {
    return {
      invoke: () =>
        Promise.resolve({
          uri,
          manifest,
          uriResolver,
        } as InvokeApiResult),
      getSchema: (_client: Client): Promise<string> => Promise.resolve(""),
      getFile: (options: GetFileOptions, client: Client) => Promise.resolve(""),
      getManifest: <TManifestType extends ManifestArtifactType>(
        options: GetManifestOptions<TManifestType>,
        client: Client
      ) => {
        const manifest = {
          format: "0.0.1-prealpha.9",
          language: "",
          modules: {},
          __type: "Web3ApiManifest",
        };
        return Promise.resolve(manifest as AnyManifestArtifact<TManifestType>);
      },
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
            input.authority === "ipfs"
              ? "format: 0.0.1-prealpha.5\ndog: cat"
              : undefined,
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
            input.authority === "my" ? "format: 0.0.1-prealpha.5" : undefined,
        };
      },
    },
  };

  const plugins: PluginRegistration<Uri>[] = [
    {
      uri: new Uri("ens/my-plugin"),
      plugin: {
        factory: () => ({} as Plugin),
        manifest: {
          schema: "",
          implements: [coreInterfaceUris.uriResolver],
        },
      },
    },
  ];

  const interfaces: InterfaceImplementations<Uri>[] = [
    {
      interface: coreInterfaceUris.uriResolver,
      implementations: [
        new Uri("ens/ens"),
        new Uri("ens/ipfs"),
        new Uri("ens/my-plugin"),
      ],
    },
  ];

  const apis: Record<string, PluginModules> = {
    "w3://ens/ens": ensApi,
    "w3://ens/ipfs": ipfsApi,
    "w3://ens/my-plugin": pluginApi,
  };

  const uriResolvers: UriResolver[] = [
    new RedirectsResolver(),
    new PluginResolver((uri: Uri, plugin: PluginPackage) =>
      createPluginApi(uri, plugin)
    ),
    new ExtendableUriResolver(
      (
        uri: Uri,
        manifest: Web3ApiManifest,
        uriResolver: string,
        environment: Env<Uri> | undefined
      ) => {
        return createApi(uri, manifest, uriResolver);
      },
      { noValidate: true },
      true
    ),
  ];

  it("sanity", () => {
    const api = new Uri("w3://ens/ens");
    const file = new Uri("w3/some-file");
    const path = "w3/some-path";
    const query = UriResolverInterface.Query;
    const uri = new Uri("w3/some-uri");

    expect(query.tryResolveUri(client(apis).invoke, api, uri)).toBeDefined();
    expect(query.getFile(client(apis).invoke, file, path)).toBeDefined();
  });

  it("works in the typical case", async () => {
    const result = await resolveUri(
      new Uri("ens/test.eth"),
      uriResolvers,
      client(apis, plugins, interfaces),
      new Map<string, Api>(),
    );

    expect(result.api).toBeTruthy();
    
    const apiIdentity = await result.api!.invoke(
      {} as InvokeApiOptions<Uri>,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("ipfs/QmHash"),
      manifest: {
        format: "0.0.1-prealpha.9",
      },
      uriResolver: "w3://ens/ipfs",
    });
  });

  it("uses a plugin that implements uri-resolver", async () => {
    const result = await resolveUri(
      new Uri("my/something-different"),
      uriResolvers,
      client(apis, plugins, interfaces),
      new Map<string, Api>(),
    );

    expect(result.api).toBeTruthy();
    
    const apiIdentity = await result.api!.invoke(
      {} as InvokeApiOptions<Uri>,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("my/something-different"),
      manifest: {
        format: "0.0.1-prealpha.9",
      },
      uriResolver: "w3://ens/my-plugin",
    });
  });

  it("works when direct query a Web3API that implements the uri-resolver", async () => {
    const result = await resolveUri(
      new Uri("ens/ens"),
      uriResolvers,
      client(apis, plugins, interfaces),
      new Map<string, Api>(),
    );

    expect(result.api).toBeTruthy();
    
    const apiIdentity = await result.api!.invoke(
      {} as InvokeApiOptions<Uri>,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("ipfs/QmHash"),
      manifest: {
        format: "0.0.1-prealpha.9",
        dog: "cat",
      },
      uriResolver: "w3://ens/ipfs",
    });
  });

  it("works when direct query a plugin Web3API that implements the uri-resolver", async () => {
    const result = await resolveUri(
      new Uri("my/something-different"),
      uriResolvers,
      client(apis, plugins, interfaces),
      new Map<string, Api>(),
    );

    expect(result.api).toBeTruthy();
    
    const apiIdentity = await result.api!.invoke(
      {} as InvokeApiOptions<Uri>,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("my/something-different"),
      manifest: {
        format: "0.0.1-prealpha.9",
      },
      uriResolver: "w3://ens/my-plugin",
    });
  });

  it("returns an error when circular redirect loops are found", async () => {
    const circular: UriRedirect<Uri>[] = [
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
      uriResolvers,
      client(apis, plugins, interfaces, circular),
      new Map<string, Api>(),
    ).catch((e: Error) =>
      expect(e.message).toMatch(/Infinite loop while resolving URI/)
    );
  });

  it("throws when redirect missing the from property", async () => {
    const missingFromProperty: UriRedirect<Uri>[] = [
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
      uriResolvers,
      client(apis, plugins, interfaces, missingFromProperty),
      new Map<string, Api>(),
    ).catch((e: Error) =>
      expect(e.message).toMatch(
        "Redirect missing the from property.\nEncountered while resolving w3://some/api"
      )
    );
  });

  it("works when a Web3API registers a Plugin", async () => {
    const pluginRegistrations: PluginRegistration<Uri>[] = [
      ...plugins,
      {
        uri: new Uri("some/api"),
        plugin: {
          factory: () => ({} as Plugin),
          manifest: {
            schema: "",
            implements: [coreInterfaceUris.uriResolver],
          },
        },
      },
    ];

    const result = await resolveUri(
      new Uri("some/api"),
      uriResolvers,
      client(apis, pluginRegistrations, interfaces),
      new Map<string, Api>(),
    );

    expect(result.api).toBeTruthy();
    
    const apiIdentity = await result.api!.invoke(
      {} as InvokeApiOptions<Uri>,
      {} as Client
    );

    expect(apiIdentity.error).toBeUndefined();
  });

  it("returns URI when it does not resolve to an API", async () => {
    const faultyIpfsApi: PluginModules = {
      query: {
        tryResolveUri: (
          input: { authority: string; path: string },
          _client: Client
        ) => {
          return {
            manifest: null,
          };
        },
      },
    };

    const uri = new Uri("some/api");

    const { uri: resolvedUri, api, error } = await resolveUri(
      uri,
      uriResolvers,
      client(
        {
          ...apis,
          "w3://ens/ipfs": faultyIpfsApi
        }, 
        plugins, 
        interfaces
      ),
      new Map<string, Api>(),
    );

    expect(resolvedUri).toEqual(uri);
    expect(api).toBeFalsy();
    expect(error).toBeFalsy();
  });
});
