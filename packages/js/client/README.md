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