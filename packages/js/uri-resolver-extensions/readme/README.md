# @polywrap/core-client-js
<a href="https://www.npmjs.com/package/@polywrap/uri-resolver-extensions-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@polywrap/uri-resolver-extensions-js.svg" alt="npm"/>
</a>

<br/>
<br/>
Polywrap URI resolver extensions to customize resolution in the Polywrap Client.

## Installation

```bash
npm install --save @polywrap/core-client-js
```

## Usage

TODO

# Reference

## ExtendableUriResolver

```ts
$snippet: ExtendableUriResolver
```

### Properties

#### extInterfaceUri (static)
```ts
$snippet: ExtendableUriResolver-extInterfaceUri-static
```

#### extInterfaceUri
```ts
$snippet: ExtendableUriResolver-extInterfaceUri
```

### constructor
```ts
$snippet: ExtendableUriResolver-constructor
```

### Methods

#### getUriResolvers
```ts
$snippet: ExtendableUriResolver-getUriResolvers
```

#### tryResolverUri
```ts
$snippet: ExtendableUriResolver-tryResolverUri
```

#### getStepDescription (protected)
```ts
$snippet: ExtendableUriResolver-getStepDescription
```

## UriResolverExtensionFileReader
```ts
$snippet: UriResolverExtensionFileReader
```

### constructor
```ts
$snippet: UriResolverExtensionFileReader-constructor
```

### Methods

#### readFile
```ts
$snippet: UriResolverExtensionFileReader-readFile
```

## UriResolverWrapper
```ts
$snippet: UriResolverWrapper
```

### constructor
```ts
$snippet: UriResolverWrapper-constructor
```

### Methods

#### getStepDescription
```ts
$snippet: UriResolverWrapper-getStepDescription
```

#### tryResolveUriWithImplementation
```ts
$snippet: UriResolverWrapper-tryResolveUriWithImplementation
```

#### _tryResolverUri (protected)
```ts
$snippet: UriResolverWrapper-_tryResolverUri
```

## Development

This package is open-source. It lives within the [Polywrap toolchain monorepo](https://github.com/polywrap/toolchain/tree/origin/packages/js/uri-resolver-extensions). Contributions from the community are welcomed!

### Build
```bash
nvm use && yarn install && yarn build
```

### Test
```bash
yarn test
``