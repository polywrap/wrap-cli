# @polywrap/client-js
<a href="https://www.npmjs.com/package/@polywrap/client-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@polywrap/client-js.svg" alt="npm"/>
</a>

<br/>
<br/>
The Polywrap client extends the PolywrapCoreClient to provide UX features, such as an additional constructor and additional configuration options.

## Installation

```bash
npm install --save @polywrap/client-js
```

## Usage

### Instantiate

Use the PolywrapClient [constructor](#constructor) to instantiate the client with the default configuration bundle.

```ts
  import { PolywrapClient } from "@polywrap/client-js";

  const client = new PolywrapClient();
```

### Configure

Use the `@polywrap/client-config-builder-js` package to build a custom configuration for your project.

```ts
  const config = new ClientConfigBuilder().addDefaults().build();

  const client = new PolywrapClient(config, { noDefaults: true });
```

### Invoke

Invoke a wrapper.

```ts
  const result = await client.invoke({
    uri: "ens/helloworld.dev.polywrap.eth",
    method: "logMessage",
    args: {
      message: "Hello World!"
    }
  });

  if (!result.ok) throw result.error;

  const value = result.value;
```

# Reference

## Configuration

Below you will find a reference of object definitions which can be used to configure the Polywrap client. Please note that the intended way of configuring the client is to use the `ClientConfigBuilder`, as explained above.

### ClientConfig
```ts
/**
 * Client configuration that can be passed to the PolywrapClient
 *
 * @remarks
 * The PolywrapClient converts the ClientConfig to a CoreClientConfig.
 */
export interface ClientConfig {
  /** set environmental variables for a wrapper */
  readonly envs: Env[];

  /** register interface implementations */
  readonly interfaces: InterfaceImplementations[];

  /** redirect invocations from one uri to another */
  readonly redirects: IUriRedirect[];

  /** add embedded wrappers */
  readonly wrappers: IUriWrapper[];

  /** add and configure embedded packages */
  readonly packages: IUriPackage[];

  /** customize URI resolution
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect
   *   | IUriPackage
   *   | IUriWrapper
   *   | UriResolverLike[]
   *   */
  readonly resolvers: UriResolverLike[];
}
```

### PolywrapClientConfig
```ts
/**
 * Client configuration that can be passed to the PolywrapClient.
 *
 * @remarks
 * Extends ClientConfig from @polywrap/client-js.
 * The PolywrapClient converts the PolywrapClientConfig to a CoreClientConfig.
 */
export interface PolywrapClientConfig<TUri extends Uri | string = string> {
  /** set environmental variables for a wrapper */
  readonly envs: GenericEnv<TUri>[];

  /** register interface implementations */
  readonly interfaces: GenericInterfaceImplementations<TUri>[];

  /** redirect invocations from one uri to another */
  readonly redirects: IGenericUriRedirect<TUri>[];

  /** add embedded wrappers */
  readonly wrappers: IGenericUriWrapper<TUri>[];

  /** add and configure embedded packages */
  readonly packages: IGenericUriPackage<TUri>[];

  /** customize URI resolution
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect
   *   | IUriPackage
   *   | IUriWrapper
   *   | UriResolverLike<TUri>[]
   *   */
  readonly resolvers: GenericUriResolverLike<TUri>[];
  /** a wrapper cache to be used in place of the default wrapper cache */
  readonly wrapperCache?: IWrapperCache;

  /** configuration for opentelemetry tracing to aid in debugging */
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
```

## PolywrapClient

### Constructor
```ts
  /**
   * Instantiate a PolywrapClient
   *
   * @param config - a whole or partial client configuration
   * @param options - { noDefaults?: boolean }
   */
  constructor(
    config?: Partial<PolywrapClientConfig<TUri>>,
    options?: { noDefaults?: boolean }
  );
  constructor(config: CoreClientConfig, options?: { noDefaults?: boolean });
  constructor(
    config: Partial<ClientConfig>,
    options?: { noDefaults?: boolean }
  );
  constructor(
    config: PolywrapCoreClientConfig<TUri>,
    options?: { noDefaults: boolean }
  );
  constructor(
    config:
      | Partial<PolywrapClientConfig<TUri>>
      | undefined
      | PolywrapCoreClientConfig<TUri>
      | CoreClientConfig
      | Partial<ClientConfig>,
    options?: { noDefaults?: boolean }
  ) 
```