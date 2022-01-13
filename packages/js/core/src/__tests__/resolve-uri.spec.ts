import {
  Api,
  UriResolver,
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
  resolveUri,
  AnyManifest,
} from "../";
import { coreInterfaceUris } from "../interfaces";
import { ManifestType } from "../manifest";
import {
  GetFileOptions,
  GetImplementationsOptions,
  GetManifestOptions,
  InterfaceImplementations,
  PluginRegistration,
  SubscribeOptions,
  Subscription,
} from "../types";

describe("resolveUri", () => {
  const client = (apis: Record<string, PluginModules>): Client => ({
    getRedirects: () => [],
    getPlugins: () => [],
    getInterfaces: () => [],
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
      TManifestType extends ManifestType
    >(
      uri: TUri,
      options: GetManifestOptions<TManifestType>
    ) => {
      const manifest = {
        format: "0.0.1-prealpha.6",
        language: "",
        modules: {},
        __type: "Web3ApiManifest",
      };
      return Promise.resolve(manifest as AnyManifest<TManifestType>);
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
  });

  const createPluginApi = (uri: Uri, plugin: PluginPackage): Api => {
    return {
      invoke: () =>
        Promise.resolve({
          uri,
          plugin,
        } as InvokeApiResult),
      getSchema: (_client: Client): Promise<string> => Promise.resolve(""),
      getFile: (options: GetFileOptions, client: Client) => Promise.resolve(""),
      getManifest: <TManifestType extends ManifestType>(
        options: GetManifestOptions<TManifestType>,
        client: Client
      ) => {
        const manifest = {
          format: "0.0.1-prealpha.6",
          language: "",
          modules: {},
          __type: "Web3ApiManifest",
        };
        return Promise.resolve(manifest as AnyManifest<TManifestType>);
      },
    };
  };

  const createApi = (
    uri: Uri,
    manifest: Web3ApiManifest,
    uriResolver: Uri
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
      getManifest: <TManifestType extends ManifestType>(
        options: GetManifestOptions<TManifestType>,
        client: Client
      ) => {
        const manifest = {
          format: "0.0.1-prealpha.6",
          language: "",
          modules: {},
          __type: "Web3ApiManifest",
        };
        return Promise.resolve(manifest as AnyManifest<TManifestType>);
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

  it("sanity", () => {
    const api = new Uri("w3://ens/ens");
    const file = new Uri("w3/some-file");
    const path = "w3/some-path";
    const query = UriResolver.Query;
    const uri = new Uri("w3/some-uri");

    expect(query.tryResolveUri(client(apis).invoke, api, uri)).toBeDefined();
    expect(query.getFile(client(apis).invoke, file, path)).toBeDefined();
  });

  it("works in the typical case", async () => {
    const result = await resolveUri(
      new Uri("ens/test.eth"),
      [],
      plugins,
      interfaces,
      client(apis).invoke,
      createPluginApi,
      createApi,
      {
        noValidate: true
      },
    );

    const apiIdentity = await result.invoke(
      {} as InvokeApiOptions<Uri>,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("ipfs/QmHash"),
      manifest: {
        format: "0.0.1-prealpha.6",
      },
      uriResolver: new Uri("ens/ipfs"),
    });
  });

  it("uses a plugin that implements uri-resolver", async () => {
    const result = await resolveUri(
      new Uri("my/something-different"),
      [],
      plugins,
      interfaces,
      client(apis).invoke,
      createPluginApi,
      createApi,
      {
        noValidate: true
      },
    );

    const apiIdentity = await result.invoke(
      {} as InvokeApiOptions<Uri>,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("my/something-different"),
      manifest: {
        format: "0.0.1-prealpha.6",
      },
      uriResolver: new Uri("ens/my-plugin"),
    });
  });

  it("works when direct query a Web3API that implements the uri-resolver", async () => {
    const result = await resolveUri(
      new Uri("ens/ens"),
      [],
      plugins,
      interfaces,
      client(apis).invoke,
      createPluginApi,
      createApi,
      {
        noValidate: true
      },
    );

    const apiIdentity = await result.invoke(
      {} as InvokeApiOptions<Uri>,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("ipfs/QmHash"),
      manifest: {
        format: "0.0.1-prealpha.6",
        dog: "cat",
      },
      uriResolver: new Uri("ens/ipfs"),
    });
  });

  it("works when direct query a plugin Web3API that implements the uri-resolver", async () => {
    const result = await resolveUri(
      new Uri("my/something-different"),
      [],
      plugins,
      interfaces,
      client(apis).invoke,
      createPluginApi,
      createApi,
      {
        noValidate: true
      },
    );

    const apiIdentity = await result.invoke(
      {} as InvokeApiOptions<Uri>,
      {} as Client
    );

    expect(apiIdentity).toMatchObject({
      uri: new Uri("my/something-different"),
      manifest: {
        format: "0.0.1-prealpha.6",
      },
      uriResolver: new Uri("ens/my-plugin"),
    });
  });

  it("throws when circular redirect loops are found", async () => {
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
      circular,
      plugins,
      interfaces,
      client(apis).invoke,
      createPluginApi,
      createApi,
      {
        noValidate: true
      },
    ).catch((e) =>
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
      missingFromProperty,
      plugins,
      interfaces,
      client(apis).invoke,
      createPluginApi,
      createApi,
      {
        noValidate: true
      },
    ).catch((e) =>
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
      [],
      pluginRegistrations,
      interfaces,
      client(apis).invoke,
      createPluginApi,
      createApi,
      {
        noValidate: true
      },
    );

    const apiIdentity = await result.invoke(
      {} as InvokeApiOptions<Uri>,
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
            manifest: null,
          };
        },
      },
    };

    const uri = new Uri("some/api");

    expect.assertions(1);

    await resolveUri(
      uri,
      [],
      plugins,
      interfaces,
      client({
        ...apis,
        "w3://ens/ipfs": faultyIpfsApi,
      }).invoke,
      createPluginApi,
      createApi,
      {
        noValidate: true,
      }
    ).catch((e) =>
      expect(e.message).toMatch(`No Web3API found at URI: ${uri.uri}`)
    );
  });
});

// TODO:
// plugin that has a URI which is being redirected
// plugin which has from = uri-resolver, then have another redirect uri-resolver to something else (could easily break...)
// nested web3api that's a URI resolver available through another URI authority ([ens => crypto], [crypto => new])
