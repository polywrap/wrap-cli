# PolywrapClient Config Builder

A DSL for building the PolywrapClient config object. 

Supports building configs using method chaining or imperatively.

```typescript=
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PolywrapClient } from "@polywrap/client-js";

const config = new ClientConfigBuilder()
  .add({
    envs: [/*...*/],
    interfaces: [/*...*/],
    redirects: [/*...*/],
    wrappers: [/*...*/],
    packages: [/*...*/],
    resolvers: [/*...*/],
  })
  .add({/*...*/})
  .build();

// ...

const builder = new ClientConfigBuilder();

builder.addDefaults();

builder.add({
  packages: [/*...*/]
});

builder.add({
  envs: [/*...*/]
});

const config = builder.build();


// ...

let client = new PolywrapClient(config);
```

## Methods

The config builder currently supports 3 methods:

#### `add(config: Partial<ClientConfig>)`
Appends each property of the supplied config object to the corresponding array of the builder's config.

#### `addDefaults()`
Adds the `defaultClientConfig` object.

#### `build()`
Returns a sanitized config object from the builder's config.
