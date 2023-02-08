# @polywrap/core-client-js
<a href="https://www.npmjs.com/package/@polywrap/core-client-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@polywrap/core-client-js.svg" alt="npm"/>
</a>

<br/>
<br/>
The Polywrap JavaScript core client invokes wrapper functions. It's designed to run in any environment that can execute JavaScript (think websites, node scripts, etc.). It has TypeScript support.

## Installation

```bash
npm install --save @polywrap/core-client-js
```

## Usage

### Instantiate

Use the `@polywrap/client-config-builder-js` package to build a CoreClientConfig for your project, then use the PolywrapCoreClient [constructor](#constructor) to instantiate the client with your config.

```ts
$snippet: quickstart-instantiate
```

### Invoke

Invoke a wrapper.

```ts
$snippet: quickstart-invoke
```

# Reference

## PolywrapCoreClient

### Constructor
```ts
$snippet: PolywrapCoreClient-constructor
```

### getConfig
```ts
$snippet: PolywrapCoreClient-getConfig
```

### getInterfaces
```ts
$snippet: PolywrapCoreClient-getInterfaces
```

### getEnvs
```ts
$snippet: PolywrapCoreClient-getEnvs
```

### getResolver
```ts
$snippet: PolywrapCoreClient-getResolver
```

### getEnvByUri
```ts
$snippet: PolywrapCoreClient-getEnvByUri
```

### getManifest
```ts
$snippet: PolywrapCoreClient-getManifest
```

### getFile
```ts
$snippet: PolywrapCoreClient-getFile
```

### getImplementations
```ts
$snippet: PolywrapCoreClient-getImplementations
```

### invokeWrapper
```ts
$snippet: PolywrapCoreClient-invokeWrapper
```

### invoke
```ts
$snippet: PolywrapCoreClient-invoke
```

### tryResolveUri
```ts
$snippet: PolywrapCoreClient-tryResolveUri
```

### loadWrapper
```ts
$snippet: PolywrapCoreClient-loadWrapper
```

## Development

The Polywrap JavaScript client is open-source. It lives within the [Polywrap toolchain monorepo](https://github.com/polywrap/toolchain/tree/origin/packages/js/client). Contributions from the community are welcomed!

### Build
```bash
nvm use && yarn install && yarn build
```

### Test
```bash
yarn test
``