# PolywrapClient Config Builder

A utility class for building the PolywrapClient config. 

Supports building configs using method chaining or imperatively.

## Quickstart

### Initialize

Initialize a ClientConfigBuilder using the [constructor](#constructor)

```typescript
  // start with a blank slate (typical usage)
  const builder = new ClientConfigBuilder();

  // instantiate a builder with a custom cache and/or resolver
  const _builder = new ClientConfigBuilder(
    new WrapperCache(),
    RecursiveResolver.from([])
  );
```

### Configure

Add client configuration with [add](#add), or flexibly mix and match builder [configuration methods](#addwrapper) to add and remove configuration items.

```typescript
  // add multiple items to the configuration using the catch-all `add` method
  builder.add({
    envs: [],
    interfaces: [],
    redirects: [],
    wrappers: [],
    packages: [],
    resolvers: [],
  });

  // add or remove items by chaining method calls
  builder
    .addPackage({
      uri: "wrap://plugin/package",
      package: httpPlugin({}),
    })
    .removePackage("wrap://plugin/package")
    .addPackages([
      {
        uri: "wrap://plugin/http",
        package: httpPlugin({}),
      },
      {
        uri: "wrap://plugin/filesystem",
        package: fileSystemPlugin({}),
      },
    ]);
```

You can add the entire [default client configuration bundle](#bundle--defaultconfig) at once with [addDefaults](#adddefaults)

```typescript
  builder.addDefaults();
```

### Build

Finally, build a ClientConfig or CoreClientConfig to pass to the PolywrapClient constructor.

```typescript
  // accepted by the PolywrapClient
  const clientConfig = builder.build();

  // accepted by either the PolywrapClient or the PolywrapCoreClient
  const coreClientConfig = builder.buildCoreConfig();
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
    envs: [],
    interfaces: [],
    redirects: [],
    wrappers: [],
    packages: [],
    resolvers: [],
  });

  // add and remove wrappers
  builder
    .addWrapper({
      uri: "wrap://ens/wrapper.eth",
      wrapper: await WasmWrapper.from(
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3])
      ),
    })
    .removeWrapper("wrap://ens/wrapper.eth")
    .addWrappers([
      {
        uri: "wrap://ens/wrapper.eth",
        wrapper: await WasmWrapper.from(
          new Uint8Array([1, 2, 3]),
          new Uint8Array([1, 2, 3])
        ),
      },
    ]);

  // add and remove wrap packages
  builder
    .addPackage({
      uri: "wrap://plugin/package",
      package: httpPlugin({}),
    })
    .removePackage("wrap://plugin/package")
    .addPackages([
      {
        uri: "wrap://plugin/package",
        package: httpPlugin({}),
      },
    ]);

  // add and remove Envs
  builder
    .addEnv("wrap://ens/wrapper.eth", { key: "value" })
    .removeEnv("wrap://ens/wrapper.eth")
    .addEnvs([
      {
        uri: "wrap://ens/wrapper.eth",
        env: { key: "value" },
      },
    ]);

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
    .addRedirects([
      {
        from: "wrap://ens/from.eth",
        to: "wrap://ens/to.eth",
      },
    ]);

  // add resolvers
  builder.addResolver(RecursiveResolver.from([]));
  builder.addResolvers([]);

  // build
  const clientConfig = builder.build();
```

# Reference

## Types

```ts
/**
 * Client configuration that can be passed to the PolywrapClient
 *
 * @remarks
 * The PolywrapClient converts the ClientConfig to a CoreClientConfig.
 */
export interface ClientConfig<TUri extends Uri | string = Uri | string> {
  /** set environmental variables for a wrapper */
  readonly envs: Env<TUri>[];

  /** register interface implementations */
  readonly interfaces: InterfaceImplementations<TUri>[];

  /** redirect invocations from one uri to another */
  readonly redirects: IUriRedirect<TUri>[];

  /** add embedded wrappers */
  readonly wrappers: IUriWrapper<TUri>[];

  /** add and configure embedded packages */
  readonly packages: IUriPackage<TUri>[];

  /** customize URI resolution
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect<Uri | string>
   *   | IUriPackage<Uri | string>
   *   | IUriWrapper<Uri | string>
   *   | UriResolverLike[]
   *   */
  readonly resolvers: UriResolverLike[];
}
```

## ClientConfigBuilder

### Constructor
```ts
  /**
   * Instantiate a ClientConfigBuilder
   *
   * @param _wrapperCache?: a wrapper cache to be used in place of the default wrapper cache
   * @param _resolver?: a uri resolver to be used in place of any added redirects, wrappers, packages, and resolvers when building a CoreClientConfig
   */
  constructor(
    private readonly _wrapperCache?: IWrapperCache,
    private readonly _resolver?: IUriResolver<unknown>
  ) 
```

### add
```ts
  /**
   * Add a partial ClientConfig
   * This is equivalent to calling each of the plural add functions: `addEnvs`, `addWrappers`, etc.
   *
   * @param config: a partial CliengConfig
   * @returns IClientConfigBuilder (mutated self)
   */
  add(config: Partial<ClientConfig>): IClientConfigBuilder;
```

### addWrapper
```ts
  /**
   * Add an embedded wrapper
   *
   * @param uriWrapper: a wrapper and its URI
   * @returns IClientConfigBuilder (mutated self)
   */
  addWrapper(uriWrapper: IUriWrapper<Uri | string>): IClientConfigBuilder;
```

### addWrappers
```ts
  /**
   * Add one or more embedded wrappers.
   * This is equivalent to calling addWrapper for each wrapper.
   *
   * @param uriWrappers: a list of wrappers and their URIs
   * @returns IClientConfigBuilder (mutated self)
   */
  addWrappers(uriWrappers: IUriWrapper<Uri | string>[]): IClientConfigBuilder;
```

### removeWrapper
```ts
  /**
   * Remove an embedded wrapper
   *
   * @param uri: the wrapper's URI
   * @returns IClientConfigBuilder (mutated self)
   */
  removeWrapper(uri: Uri | string): IClientConfigBuilder;
```

### addPackage
```ts
  /**
   * Add an embedded wrap package
   *
   * @param uriPackage: a package and its URI
   * @returns IClientConfigBuilder (mutated self)
   */
  addPackage(uriPackage: IUriPackage<Uri | string>): IClientConfigBuilder;
```

### addPackages
```ts
  /**
   * Add one or more embedded wrap packages
   * This is equivalent to calling addPackage for each package
   *
   * @param uriPackages: a list of packages and their URIs
   * @returns IClientConfigBuilder (mutated self)
   */
  addPackages(uriPackages: IUriPackage<Uri | string>[]): IClientConfigBuilder;
```

### removePackage
```ts
  /**
   * Remove an embedded wrap package
   *
   * @param uri: the package's URI
   * @returns IClientConfigBuilder (mutated self)
   */
  removePackage(uri: Uri | string): IClientConfigBuilder;
```

### addEnv
```ts
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is modified.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: a string-index map of msgpack-serializable environmental variables
   * @returns IClientConfigBuilder (mutated self)
   */
  addEnv(uri: Uri | string, env: Record<string, unknown>): IClientConfigBuilder;
```

### addEnvs
```ts
  /**
   * Add one or more Envs
   * This is equivalent to calling addEnv for each Env
   *
   * @param envs: a list of Envs
   * @returns IClientConfigBuilder (mutated self)
   */
  addEnvs(envs: Env<Uri | string>[]): IClientConfigBuilder;
```

### removeEnv
```ts
  /**
   * Remove an Env
   *
   * @param uri: the URI associated with the Env
   * @returns IClientConfigBuilder (mutated self)
   */
  removeEnv(uri: Uri | string): IClientConfigBuilder;
```

### setEnv
```ts
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is replaced.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: a string-index map of msgpack-serializable environmental variables
   * @returns IClientConfigBuilder (mutated self)
   */
  setEnv(uri: Uri | string, env: Record<string, unknown>): IClientConfigBuilder;
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
    interfaceUri: Uri | string,
    implementationUri: Uri | string
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
    interfaceUri: Uri | string,
    implementationUris: Array<Uri | string>
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
    interfaceUri: Uri | string,
    implementationUri: Uri | string
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
  addRedirect(from: Uri | string, to: Uri | string): IClientConfigBuilder;
```

### addRedirects
```ts
  /**
   * Add an array of URI redirects
   *
   * @param redirects: a list of URI redirects
   * @returns IClientConfigBuilder (mutated self)
   */
  addRedirects(redirects: IUriRedirect<Uri | string>[]): IClientConfigBuilder;
```

### removeRedirect
```ts
  /**
   * Remove a URI redirect
   *
   * @param from: the URI that is being redirected
   * @returns IClientConfigBuilder (mutated self)
   */
  removeRedirect(from: Uri | string): IClientConfigBuilder;
```

### addResolver
```ts
  /**
   * Add a URI Resolver, capable of resolving a URI to a wrapper
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect<Uri | string>
   *   | IUriPackage<Uri | string>
   *   | IUriWrapper<Uri | string>
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
   *   | IUriRedirect<Uri | string>
   *   | IUriPackage<Uri | string>
   *   | IUriWrapper<Uri | string>
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
   * Build a sanitized client configuration that can be passed to the PolywrapClient constructor
   *
   * @returns ClientConfig<Uri> that results from applying all the steps in the builder pipeline
   */
  build(): ClientConfig<Uri>;
```

### buildCoreConfig
```ts
  /**
   * Build a sanitized core client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors
   *
   * @returns CoreClientConfig<Uri> that results from applying all the steps in the builder pipeline
   */
  buildCoreConfig(): CoreClientConfig<Uri>;
```

## Bundles

### Bundle: DefaultConfig
```ts

export const defaultIpfsProviders = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

export const defaultWrappers = {
  sha3: "wrap://ens/goerli/sha3.wrappers.eth",
  uts46: "wrap://ens/goerli/uts46-lite.wrappers.eth",
  graphNode: "wrap://ens/goerli/graph-node.wrappers.eth",
  ensTextRecordResolver:
    "wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY",
};

export const defaultPackages = {
  ipfs: "wrap://ens/ipfs.polywrap.eth",
  ensResolver: "wrap://ens/ens-resolver.polywrap.eth",
  ethereum: "wrap://ens/ethereum.polywrap.eth",
  http: "wrap://plugin/http",
  httpResolver: "wrap://ens/http-resolver.polywrap.eth",
  logger: "wrap://plugin/logger",
  fileSystem: "wrap://ens/fs.polywrap.eth",
  fileSystemResolver: "wrap://ens/fs-resolver.polywrap.eth",
  ipfsResolver: "wrap://ens/ipfs-resolver.polywrap.eth",
  concurrent: "wrap://plugin/concurrent",
};

export const defaultInterfaces = {
  uriResolver: "wrap://ens/uri-resolver.core.polywrap.eth",
  concurrent: "wrap://ens/goerli/interface.concurrent.wrappers.eth",
  logger: "wrap://ens/wrappers.polywrap.eth:logger@1.0.0",
  http: "wrap://ens/wrappers.polywrap.eth:http@1.1.0",
};

export const getDefaultConfig = (): ClientConfig<Uri> => {
  return {
    envs: [
      {
        uri: new Uri(defaultWrappers.graphNode),
        env: {
          provider: "https://api.thegraph.com",
        },
      },
      {
        uri: new Uri(defaultPackages.ipfs),
        env: {
          provider: defaultIpfsProviders[0],
          fallbackProviders: defaultIpfsProviders.slice(1),
        },
      },
    ],
    redirects: [
      {
        from: new Uri("wrap://ens/sha3.polywrap.eth"),
        to: new Uri(defaultWrappers.sha3),
      },
      {
        from: new Uri("wrap://ens/uts46.polywrap.eth"),
        to: new Uri(defaultWrappers.uts46),
      },
      {
        from: new Uri("wrap://ens/graph-node.polywrap.eth"),
        to: new Uri(defaultWrappers.graphNode),
      },
      {
        from: new Uri(defaultInterfaces.logger),
        to: new Uri(defaultPackages.logger),
      },
      {
        from: new Uri("wrap://ens/http.polywrap.eth"),
        to: new Uri(defaultInterfaces.http),
      },
      {
        from: new Uri(defaultInterfaces.http),
        to: new Uri(defaultPackages.http),
      },
    ],
    interfaces: [
      {
        interface: new Uri(defaultInterfaces.uriResolver),
        implementations: [
          new Uri(defaultPackages.ipfsResolver),
          new Uri(defaultPackages.ensResolver),
          new Uri(defaultPackages.fileSystemResolver),
          new Uri(defaultPackages.httpResolver),
          new Uri(defaultWrappers.ensTextRecordResolver),
        ],
      },
      {
        interface: new Uri(defaultInterfaces.logger),
        implementations: [new Uri(defaultPackages.logger)],
      },
      {
        interface: new Uri(defaultInterfaces.concurrent),
        implementations: [new Uri(defaultPackages.concurrent)],
      },
    ],
    packages: getDefaultPlugins(),
    wrappers: [],
    resolvers: [],
  };
};

export const getDefaultPlugins = (): IUriPackage<Uri>[] => {
  return [
    // IPFS is required for downloading Polywrap packages
    {
      uri: new Uri(defaultPackages.ipfs),
      package: ipfsPlugin({}),
    },
    // ENS is required for resolving domain to IPFS hashes
    {
      uri: new Uri(defaultPackages.ensResolver),
      package: ensResolverPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.ethereum),
      package: ethereumPlugin({
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
    },
    {
      uri: new Uri(defaultPackages.http),
      package: httpPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.httpResolver),
      package: httpResolverPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.logger),
      // TODO: remove this once types are updated
      package: loggerPlugin({}) as IWrapPackage,
    },
    {
      uri: new Uri(defaultPackages.fileSystem),
      package: fileSystemPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.fileSystemResolver),
      package: fileSystemResolverPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.ipfsResolver),
      package: ipfsResolverPlugin({}),
    },
    {
      uri: new Uri(defaultPackages.concurrent),
      package: concurrentPromisePlugin({}),
    },
  ];
};

```