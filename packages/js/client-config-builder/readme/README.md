# PolywrapClient Config Builder

A utility class for building the PolywrapClient config. 

Supports building configs using method chaining or imperatively.

## Quickstart

### Initialize

Initialize a ClientConfigBuilder using the [constructor](#constructor)

```typescript
$snippet: quickstart-initialize
```

### Configure

Add client configuration with [add](#add), or flexibly mix and match builder [configuration methods](#addwrapper) to add and remove configuration items.

```typescript
$snippet: quickstart-configure
```

You can add the entire [default client configuration bundle](#bundle--defaultconfig) at once with [addDefaults](#adddefaults)

```typescript
$snippet: quickstart-addDefaults
```

### Build

Finally, build a ClientConfig or CoreClientConfig to pass to the PolywrapClient constructor.

```typescript
$snippet: quickstart-build
```

### Example

A complete example using all or most of the available methods.

```typescript=
$snippet: quickstart-example
```

# Reference

## ClientConfigBuilder

### Constructor
```ts
$snippet: ClientConfigBuilder-constructor
```

### add
```ts
$snippet: IClientConfigBuilder-add
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

### addDefaults
```ts
$snippet: IClientConfigBuilder-addDefaults
```

### build
```ts
$snippet: IClientConfigBuilder-build
```

## Bundles

### Bundle: DefaultConfig
```ts
$snippet: getDefaultConfig
```