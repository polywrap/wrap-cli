# PolywrapClient Config Builder

A utility class for building the PolywrapClient config. 

Supports building configs using method chaining or imperatively.

## Quickstart

### Initialize

Initialize a ClientConfigBuilder using the [constructor](#constructor)

```typescript
  // start with a blank slate (typical usage)
  const builder = new ClientConfigBuilder();
```

### Configure

Add client configuration with [add](#add), or flexibly mix and match builder [configuration methods](#addwrapper) to add and remove configuration items.

```typescript
  // add multiple items to the configuration using the catch-all `add` method
  builder.add({
    envs: {},
    interfaces: {},
    redirects: {},
    wrappers: {},
    packages: {},
    resolvers: [],
  });

  // add or remove items by chaining method calls
  builder
    .addPackage("wrap://plugin/package", httpPlugin({}))
    .removePackage("wrap://plugin/package")
    .addPackages(
      {
        "wrap://plugin/http": httpPlugin({}),
        "wrap://plugin/filesystem": fileSystemPlugin({}),
      }
    );
```

You can add the entire [default client configuration bundle](#bundle--defaultconfig) at once with [addDefaults](#adddefaults)

```typescript
  builder.addDefaults();
```

### Build

Finally, build a ClientConfig or CoreClientConfig to pass to the PolywrapClient constructor.

```typescript
  // accepted by either the PolywrapClient or the PolywrapCoreClient
  let coreClientConfig = builder.build();

  // build with a custom cache
  coreClientConfig = builder.build({
    wrapperCache: new WrapperCache(),
  });

  // or build with a custom resolver
  coreClientConfig = builder.build({
    resolver: RecursiveResolver.from([]),
  });
```

### Example

A complete example using all or most of the available methods.

```typescript=
  // init
  const builder = new ClientConfigBuilder();

  // add the default bundle first to override its entries later
  builder.addDefaults();

  // add many config items at once
  builder.add({
    envs: {},
    interfaces: {},
    redirects: {},
    wrappers: {},
    packages: {},
    resolvers: [],
  });

  // add and remove wrappers
  builder
    .addWrapper("wrap://ens/wrapper.eth", await WasmWrapper.from(
      new Uint8Array([1, 2, 3]),
      new Uint8Array([1, 2, 3])
    ))
    .removeWrapper("wrap://ens/wrapper.eth")
    .addWrappers({
      "wrap://ens/wrapper.eth": await WasmWrapper.from(
          new Uint8Array([1, 2, 3]),
          new Uint8Array([1, 2, 3])
      )}
    );

  // add and remove wrap packages
  builder
    .addPackage("wrap://plugin/package", httpPlugin({}))
    .removePackage("wrap://plugin/package")
    .addPackages({
      "wrap://plugin/package": httpPlugin({})
    })

  // add and remove Envs
  builder
    .addEnv("wrap://ens/wrapper.eth", { key: "value" })
    .removeEnv("wrap://ens/wrapper.eth")
    .addEnvs({
      "wrap://ens/wrapper.eth": { key: "value" },
    });

  // override existing Env, or add new Env if one is not registered at URI
  builder.setEnv("wrap://ens/wrapper.eth", { key: "value" });

  // add or remove registration for an implementation of an interface
  builder
    .addInterfaceImplementation(
      "wrap://ens/interface.eth",
      "wrap://ens/wrapper.eth"
    )
    .removeInterfaceImplementation(
      "wrap://ens/interface.eth",
      "wrap://ens/wrapper.eth"
    )
    .addInterfaceImplementations("wrap://ens/interface.eth", [
      "wrap://ens/wrapper.eth",
    ]);

  // add or remove URI redirects
  builder
    .addRedirect("wrap://ens/from.eth", "wrap://ens/to.eth")
    .removeRedirect("wrap://ens/from.eth")
    .addRedirects({
       "wrap://ens/from.eth": "wrap://ens/to.eth",
    });

  // add resolvers
  builder.addResolver(RecursiveResolver.from([]));
  builder.addResolvers([]);

  // build
  const clientConfig = builder.build();
```

# Reference

## ClientConfigBuilder

### Constructor
```ts
  /**
   * Instantiate a ClientConfigBuilder
   */
  constructor() 
```

### add
```ts
  /**
   * Add a partial BuilderConfig
   * This is equivalent to calling each of the plural add functions: `addEnvs`, `addWrappers`, etc.
   *
   * @param config: a partial BuilderConfig
   * @returns IClientConfigBuilder (mutated self)
   */
  add(config: Partial<BuilderConfig>): IClientConfigBuilder;
```

### addWrapper
```ts
  /**
   * Add an embedded wrapper
   *
   * @param uri: uri of wrapper
   * @param wrapper: wrapper to be added
   * @returns IClientConfigBuilder (mutated self)
   */
  addWrapper(uri: string, wrapper: Wrapper): IClientConfigBuilder;
```

### addWrappers
```ts
  /**
   * Add one or more embedded wrappers.
   * This is equivalent to calling addWrapper for each wrapper.
   *
   * @param uriWrappers: an object where keys are uris and wrappers are value
   * @returns IClientConfigBuilder (mutated self)
   */
  addWrappers(uriWrappers: Record<string, Wrapper>): IClientConfigBuilder;
```

### removeWrapper
```ts
  /**
   * Remove an embedded wrapper
   *
   * @param uri: the wrapper's URI
   * @returns IClientConfigBuilder (mutated self)
   */
  removeWrapper(uri: string): IClientConfigBuilder;
```

### addPackage
```ts
  /**
   * Add an embedded wrap package
   *
   * @param uri: uri of wrapper
   * @param wrapPackage: package to be added
   * @returns IClientConfigBuilder (mutated self)
   */
  addPackage(uri: string, wrapPackage: IWrapPackage): IClientConfigBuilder;
```

### addPackages
```ts
  /**
   * Add one or more embedded wrap packages
   * This is equivalent to calling addPackage for each package
   *
   * @param uriPackages: an object where keys are uris and packages are value
   * @returns IClientConfigBuilder (mutated self)
   */
  addPackages(uriPackages: Record<string, IWrapPackage>): IClientConfigBuilder;
```

### removePackage
```ts
  /**
   * Remove an embedded wrap package
   *
   * @param uri: the package's URI
   * @returns IClientConfigBuilder (mutated self)
   */
  removePackage(uri: string): IClientConfigBuilder;
```

### addEnv
```ts
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is modified.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: an object with the env variables for the uri
   * @returns IClientConfigBuilder (mutated self)
   */
  addEnv(uri: string, env: Record<string, unknown>): IClientConfigBuilder;
```

### addEnvs
```ts
  /**
   * Add one or more Envs
   * This is equivalent to calling addEnv for each Env
   *
   * @param uriEnvs: and object where key is the uri and value is the another object with the env variables for the uri
   * @returns IClientConfigBuilder (mutated self)
   */
  addEnvs(
    uriEnvs: Record<string, Record<string, unknown>>
  ): IClientConfigBuilder;
```

### removeEnv
```ts
  /**
   * Remove an Env
   *
   * @param uri: the URI associated with the Env
   * @returns IClientConfigBuilder (mutated self)
   */
  removeEnv(uri: string): IClientConfigBuilder;
```

### setEnv
```ts
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is replaced.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: an object with the environment variables for the uri
   * @returns IClientConfigBuilder (mutated self)
   */
  setEnv(uri: string, env: Record<string, unknown>): IClientConfigBuilder;
```

### addInterfaceImplementation
```ts
  /**
   * Register an implementation of a single interface
   *
   * @param interfaceUri: the URI of the interface
   * @param implementationUri: the URI of the implementation
   * @returns IClientConfigBuilder (mutated self)
   */
  addInterfaceImplementation(
    interfaceUri: string,
    implementationUri: string
  ): IClientConfigBuilder;
```

### addInterfaceImplementations
```ts
  /**
   * Register one or more implementation of a single interface
   *
   * @param interfaceUri: the URI of the interface
   * @param implementationUris: a list of URIs for the implementations
   * @returns IClientConfigBuilder (mutated self)
   */
  addInterfaceImplementations(
    interfaceUri: string,
    implementationUris: Array<string>
  ): IClientConfigBuilder;
```

### removeInterfaceImplementation
```ts
  /**
   * Remove an implementation of a single interface
   *
   * @param interfaceUri: the URI of the interface
   * @param implementationUri: the URI of the implementation
   * @returns IClientConfigBuilder (mutated self)
   */
  removeInterfaceImplementation(
    interfaceUri: string,
    implementationUri: string
  ): IClientConfigBuilder;
```

### addRedirect
```ts
  /**
   * Add a redirect from one URI to another
   *
   * @param from: the URI to redirect from
   * @param to: the URI to redirect to
   * @returns IClientConfigBuilder (mutated self)
   */
  addRedirect(from: string, to: string): IClientConfigBuilder;
```

### addRedirects
```ts
  /**
   * Add an array of URI redirects
   *
   * @param redirects: an object where key is from and value is to
   * @returns IClientConfigBuilder (mutated self)
   */
  addRedirects(redirects: Record<string, string>): IClientConfigBuilder;
```

### removeRedirect
```ts
  /**
   * Remove a URI redirect
   *
   * @param from: the URI that is being redirected
   * @returns IClientConfigBuilder (mutated self)
   */
  removeRedirect(from: string): IClientConfigBuilder;
```

### addResolver
```ts
  /**
   * Add a URI Resolver, capable of resolving a URI to a wrapper
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect<string>
   *   | IUriPackage<string>
   *   | IUriWrapper<string>
   *   | UriResolverLike[];
   *
   * @param resolver: A UriResolverLike
   * @returns IClientConfigBuilder (mutated self)
   */
  addResolver(resolver: UriResolverLike): IClientConfigBuilder;
```

### addResolvers
```ts
  /**
   * Add one or more URI Resolvers, capable of resolving URIs to wrappers
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect<string>
   *   | IUriPackage<string>
   *   | IUriWrapper<string>
   *   | UriResolverLike[];
   *
   * @param resolvers: A list of UriResolverLike
   * @returns IClientConfigBuilder (mutated self)
   */
  addResolvers(resolvers: UriResolverLike[]): IClientConfigBuilder;
```

### addDefaults
```ts
  /**
   * Add the default configuration bundle
   *
   * @returns IClientConfigBuilder (mutated self)
   */
  addDefaults(): IClientConfigBuilder;
```

### build
```ts
  /**
   * Build a sanitized core client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors
   *
   * @param options - Use a custom wrapper cache or resolver
   * @returns CoreClientConfig that results from applying all the steps in the builder pipeline
   */
  build(options?: BuildOptions): CoreClientConfig;
```

## Bundles

### Bundle: DefaultConfig
```ts
export const ipfsProviders: string[] = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

interface IDefaultEmbed {
  uri: Uri;
  package: IWrapPackage;
  source: Uri;
}

interface IDefaultEmbeds {
  ipfsHttpClient: IDefaultEmbed;
  asyncIpfsResolver: IDefaultEmbed;
}

export const embeds: IDefaultEmbeds = {
  ipfsHttpClient: {
    uri: Uri.from("embed/ipfs-http-client@1.0.0"),
    package: ipfsHttpClient.wasmPackage,
    source: Uri.from("ens/wraps.eth:ipfs-http-client@1.0.0"),
  },
  asyncIpfsResolver: {
    uri: Uri.from("embed/async-ipfs-uri-resolver-ext@1.0.0"),
    package: ipfsResolver.wasmPackage,
    source: Uri.from("ens/wraps.eth:async-ipfs-uri-resolver-ext@1.0.0"),
  },
};

type UriResolverExtBootloader = [IDefaultEmbed, IUriRedirect, ...Uri[]];

export const uriResolverExts: UriResolverExtBootloader = [
  embeds.asyncIpfsResolver,
  {
    from: Uri.from("ens/wraps.eth:ens-text-record-uri-resolver-ext@1.0.0"),
    to: Uri.from("ipfs/QmaM318ABUXDhc5eZGGbmDxkb2ZgnbLxigm5TyZcCsh1Kw"),
  },
  Uri.from("ens/wraps.eth:http-uri-resolver-ext@1.0.0"),
  Uri.from("ens/wraps.eth:file-system-uri-resolver-ext@1.0.0"),
  Uri.from("ens/wraps.eth:ens-uri-resolver-ext@1.0.0"),
  Uri.from("ens/wraps.eth:ens-ipfs-contenthash-uri-resolver-ext@1.0.0"),
  Uri.from("ens/wraps.eth:ens-ocr-contenthash-uri-resolver-ext@1.0.0"),
];

interface IDefaultPlugin {
  uri: Uri;
  plugin: PluginPackage<unknown>;
  implements: Uri[];
}

interface IDefaultPlugins {
  logger: IDefaultPlugin;
  http: IDefaultPlugin;
  fileSystem: IDefaultPlugin;
  concurrent: IDefaultPlugin;
  ethereumProvider: IDefaultPlugin;
}

export const plugins: IDefaultPlugins = {
  logger: {
    uri: Uri.from("plugin/logger@1.0.0"),
    plugin: loggerPlugin({}),
    implements: [Uri.from("ens/wraps.eth:logger@1.0.0")],
  },
  http: {
    uri: Uri.from("plugin/http@1.1.0"),
    plugin: httpPlugin({}),
    implements: [
      Uri.from("ens/wraps.eth:http@1.1.0"),
      Uri.from("ens/wraps.eth:http@1.0.0"),
    ],
  },
  fileSystem: {
    uri: Uri.from("plugin/file-system@1.0.0"),
    plugin: fileSystemPlugin({}),
    implements: [Uri.from("ens/wraps.eth:file-system@1.0.0")],
  },
  concurrent: {
    uri: Uri.from("plugin/concurrent@1.0.0"),
    plugin: concurrentPromisePlugin({}),
    implements: [Uri.from("ens/wraps.eth:concurrent@1.0.0")],
  },
  ethereumProvider: {
    uri: Uri.from("plugin/ethereum-provider@1.1.0"),
    plugin: ethereumProviderPlugin({
      connections: new Connections({
        networks: {
          mainnet: new Connection({
            provider:
              "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          }),
          goerli: new Connection({
            provider:
              "https://goerli.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          }),
        },
      }),
    }),
    implements: [
      Uri.from("ens/wraps.eth:ethereum-provider@1.1.0"),
      Uri.from("ens/wraps.eth:ethereum-provider@1.0.0"),
    ],
  },
};

export function getConfig(): BuilderConfig {
  const builder = new ClientConfigBuilder();

  // Add all embedded packages
  for (const embed of Object.values(embeds)) {
    builder.addPackage(embed.uri.uri, embed.package);

    // Add source redirect
    builder.addRedirect(embed.source.uri, embed.uri.uri);

    // Add source implementation
    builder.addInterfaceImplementation(embed.source.uri, embed.uri.uri);
  }

  // Add all plugin packages
  for (const plugin of Object.values(plugins)) {
    builder.addPackage(plugin.uri.uri, plugin.plugin);

    // Add all interface implementations & redirects
    for (const interfaceUri of plugin.implements) {
      builder.addInterfaceImplementation(interfaceUri.uri, plugin.uri.uri);
      builder.addRedirect(interfaceUri.uri, plugin.uri.uri);
    }
  }

  // Add all uri-resolver-ext interface implementations
  builder.addInterfaceImplementations(
    ExtendableUriResolver.extInterfaceUri.uri,
    [
      uriResolverExts[0].source.uri,
      uriResolverExts[1].from.uri,
      ...uriResolverExts.slice(2).map((x: Uri) => x.uri),
    ]
  );
  builder.addRedirect(uriResolverExts[1].from.uri, uriResolverExts[1].to.uri);

  // Configure the ipfs-uri-resolver provider endpoints & retry counts
  builder.addEnv(embeds.asyncIpfsResolver.source.uri, {
    provider: ipfsProviders[0],
    fallbackProviders: ipfsProviders.slice(1),
    retries: { tryResolveUri: 2, getFile: 2 },
  });

  return builder.config;
}
```