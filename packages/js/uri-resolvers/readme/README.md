# @polywrap/uri-resolvers
<a href="https://www.npmjs.com/package/@polywrap/uri-resolvers-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@polywrap/uri-resolvers-js.svg" alt="npm"/>
</a>

<br/>
<br/>
URI resolvers to customize URI resolution in the Polywrap Client.

## Installation

```bash
npm install --save @polywrap/uri-resolvers-js
```

## Usage

This example is similar to the default resolver used by the ClientConfigBuilder in the @polywrap/client-config-builder-js package.

```ts
$snippet: quickstart-example
```

# Reference

$snippet: aggregator.md

$snippet: cache.md

$snippet: helpers.md

$snippet: static.md

## Development

This package is open-source. It lives within the [Polywrap toolchain monorepo](https://github.com/polywrap/toolchain/tree/origin/packages/js/uri-resolvers). Contributions from the community are welcomed!

### Build
```bash
nvm use && yarn install && yarn build
```

### Test
```bash
yarn test
``