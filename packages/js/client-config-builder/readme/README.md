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

# Reference

## Types

```ts
$snippet: ClientConfig
```

## ClientConfigBuilder

### Constructor
```ts
$snippet: ClientConfigBuilder-constructor
```

### build
```ts
$snippet: IClientConfigBuilder-build
```

### buildCoreConfig
```ts
$snippet: IClientConfigBuilder-buildCoreConfig
```

### add
```ts
$snippet: IClientConfigBuilder-add
```

### addDefaults
```ts
$snippet: IClientConfigBuilder-addDefaults
```

### addWrapper
```ts
$snippet: IClientConfigBuilder-addWrapper
```

### addWrappers
```ts
$snippet: IClientConfigBuilder-addWrappers
```

### removeWrapper
```ts
$snippet: IClientConfigBuilder-removeWrapper
```

### addPackage
```ts
$snippet: IClientConfigBuilder-addPackage
```

### addPackages
```ts
$snippet: IClientConfigBuilder-addPackages
```

### removePackage
```ts
$snippet: IClientConfigBuilder-removePackage
```

### addEnv
```ts
$snippet: IClientConfigBuilder-addEnv
```

### addEnvs
```ts
$snippet: IClientConfigBuilder-addEnvs
```

### removeEnv
```ts
$snippet: IClientConfigBuilder-removeEnv
```

### setEnv
```ts
$snippet: IClientConfigBuilder-setEnv
```

### addInterfaceImplementation
```ts
$snippet: IClientConfigBuilder-addInterfaceImplementation
```

### addInterfaceImplementations
```ts
$snippet: IClientConfigBuilder-addInterfaceImplementations
```

### removeInterfaceImplementation
```ts
$snippet: IClientConfigBuilder-removeInterfaceImplementation
```

### addRedirect
```ts
$snippet: IClientConfigBuilder-addRedirect
```

### addRedirects
```ts
$snippet: IClientConfigBuilder-addRedirects
```

### removeRedirect
```ts
$snippet: IClientConfigBuilder-removeRedirect
```

### addResolver
```ts
$snippet: IClientConfigBuilder-addResolver
```

### addResolvers
```ts
$snippet: IClientConfigBuilder-addResolvers
```

## Bundle: DefaultConfig
```ts
$snippet: getDefaultConfig
```