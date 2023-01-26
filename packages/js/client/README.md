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
  const config = new ClientConfigBuilder().addDefaults().buildCoreConfig();

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

## Types

```ts
/**
 * Client configuration that can be passed to the PolywrapClient.
 *
 * @remarks
 * Extends ClientConfig from @polywrap/client-config-builder-js.
 * The PolywrapClient converts the PolywrapClientConfig to a CoreClientConfig.
 */
export interface PolywrapClientConfig<TUri extends Uri | string = Uri | string>
  extends ClientConfig<TUri> {
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
    config?: Partial<PolywrapClientConfig>,
    options?: { noDefaults?: false }
  );
  constructor(config: PolywrapCoreClientConfig, options: { noDefaults: true });
  constructor(
    config:
      | Partial<PolywrapClientConfig>
      | undefined
      | PolywrapCoreClientConfig,
    options?: { noDefaults?: boolean }
  ) 
```